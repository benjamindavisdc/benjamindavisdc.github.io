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

// Export functions for use in other modules
export { loadEnv, save_world, load_world, load_remote_world, getTogetherApiKey };
