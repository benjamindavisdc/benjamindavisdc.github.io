
import Together from 'together-ai';

const apiKey = process.env.TOGETHER_API_KEY;

if (!apiKey) {
    throw new Error("API key not found. Check your .env file.");
}

const togetherClient = new Together({ apiKey });

export {detectInventoryChanges, updateInventory}

async function detectInventoryChanges(gameState, output) {

    const systemPrompt = `You are an AI Game Assistant. \
    Your job is to detect changes to a player's \
    inventory based on the most recent story and game state.\
    If a player picks up, or gains an item add it to the inventory \
    with a positive change_amount.\
    If a player loses an item remove it from their inventory \
    with a negative change_amount.\
    Given a player name, inventory and story, return a list of json update\
    of the player's inventory in the following form.\
    Only take items that it's clear the player (you) lost.\
    Only give items that it's clear the player gained.\
    Don't make any other item updates.\
    If no items were changed return {"itemUpdates": []}\
    and nothing else.\
    \
    Response must be in Valid JSON\
    Don't add items that were already added in the inventory\
    \
    Inventory Updates:\
    {\
        "itemUpdates": [\
            {"name": <ITEM NAME>,\
            "change_amount": <CHANGE AMOUNT>}...\
        ]\
    }`;


    const inventory = gameState.inventory;
    const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Current Inventory: ${JSON.stringify(inventory)}` },
        { role: "user", content: `Recent Story: ${output}` },
        { role: "user", content: "Inventory Updates" }
    ];

    const chatCompletion = await togetherClient.chat.completions.create({
        model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
        messages: messages,
    });

    const response = JSON.parse(chatCompletion.choices[0].message.content);
    return response.itemUpdates;
}




async function updateInventory(inventory, itemUpdates) {
    let updateMsg = '';
    
    for (const update of itemUpdates) {
        const { name, change_amount } = update;
        
        if (change_amount > 0) {
            inventory[name] = (inventory[name] || 0) + change_amount;
            updateMsg += `\nInventory: ${name} +${change_amount}`;
        } else if (inventory[name] && change_amount < 0) {
            inventory[name] += change_amount;
            updateMsg += `\nInventory: ${name} ${change_amount}`;
            if (inventory[name] <= 0) delete inventory[name];
        }
    }
    return updateMsg;
}



async function runAction(message, history, gameState) {
    if (message === 'start game') return gameState.start;

    const systemPrompt = `You are an AI Game master. Your job is to write what \
happens next in a player's adventure game.\
Instructions: \
You must only write 1-3 sentences in response.\
Always write in second person present tense.\
Ex. (You look north and see...)\
Don't let the player use items they don't have in their inventory.`;

    const worldInfo = `\nWorld: ${gameState.world}\nKingdom: ${gameState.kingdom}\nTown: ${gameState.town}\nYour Character: ${gameState.character}\nInventory: ${JSON.stringify(gameState.inventory)}`;

    const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: worldInfo }
    ];
    
    for (const action of history) {
        messages.push({ role: "assistant", content: action[0] });
        messages.push({ role: "user", content: action[1] });
    }
    
    messages.push({ role: "user", content: message });
    
    const modelOutput = await client.chat.completions.create({
        model: "meta-llama/Llama-3-70b-chat-hf",
        messages
    });
    
    return modelOutput.choices[0].message.content;
}


async function mainLoop(message, history) {
    const gameState = getGameState({
        inventory: {
            "Sword of Just Ice": 1,
            "Tabard of a Cat in a Tree": 1,
            "Rolls of gauze": 12,
            "leather bound journal": 1,
            "gold": 45000
        }
    });

    let output = await runAction(message, history, gameState);
    if (!isSafe(output)) return 'Invalid Output';
    
    const itemUpdates = await detectInventoryChanges(gameState, output);
    output += await updateInventory(gameState.inventory, itemUpdates);
    
    return output;
}

// startGame(mainLoop, true);