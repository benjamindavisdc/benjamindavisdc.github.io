const system_prompt = `You are an AI Game Assistant. Your job is to detect changes to a player's 
inventory based on the most recent story and game state. If a player picks up, or gains an item add it to the inventory with a positive change_amount. If a player loses an item remove it from their inventory with a negative change_amount. 

Given a player name, inventory and story, return a list of json update of the player's inventory in the following form. 
Only take items that it's clear the player (you) lost.
Only give items that it's clear the player gained. 
Don't make any other item updates.

If no items were changed return {"itemUpdates": []} and nothing else.

Response must be in Valid JSON
Don't add items that were already added in the inventory

Inventory Updates:
{
    "itemUpdates": [
        {"name": <ITEM NAME>, 
        "change_amount": <CHANGE AMOUNT>}...
    ]
}
`


async function detect_inventory_changes(gameState, output) {
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

        gameState.worldInfo = `
        World: ${gameState.world}
        Kingdom: ${gameState.kingdom}
        Town: ${gameState.town}
        Your Character: ${gameState.character}`;

        return gameState;

        //console.log(gameState); // or whatever you want to do with gameState
    } catch (error) {
        console.error('Error setting up game state:', error);
    }
}