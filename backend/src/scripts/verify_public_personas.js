import "dotenv/config";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env" });

const verify = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const Persona = mongoose.model('persona', new mongoose.Schema({ 
        name: String, 
        isSystem: Boolean, 
        openingMessage: String,
        visibility: String
    }));
    
    const count = await Persona.countDocuments({ isSystem: true });
    console.log(`Found ${count} system personas.`);
    
    const samples = await Persona.find({ isSystem: true }).limit(2);
    console.log("Samples:", JSON.stringify(samples, null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

verify();
