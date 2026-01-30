import { GoogleGenAI } from "@google/genai";

let ai;

async function generateAIResponse(prompt) {
    if (!ai) {
        ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });
    }

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
    });

    return response.text;
}

export default {generateAIResponse};
