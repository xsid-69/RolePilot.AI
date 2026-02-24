const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

async function verify() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
        
        // Use the native collection to avoid model registration issues in a quick script
        const Persona = mongoose.connection.db.collection('personas');
        const count = await Persona.countDocuments();
        console.log("Total personas in DB:", count);
        
        const publicPersonas = await Persona.find({ visibility: 'public' }).toArray();
        console.log("Public personas found:", publicPersonas.length);
        
        if (publicPersonas.length > 0) {
            console.log("First public persona name:", publicPersonas[0].name);
        }
        
        process.exit(0);
    } catch (err) {
        console.error("Verification failed:", err);
        process.exit(1);
    }
}

verify();
