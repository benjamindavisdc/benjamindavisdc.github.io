import Together from "together-ai"; // Import the TogetherAI package
import cors from "cors"; //
import { loadWorld, saveWorld } from './helpers.js';



const together = new Together(); // Initialize TogetherAI

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
            // Get the user message from the request body
            const { message } = req.body;

            // Send the message to TogetherAI for processing
            const response = await together.chat.completions.create({
                messages: [{"role": "user", "content": message}],
                model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
            });

            // Extract the AI response from the result
            const aiResponse = response.choices[0].message.content;

            // Send back the AI response to the frontend
            res.status(200).json({ response: aiResponse });

        } catch (error) {
            console.error('Error with Together API:', error);
            res.status(500).json({ error: 'Failed to get response from Together API' });
        }
    } else {
        // If it's not a POST request, respond with 405 (Method Not Allowed)
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}