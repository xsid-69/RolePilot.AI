import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env" });
import mongoose from "mongoose";
import PersonaModel from "../models/persona.model.js";
import connectDB from "../db/db.js";

const personaData = [
  {
    "name": "Caring Girlfriend",
    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    "background": "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&q=80"
  },
  {
    "name": "Professional Doctor",
    "avatar": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop",
    "background": "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80"
  },
  {
    "name": "Mystic Astrologer",
    "avatar": "https://images.unsplash.com/photo-1515940175183-6798529cc860?w=400&h=400&fit=crop",
    "background": "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80"
  },
  {
    "name": "Chill Best Friend",
    "avatar": "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&h=400&fit=crop",
    "background": "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&q=80"
  },
  {
    "name": "Empathetic Therapist",
    "avatar": "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&h=400&fit=crop",
    "background": "https://images.unsplash.com/photo-1499209974431-9dac3adaf471?w=800&q=80"
  },
  {
    "name": "Career Mentor",
    "avatar": "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=400&fit=crop",
    "background": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
  }
];

const updateImages = async () => {
  try {
    await connectDB();
    for (const data of personaData) {
      await PersonaModel.findOneAndUpdate(
        { name: data.name, isSystem: true },
        { avatar: data.avatar, background: data.background }
      );
      console.log(`Updated images for ${data.name}`);
    }
    console.log("Image management completed successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Update failed:", err);
    process.exit(1);
  }
};

updateImages();
