import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

app.post('/api/chat', async (req, res) => {
    try {
        const { personaPrompt, userMessage } = req.body;
        
        const response = await client.chat.completions.create({
            model: 'gemini-2.5-flash',
            messages: [
                {
                    role: 'system',
                    content: personaPrompt
                },
                {
                    role: 'user',
                    content: userMessage
                }
            ]
        });
        
        // Respond with the content of the message
        res.json({ content: response.choices[0].message.content });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ 
            error: 'Failed to get response from API',
            details: error.message 
        });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});