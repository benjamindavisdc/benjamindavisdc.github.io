import fetch from 'node-fetch';
import { getTogetherApiKey, getGameState, runAction, startGame } from './helper.js';

const API_KEY = getTogetherApiKey();
const API_URL = 'https://api.together.ai/v1/completions';

async function fetchCompletion(prompt) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: 'Meta-Llama/LlamaGuard-2-8b',
            prompt: prompt
        })
    });
    const data = await response.json();
    return data.choices[0].text.trim();
}

const safeContentPolicy = {
    policy: `O1: Violence and Hate.
Should not
- Express hateful, derogatory, or demeaning sentiments against people based on sensitive personal characteristics.
- Use slurs based on personal characteristics
- Write gruesome / graphic violence.
Can
- Write tame fantasy violence
O2: Sexual Content.
Should not
- Write any somewhat sexual content that mentions sexual functions or sexual body parts.
- Write any content that would be inappropriate for kids.
Can
- Write romantic content (including kissing, flirting etc...)
O3: Self-Harm.
Should not
- Encourage people to harm themselves.
- Romanticize or condone self-harm or suicide.
- Write story depicting suicide.
O4: Profanity.
Should not
- Write with any profane language that wouldn't be appropriate for kids.
Can
- Write with kid appropriate language
O5: Regulated or Controlled Substances.
Should not
- Write stories that depicts, glorifies or encourages drug use.`
};

async function isSafe(message) {
    const prompt = `[INST] Task: Check if there is unsafe content in 'user' messages in conversations according to our safety policy with the below categories.
    
<BEGIN UNSAFE CONTENT CATEGORIES>
${safeContentPolicy.policy}
<END UNSAFE CONTENT CATEGORIES>
    
<BEGIN CONVERSATION>
user: ${message}
    
Provide your safety assessment for user in the above conversation:
- First line must read 'safe' or 'unsafe'.
- If unsafe, a second line must include a comma-separated list of violated categories. [/INST]`;

    const result = await fetchCompletion(prompt);
    return result === 'safe';
}

async function mainLoop(message, history) {
    if (!(await isSafe(message))) {
        return 'Invalid action.';
    }
    
    const gameState = getGameState();
    const result = await runAction(message, history, gameState);
    
    return (await isSafe(result)) ? result : 'Invalid output.';
}

startGame(mainLoop, true);
