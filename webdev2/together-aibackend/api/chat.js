import cors from "cors";
import express from 'express';
import Together from 'together-ai';
import bodyParser from 'body-parser';
import dotenv from "dotenv";
dotenv.config();

import { setupGameState, gameState } from '../utils/helpers.js';



const app = express();
// const PORT = 3000;


const corsOptions = {
    origin: true, // Your frontend's URL
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions))
app.options("/api/chat/start", cors(corsOptions));
app.options("/api/chat/action", cors(corsOptions));


app.use(bodyParser.json());

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Serve static files (HTML, CSS, etc.) from two levels up
// app.use(express.static(path.join(__dirname, "../../"))); 

// // Serve the webdev2.html file when accessing "/"
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "../../webdev2.html"));
// });

const apiKey = process.env.TOGETHER_API_KEY;

if (!apiKey) {
    throw new Error("API key not found. Check your .env file.");
}

const togetherClient = new Together({ apiKey });




const systemPrompt = `You are an AI Game master. Your job is to create a 
start to an adventure based on the world, kingdom, town and character 
a player is playing as. 
Instructions:
You must only use 2-4 sentences 
Write in second person. For example: "You are Jack" 
Write in present tense. For example "You stand at..." 
First describe the character and their backstory. 
Then describe where they start and what they see around them.`;



async function generateStart() {
    try {

      // const worldInfo = `
      // World: ${gameState.world}
      // Kingdom: ${gameState.kingdom}
      // Town: ${gameState.town}
      // Your Character: ${gameState.character}`;

      const response = await togetherClient.chat.completions.create({
        model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
        temperature: 1.0,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: gameState.worldInfo + "\nYour Start:" },
        ],
      });
      
      console.log("Generated World:", gameState.worldInfo);
      //console.log("LLM Response:", response);
  
      if (!response.choices || response.choices.length === 0) {
        throw new Error("No choices received from LLM");
      }
  
      gameState.start = response.choices[0].message.content;
    } catch (error) {
      console.error("Error generating start:", error);
      gameState.start = "Error: Unable to generate game start.";
    }
  }
  



async function runAction(message, history) {
  
    const systemPrompt = `You are an AI Game master. Your job is to write what 
    happens next in a player's adventure game.
    Instructions:
    You must only write 1-3 sentences in response.
    Always write in second person present tense.
    Ex. (You look north and see...)`;
  
    let messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: gameState.worldInfo },
    ];
  
    history.forEach((action) => {
      messages.push({ role: "assistant", content: action[0] });
      messages.push({ role: "user", content: action[1] });
    });
  
    messages.push({ role: "user", content: message });
  
    console.log("Messages array:", JSON.stringify(messages, null, 2));

    try {
      const response = await togetherClient.chat.completions.create({
        model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
        messages: messages,
      });
  
      //console.log("LLM Response:", response); // Debugging line
  
      if (!response.choices || response.choices.length === 0) {
        throw new Error("No choices received from LLM");
      }

      
  
      return response.choices[0].message.content;
    } catch (error) {
      console.error("Error in runAction:", error);
      return "Error: Unable to process action.";
    }
}



app.post("/api/chat/start", async (req, res) => {
  try {
      await setupGameState();
      await generateStart();
      res.status(200).json({ message: "Game started", start: gameState.start });
  } catch (error) {
      console.error('Error processing the request:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Second POST handler - runs an action in the game
app.post("/api/chat/action", async (req, res) => {
  try {
      const { message, history } = req.body;
      const result = await runAction(message, history);
      res.status(200).json({ result });
  } catch (error) {
      console.error('Error processing the request:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

export default app;
