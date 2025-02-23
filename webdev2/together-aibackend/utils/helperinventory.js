
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
        { role: "user", content: `Current Inventory: ${inventory}` },
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


