// Import necessary modules
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables from the .env file
function loadEnv() {
    dotenv.config();
}

// Save the world object to a file
function save_world(world, filename) {
    fs.writeFileSync(filename, JSON.stringify(world, null, 2), 'utf8');
}

// Load the world object from a file
function load_world(filename) {
    const data = fs.readFileSync(filename, 'utf8');
    return JSON.parse(data);
}

async function load_remote_world(url){
    try {
        const response = await fetch(url);
        if (!response.ok){
            throw new Error(`Failed to fetch from ${url}`);
        }
        const data = await response.text();
        return JSON.parse(data)
    } catch (error){
        console.error(`Error loading world:`, error)
    }
}
// Get the Together API key from environment variables
function getTogetherApiKey() {
    loadEnv();
    return process.env.TOGETHER_API_KEY;
}

export let gameState = {
    worldInfo: null,
  };

  async function setupGameState() {
    try {
        // Load the world data
        const world = await load_remote_world('https://raw.githubusercontent.com/benjamindavisdc/benjamindavisdc.github.io/refs/heads/main/webdev2/together-aibackend/public/Saves/Willowbrook2.json');
        
        // Extract relevant data for kingdom, town, and character
        const kingdom = world['kingdoms']['Sunshine Kingdom'];
        const town = kingdom['towns']['Mistwood'];
        const character = town['npcs']['Sir Bumble'];

        // Construct the game state
        gameState = {
            world: world.description,
            kingdom: kingdom.description,
            town: town.description,
            character: character.description,
            inventory: character.inventory,
            start: "", // Start will be populated dynamically
        };

        // Set world Info after the game state is fully constructed
        gameState.worldInfo = `
            World: ${gameState.world}
            Kingdom: ${gameState.kingdom}
            Town: ${gameState.town}
            Your Character: ${gameState.character}
            Your Inventory: ${gameState.inventory}`;

        // Log the gameState after it's fully updated
        console.log(gameState);

        return gameState;

    } catch (error) {
        console.error('Error setting up game state:', error);
    }
}


// Export functions for use in other modules
export { loadEnv, save_world, load_world, load_remote_world, getTogetherApiKey, setupGameState }; //gamestate is exported earlier on
