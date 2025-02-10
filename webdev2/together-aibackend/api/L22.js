import express from 'express';
import Together from 'together-ai';
import dotenv from 'dotenv';
import { load_world, save_world } from '../utils/helpers.js';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json()); // Parse incoming JSON requests


const client = new Together(); // Initialize TogetherAI


// CORS configuration
const corsOptions = {
  origin: 'https://benjamindavisdc.github.io', // Your frontend's URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};
//app.use(cors(corsOptions));

// Load initial game state
const world = load_world('../Saves/Willowbrook2.json');
const kingdom = world['kingdoms']['Sunshine Kingdom'];
const town = kingdom['towns']['Mistwood'];
const character = town['npcs']['Sir Bumble'];

const system_prompt = `You are an AI Game master. Your job is to create a 
start to an adventure based on the world, kingdom, town and character 
a player is playing as. Instructions: 
You must only use 2-4 sentences. Write in second person. For example: "You are Jack". Write in present tense.`;

const world_info = `World: ${world}\nKingdom: ${kingdom}\nTown: ${town}\nYour Character: ${character}`;

async function generate_start() {
  const model_output = await client.chat.completions.create({
    model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
    temperature: 1.0,
    messages: [
      { role: "system", content: system_prompt },
      { role: "user", content: `${world_info}\nYour Start:` }
    ]
  });
  return model_output?.choices?.[0]?.message?.content || "No start generated.";
}

// Store game state
const game_state = {
  world: world.description,
  kingdom: kingdom.description,
  town: town.description,
  character: character.description,
  start: "", // Start will be populated dynamically
};

// Endpoint to start the game
app.post('/start-game', cors(corsOptions), async (req, res) => {
    try {
      game_state.start = await generate_start();
      save_world(world, '../Saves/Willowbrook2.json'); // Save updated world state
      res.status(200).json({ start: game_state.start });
    } catch (error) {
      console.error('Error generating game start:', error);
      res.status(500).json({ error: 'Failed to start game.' });
    }
  });
  
  // Main action loop endpoint
  app.post('/action', cors(corsOptions), async (req, res) => {
    try {
      const { message, history } = req.body;
  
      if (!message) {
        return res.status(400).json({ error: 'Message is required.' });
      }


    const system_prompt = `You are an AI Game master. Your job is to write what happens next in a player's adventure game. Instructions: You must only write 1-3 sentences in response. Always write in second person present tense.`;

    const world_info = `World: ${game_state.world}\nKingdom: ${game_state.kingdom}\nTown: ${game_state.town}\nYour Character: ${game_state.character}`;

    const messages = [
      { role: "system", content: system_prompt },
      { role: "user", content: world_info }
    ];

    // Append history to messages
    history.forEach(([assistant, user]) => {
      messages.push({ role: "assistant", content: assistant });
      messages.push({ role: "user", content: user });
    });

    messages.push({ role: "user", content: message });

    const model_output = await client.chat.completions.create({
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
      messages: messages
    });

    const result = model_output?.choices?.[0]?.message?.content || "No response received.";
    res.status(200).json({ response: result });
  } catch (error) {
    console.error('Error processing action:', error);
    res.status(500).json({ error: 'Failed to process action.' });
  }
});
// Export handler for serverless function
export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    // Handle preflight request
    res.status(200).end();
  } else {
    app(req, res); // Process the request with Express handler
  }
}