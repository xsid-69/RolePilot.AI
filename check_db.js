import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env" });
import mongoose from "mongoose";

const check = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const personas = await mongoose.connection.db.collection('personas').find({ visibility: 'public' }).toArray();
    console.log("Public personas count:", personas.length);
    console.log("Sample:", personas[0]?.name);
    process.exit(0);
};
check();
