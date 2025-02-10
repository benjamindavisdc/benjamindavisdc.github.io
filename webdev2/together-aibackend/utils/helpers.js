// Import necessary modules
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables from the .env file
function loadEnv() {
    dotenv.config();
}

// Save the world object to a file
function saveWorld(world, filename) {
    fs.writeFileSync(filename, JSON.stringify(world, null, 2), 'utf8');
}

// Load the world object from a file
function load_world(filename) {
    const data = fs.readFileSync(filename, 'utf8');
    return JSON.parse(data);
}

// Get the Together API key from environment variables
function getTogetherApiKey() {
    loadEnv();
    return process.env.TOGETHER_API_KEY;
}

// Export functions for use in other modules
export { loadEnv, saveWorld, load_world, getTogetherApiKey };
