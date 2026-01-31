import {Pinecone} from "@pinecone-database/pinecone";

const pc = new Pinecone({
    apiKey:process.env.PINECONE_API_KEY,
})

const rolepilotIndex = pc.Index("rolepilot-index");

async function createMemory({ id, vector, metadata }) {
    await rolepilotIndex.upsert([
        {id : id,
        values : vector,
        metadata}
    ])
}

async function queryMemory({ queryVector , limit = 5 , metadata}){
    const data = await rolepilotIndex.query({
        vector:queryVector,
        topK:limit,
        includeMetadata:true,
        filter:metadata ? {metadata} : undefined
    })
    return data.matches;
}

export {
    createMemory,
    queryMemory
}
