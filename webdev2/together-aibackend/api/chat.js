import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config(); // Loads the environment variables from the .env file

const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;

res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'POST');

if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
}


export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            // Get the message from the request body
            const { message } = req.body;

            // Make the API request to TogetherAI
            const response = await axios.post('https://api.together.ai/v1/completions', {
                messages: [{"role": "user", "content": message}],
                model: "meta-llama/Llama-3.3-70B-Instruct-Turbo"
            }, {
                headers: {
                    'Authorization': `Bearer ${TOGETHER_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            });

            // Send the response back to the frontend
            const aiResponse = response.data.choices[0].message.content;
            res.status(200).json({ response: aiResponse });

        } catch (error) {
            console.error('Error with Together API:', error);
            res.status(500).json({ error: 'Failed to get response from Together API' });
        }
    } else {
        // If not a POST request, send 405 (Method Not Allowed)
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
