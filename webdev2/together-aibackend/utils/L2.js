import Together from 'together-ai';
import { load_world, saveWorld } from './helpers.js';
import { getTogetherApiKey } from './helpers.js';
import cors from "cors"; //

const client = new Together({ apiKey: getTogetherApiKey() });

const corsOptions = {
    origin: 'https://benjamindavisdc.github.io', // Your frontend's URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
};

export default async function handler(req, res) {
    // Use CORS for this API handler
    cors(corsOptions)(req, res, () => {});

    if (req.method === 'POST') {
        try {
            main_loop()

        } catch (error) {
            console.error('Error with Together API:', error);
            res.status(500).json({ error: 'Failed to get response from Together API' });
        }
    } else {
        // If it's not a POST request, respond with 405 (Method Not Allowed)
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}

const world = load_world('../Saves/YourWorld_L1js.json');
const kingdom = world['kingdoms']['Sunshine Kingdom'];
const town = kingdom['towns']['Mistwood'];
const character = town['npcs']['Sir Bumble'];

const system_prompt = `You are an AI Game master. Your job is to create a 
start to an adventure based on the world, kingdom, town and character 
a player is playing as. 
Instructions:
You must only use 2-4 sentences 
Write in second person. For example: "You are Jack" 
Write in present tense. For example "You stand at..." 
First describe the character and their backstory. 
Then describe where they start and what they see around them.`;

const world_info = `
World: ${world}
Kingdom: ${kingdom}
Town: ${town}
Your Character: ${character}
`;

function start_game(main_loop) {
    main_loop()
}

const model_output = await client.chat.completions.create({
    model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
    temperature: 1.0,
    messages: [
        { role: "system", content: system_prompt },
        { role: "user", content: world_info + '\nYour Start:' }
    ]
});

const start = model_output.choices[0].message.content;
console.log(start);
//
world['start'] = start;
// saveWorld(world, '../shared_data/Kyropeia.json');  // preserve video version
saveWorld(world, '../Saves/YourWorld_L1py.json');


function run_action(message, history =[], game_state) {
    if (!Array.isArray(history)) {
        history = [];
    }
    if (message === 'start game') {
game_state['start'];
    }

    const system_prompt = `You are an AI Game master. Your job is to write what 
happens next in a player's adventure game.
Instructions: 
You must only write 1-3 sentences in response.
Always write in second person present tense.
Ex. (You look north and see...)`;

    const world_info = `
World: ${game_state['world']}
Kingdom: ${game_state['kingdom']}
Town: ${game_state['town']}
Your Character: ${game_state['character']}`;

    const messages = [
        { role: "system", content: system_prompt },
        { role: "user", content: world_info }
    ];

    history.forEach(action => {
        messages.push({ role: "assistant", content: action[0] });
        messages.push({ role: "user", content: action[1] });
    });

    messages.push({ role: "user", content: message });

    const model_output = client.chat.completions.create({
        model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
        messages: messages
    });

    const result = model_output.choices[0].message.content;
    return result;
}

const game_state = {
    world: world['description'],
    kingdom: kingdom['description'],
    town: town['description'],
    character: character['description'],
    start: start
};

function main_loop(message, history) {
    return run_action(message, history, game_state);
}
//start_game(main_loop, true);