import cors from "cors";
import express from 'express';
import Together from 'together-ai';
import bodyParser from 'body-parser';
import dotenv from "dotenv";
dotenv.config();

import { load_remote_world } from '../utils/helpers.js';



const app = express();
// const PORT = 3000;


const corsOptions = {
    origin: '*', // Your frontend's URL
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));

if (req.method === 'OPTIONS') {
  res.status(200).end(); // Respond to preflight with a successful status
  return;
}

// Handle POST/GET request here
if (req.method === 'POST') {
  const data = req.body; // Handle your request and interact with LLM
  // Process the request and send response
  res.status(200).json({ message: 'Success', data });
} else {
  res.status(405).json({ message: 'Method Not Allowed' });
};

app.use(bodyParser.json());

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Serve static files (HTML, CSS, etc.) from two levels up
// app.use(express.static(path.join(__dirname, "../../"))); 

// // Serve the webdev2.html file when accessing "/"
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "../../webdev2.html"));
// });

const togetherClient = new Together({ apiKey: process.env.TOGETHER_API_KEY });

let gameState = {};

async function setupGameState() {
    try {
        const world = await load_remote_world('https://raw.githubusercontent.com/benjamindavisdc/benjamindavisdc.github.io/refs/heads/main/webdev2/together-aibackend/public/Saves/Willowbrook2.json');
        const kingdom = world['kingdoms']['Sunshine Kingdom'];
        const town = kingdom['towns']['Mistwood'];
        const character = town['npcs']['Sir Bumble'];

        // Setup game state after all the data is loaded
        gameState = {
            world: world.description,
            kingdom: kingdom.description,
            town: town.description,
            character: character.description,
            start: "", // Start will be populated dynamically
        };

        console.log(gameState); // or whatever you want to do with gameState
    } catch (error) {
        console.error('Error setting up game state:', error);
    }
}


const systemPrompt = `You are an AI Game master. Your job is to create a 
start to an adventure based on the world, kingdom, town and character 
a player is playing as. 
Instructions:
You must only use 2-4 sentences 
Write in second person. For example: "You are Jack" 
Write in present tense. For example "You stand at..." 
First describe the character and their backstory. 
Then describe where they start and what they see around them.`;

const worldInfo = `
World: ${gameState.world}
Kingdom: ${gameState.kingdom}
Town: ${gameState.town}
Your Character: ${gameState.character}`;

async function generateStart() {
    try {
      const response = await togetherClient.chat.completions.create({
        model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
        temperature: 1.0,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: worldInfo + "\nYour Start:" },
        ],
      });
  
      //console.log("LLM Response:", response); // Debugging line
  
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
      { role: "user", content: worldInfo },
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



app.post("/api/chat", async (req, res) => {
  await setupGameState();
  await generateStart();
  res.json({ message: "Game started", start: gameState.start });
});

app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;
  const result = await runAction(message, history);
  res.json({ result });
});

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

export default app;
