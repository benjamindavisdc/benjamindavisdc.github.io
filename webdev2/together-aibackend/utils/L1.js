import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import Together from 'together-ai'; // Assuming "together-ai" is installed

// Load environment variables from .env
dotenv.config();

// System and world prompts
const system_prompt = `
Your job is to help create interesting fantasy worlds that 
players would love to play in.
Instructions:
- Only generate in plain text without formatting.
- Use simple clear language without being flowery.
- You must stay below 3-5 sentences for each description.
`;

const world_prompt = `
Generate a creative description for a unique fantasy world that houses a knight named Sir Bumble: Sir Bumble and the Quest for Kindness

Once upon a time, in the cheerful town of Willowbrook, there lived a knight named Sir Bumble. Though he wasn’t the bravest, fastest, or most coordinated knight in the land, he had a heart as big as his dented, slightly too-small helmet. His favorite pastime was helping the townsfolk, even if things didn’t always go as planned.

One sunny morning, Sir Bumble decided to brighten everyone’s day. He marched into the bakery, where Mrs. Pumpernickel struggled to carry a tray of freshly baked pies.

"Let me assist, good madam!" he said, puffing out his chest.

But as soon as he grabbed the tray, he tripped on his own scabbard. The pies went flying, landing on Sir Bumble's head with an elegant splurt. Mrs. Pumpernickel sighed, but she couldn’t stay mad. Sir Bumble's sheepish grin, now framed by a crusty blueberry pie, was impossible to resist.

Determined to redeem himself, Sir Bumble trotted over to Farmer Tilly’s field, where a stubborn cow named Bessie had wandered into the mud.

"Fear not, fair farmer! I shall rescue your bovine!" he declared.

With a mighty heave, Sir Bumble tugged at Bessie. But instead of freeing the cow, he slipped, landed face-first in the mud, and somehow ended up wearing Farmer Tilly’s scarecrow hat. Bessie, unimpressed, walked out of the mud on her own.

Still, Sir Bumble wouldn’t give up. He heard cries for help near the town well, where a puppy had become stuck on a ledge.

"Aha! A task worthy of my skill!" he exclaimed.

Sir Bumble climbed the well, but as he reached for the puppy, his armor caught on the rope. With a loud clank, he ended up dangling upside down, spinning slowly while the puppy hopped back to safety on its own. The townsfolk couldn’t help but chuckle as Sir Bumble waved awkwardly from above.

Despite his mishaps, the people of Willowbrook loved their clumsy knight. He always tried his best, and his determination to help, no matter how bruised or pie-covered he became, warmed their hearts.

Output content in the form:
World Name: <WORLD NAME>
World Description: <WORLD DESCRIPTION>

World Name:
`;

const apiKey = process.env.TOGETHER_API_KEY;

if (!apiKey) {
    throw new Error("API key not found. Check your environment variables or .env file.");
}

const together = new Together(apiKey);

// Save world description to file
// Save world description to file
function saveWorld(world, filename) {
    const directory = path.dirname(filename); // Get the directory from the filename
    fs.mkdirSync(directory, { recursive: true }); // Create the directory if it doesn't exist
    fs.writeFileSync(path.resolve(filename), JSON.stringify(world, null, 2), 'utf-8'); // Write the file
    console.log(`World saved to ${filename}`);
}


// Load world description from file
function loadWorld(filename) {
    const filePath = path.resolve(filename);
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filename}`);
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
}

// Example call (update file path if needed)
// saveWorld({ name: "Willowbrook", description: "A cheerful land with a clumsy yet lovable knight." }, 'fantasyWorld.json');
// console.log(loadWorld('fantasyWorld.json'));


const client = new Together(apiKey);

const output = await client.chat.completions.create({
    model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
    messages: [
        { role: "system", content: system_prompt },
        { role: "user", content: world_prompt }
    ]
});

let world_output = output.choices[0].message.content;
console.log(world_output);

world_output = world_output.trim();
const world = {
    name: world_output.split('\n')[0].trim().replace('World Name: ', ''),
    description: world_output.split('\n').slice(1).join('\n').replace('World Description:', '').trim()
};

// const world is now ready
const kingdom_prompt = `
Create 3 different kingdoms for a fantasy world.
For each kingdom generate a description based on the world it's in. 
Describe important leaders, cultures, history of the kingdom.

Output content in the form:
Kingdom 1 Name: <KINGDOM NAME>
Kingdom 1 Description: <KINGDOM DESCRIPTION>
Kingdom 2 Name: <KINGDOM NAME>
Kingdom 2 Description: <KINGDOM DESCRIPTION>
Kingdom 3 Name: <KINGDOM NAME>
Kingdom 3 Description: <KINGDOM DESCRIPTION>

World Name: ${world.name}
World Description: ${world.description}

Kingdom 1`;

const outputKingdoms = await client.chat.completions.create({
    model: "meta-llama/Llama-3-70b-chat-hf",
    messages: [
        { role: "system", content: system_prompt },
        { role: "user", content: kingdom_prompt }
    ]
});

const kingdoms = {};
let kingdoms_output = outputKingdoms.choices[0].message.content;

kingdoms_output.split('\n\n').forEach(output => {
    const kingdom_name = output.trim().split('\n')[0].split('Name: ')[1].trim();
    console.log(`Created kingdom "${kingdom_name}" in ${world.name}`);

    const kingdom_description = output.trim().split('\n')[1].split('Description: ')[1].trim();
    const kingdom = {
        name: kingdom_name,
        description: kingdom_description,
        world: world.name
    };

    kingdoms[kingdom_name] = kingdom;
});

world.kingdoms = kingdoms;

console.log(`\nKingdom 1 Description: ${kingdoms[Object.keys(kingdoms)[0]].description}`);

function getTownPrompt(world, kingdom) {
    return `
    Create 3 different towns for a fantasy kingdom and world. 
    Describe the region it's in, important places of the town, 
    and interesting history about it. 
    
    Output content in the form:
    Town 1 Name: <TOWN NAME>
    Town 1 Description: <TOWN DESCRIPTION>
    Town 2 Name: <TOWN NAME>
    Town 2 Description: <TOWN DESCRIPTION>
    Town 3 Name: <TOWN NAME>
    Town 3 Description: <TOWN DESCRIPTION>
    
    World Name: ${world.name}
    World Description: ${world.description}
    
    Kingdom Name: ${kingdom.name}
    Kingdom Description: ${kingdom.description}
    
     Town 1 Name:`;
}

async function createTowns(world, kingdom) {
    console.log(`\nCreating towns for kingdom: ${kingdom.name}...`);

    const output = await client.chat.completions.create({
        model: "meta-llama/Llama-3-70b-chat-hf",
        messages: [
            { role: "system", content: system_prompt },
            { role: "user", content: getTownPrompt(world, kingdom) }
        ]
    });

    let towns_output = output.choices[0].message.content;
    const towns = {};

    towns_output.split('\n\n').forEach(output => {
        const town_name = output.trim().split('\n')[0].split('Name: ')[1].trim();
        console.log(`- ${town_name} created`);

        const town_description = output.trim().split('\n')[1].split('Description: ')[1].trim();

        const town = {
            name: town_name,
            description: town_description,
            world: world.name,
            kingdom: kingdom.name
        };

        towns[town_name] = town;
    });

    kingdom.towns = towns;
}

for (const kingdom of Object.values(kingdoms)) {
    await createTowns(world, kingdom);
}

const firstKingdom = Object.values(kingdoms)[0]; // Grab the first kingdom
if (firstKingdom && firstKingdom.towns) {
    const town = Object.values(firstKingdom.towns)[0];
    console.log(`\nTown 1 Description: ${town.description}`);
} else {
    console.error('No towns found for the first kingdom');
}

function getNpcPrompt(world, kingdom, town) {
    return `
    Create 3 different characters based on the world, kingdom
    and town they're in. Describe the character's appearance and
    profession, as well as their deeper pains and desires.
    
    Output content in the form:
    Character 1 Name: <CHARACTER NAME>
    Character 1 Description: <CHARACTER DESCRIPTION>
    Character 2 Name: <CHARACTER NAME>
    Character 2 Description: <CHARACTER DESCRIPTION>
    Character 3 Name: <CHARACTER NAME>
    Character 3 Description: <CHARACTER DESCRIPTION>
    
    World Name: ${world.name}
    World Description: ${world.description}
    
    Kingdom Name: ${kingdom.name}
    Kingdom Description: ${kingdom.description}
    
    Town Name: ${town.name}
    Town Description: ${town.description}
    
    Character 1 Name:`;
}

async function createNpcs(world, kingdom, town) {
    console.log(`\nCreating characters for the town of: ${town.name}...`);

    const output = await client.chat.completions.create({
        model: "meta-llama/Llama-3-70b-chat-hf",
        messages: [
            { role: "system", content: system_prompt },
            { role: "user", content: getNpcPrompt(world, kingdom, town) }
        ],
        temperature: 0
    });

    let npcs_output = output.choices[0].message.content;
    const npcs = {};

    npcs_output.split('\n\n').forEach(output => {
        const npc_name = output.trim().split('\n')[0].split('Name: ')[1].trim();
        console.log(`- "${npc_name}" created`);

        const npc_description = output.trim().split('\n')[1].split('Description: ')[1].trim();

        const npc = {
            name: npc_name,
            description: npc_description,
            world: world.name,
            kingdom: kingdom.name,
            town: town.name
        };

        npcs[npc_name] = npc;
    });

    town.npcs = npcs;
}

for (const kingdom of Object.values(kingdoms)) {
    for (const town of Object.values(kingdom.towns)) {
        await createNpcs(world, kingdom, town);
    }
    // For now we'll only generate npcs for one kingdom
    break;
}


const firstTown = Object.values(firstKingdom.towns)[0]; // Grab the first kingdom
if (firstTown && firstTown.npcs) {
    const npc = Object.values(firstTown.npcs)[0];
    console.log(`\nNpc 1 Description: ${npc.description}`);
} else {
    console.error('No npcs found for the first town');
}


// function saveWorld(world, filename) {
//     const directory = path.dirname(filename);
//     fs.mkdirSync(directory, { recursive: true });
//     fs.writeFileSync(filename, JSON.stringify(world, null, 2));
// }

// function loadWorld(filename) {
//     const data = fs.readFileSync(filename, 'utf-8');
//     return JSON.parse(data);
// }

saveWorld(world, '../Saves/Willowbrook2.json');
saveWorld(world, '../Saves/YourWorld_L1py.json'); // save to your version


export { saveWorld, loadWorld, system_prompt, world_prompt };