import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Together from "together-ai";

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); // Parse incoming JSON

const apiKey = process.env.TOGETHER_API_KEY;

if (!apiKey) {
    throw new Error("API key not found. Check your .env file.");
}

const together = new Together({ apiKey });

app.post('/api/message', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const response = await together.chat.completions.create({
            messages: [{ role: "user", content: message }],
            model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
        });

        const aiResponse = response?.choices?.[0]?.message?.content || "No response received.";
        res.status(200).json({ response: aiResponse });

    } catch (error) {
        console.error('Error with Together API:', error);
        res.status(500).json({ error: 'Failed to get response from Together API' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
