import { GoogleGenAI } from "@google/genai";

let ai; // Lazy-initialized AI instance

function getClient() {
    if (!ai) {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is not configured");
        }
        ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return ai;
}

// Errors that are worth retrying (transient server / rate-limit issues)
const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);

function getErrorStatus(error) {
    return error?.status ?? error?.code ?? error?.response?.status;
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Runs an async operation with exponential backoff for transient errors.
 */
async function withRetry(operation, { retries = 4, baseDelay = 800 } = {}) {
    let lastError;
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;
            const status = getErrorStatus(error);

            if (!RETRYABLE_STATUS.has(Number(status)) || attempt === retries) {
                throw error;
            }

            // Exponential backoff with jitter
            const delay = baseDelay * 2 ** attempt + Math.floor(Math.random() * 250);
            console.warn(
                `AI request failed with status ${status}. Retrying in ${delay}ms (attempt ${attempt + 1}/${retries})`
            );
            await sleep(delay);
        }
    }
    throw lastError;
}

async function generateAIResponse(prompt, systemInstruction = null) {
    const client = getClient();

    const request = {
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            temperature: 0.7,
            ...(systemInstruction ? { systemInstruction } : {})
        }
    };

    const response = await withRetry(() => client.models.generateContent(request));

    const text = typeof response.text === "function" ? response.text() : response.text;

    if (!text) {
        throw new Error("AI returned an empty response");
    }

    return text;
}

async function generateVector(content) {
    const client = getClient();

    const response = await withRetry(() =>
        client.models.embedContent({
            model: "gemini-embedding-001",
            contents: content,
            config: {
                outputDimensionality: 768
            }
        })
    );

    if (response.embedding) {
        return response.embedding.values;
    } else if (response.embeddings && response.embeddings.length > 0) {
        return response.embeddings[0].values;
    }

    console.error("Unexpected embedding response structure:", response);
    throw new Error("Failed to generate vector");
}

export default { generateAIResponse, generateVector };
