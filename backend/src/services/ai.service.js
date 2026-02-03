import { GoogleGenAI } from "@google/genai"; 
let ai; // AI instance

async function generateAIResponse(prompt, systemInstruction = null) {
    if (!ai) {
        ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });
    }

    const config = {
        model: "gemini-2.5-flash",
        contents: prompt
    };
    console.log("AI Service: Sending prompt to Gemini:", JSON.stringify(prompt, null, 2)); // CRITICAL DEBUG LOG

    if (systemInstruction) {
        config.config = { systemInstruction: systemInstruction };
    }

    const response = await ai.models.generateContent(config);
    console.log("Gemini Response Keys:", Object.keys(response));
    console.log("Gemini Response Text Type:", typeof response.text);
    console.log("Gemini Response Text Value:", response.text);
    if (typeof response.text === 'function') {
        return response.text();
    }
    return response.text;
}

async function generateVector(content){
    if (!ai) {
        ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });
    }
    const response = await ai.models.embedContent({
        model:"gemini-embedding-001",
        contents:content,
        config:{
            outputDimensionality:768
        }
    })
    console.log("Embedding Response Keys:", Object.keys(response));
    if (response.embedding) {
        return response.embedding.values;
    } else if (response.embeddings && response.embeddings.length > 0) {
        return response.embeddings[0].values;
    } else {
        console.error("Unexpected embedding response structure:", response);
        throw new Error("Failed to generate vector");
    }
}

export default {generateAIResponse,generateVector};
