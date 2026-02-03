import { Pinecone } from "@pinecone-database/pinecone";

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

const rolepilotIndex = pc.index('rolepilotai');
console.log("Vector Service Initialized");

async function createMemory({ id, vector, metadata }) {
    try {
        await rolepilotIndex.upsert([{
            id: id,
            values: vector,
            metadata
        }]);
    } catch (error) {
        console.error("VectorService Error:", error);
    }
}


async function queryMemory({ queryVector, limit = 5, metadata }) {
    try {
        const data = await rolepilotIndex.query({
            vector: queryVector,
            topK: limit,
            filter: (metadata && Object.keys(metadata).length > 0) ? metadata : undefined,
            includeMetadata: true
        });

        return data.matches || [];
    } catch (error) {
        console.error("VectorService Query Error:", error);
        return [];
    }
}

export { createMemory, queryMemory };