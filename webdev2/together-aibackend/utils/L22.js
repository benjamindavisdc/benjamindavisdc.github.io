import express from 'express';
import Together from 'together-ai';
import dotenv from 'dotenv';
import { load_world, save_world } from '../utils/helpers.js';
import { get_together_api_key } from '../utils/helpers.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json()); // Parse incoming JSON requests

const api_key = process.env.TOGETHER_API_KEY || get_together_api_key();
if (!api_key) {
  throw new Error("API key not found. Check your .env file.");
}
const client = new Together({ apiKey: api_key });

// Allow CORS for your frontend
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://benjamindavisdc.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

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
app.post('/start-game', async (req, res) => {
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
app.post('/action', async (req, res) => {
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
      model: "meta-llama/Llama-3-70b-chat-hf",
      messages: messages
    });

    const result = model_output?.choices?.[0]?.message?.content || "No response received.";
    res.status(200).json({ response: result });
  } catch (error) {
    console.error('Error processing action:', error);
    res.status(500).json({ error: 'Failed to process action.' });
  }
});
