const dotenv = require("dotenv");
dotenv.config({ path: "./backend/.env" });
const mongoose = require("mongoose");

const fix = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const result = await mongoose.connection.db.collection('personas').updateMany(
            { isSystem: true },
            { $set: { visibility: 'public' } }
        );
        console.log("Updated personas:", result.modifiedCount);
        
        // Final verification
        const count = await mongoose.connection.db.collection('personas').countDocuments({ visibility: 'public' });
        console.log("Total public personas:", count);
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};
fix();
