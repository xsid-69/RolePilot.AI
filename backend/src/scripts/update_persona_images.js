import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env" });
import mongoose from "mongoose";
import PersonaModel from "../models/persona.model.js";
import connectDB from "../db/db.js";

const personaData = [
  {
    "name": "Caring Girlfriend",
    "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
    "background": "https://images.unsplash.com/photo-1516589174184-c68526514282?w=800&q=80"
  },
  {
    "name": "Professional Doctor",
    "avatar": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
    "background": "https://images.unsplash.com/photo-1505751172107-12932972ee7d?w=800&q=80"
  },
  {
    "name": "Mystic Astrologer",
    "avatar": "https://images.unsplash.com/photo-1515940175183-6798529cc860?w=400&h=400&fit=crop",
    "background": "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=800&q=80"
  },
  {
    "name": "Chill Best Friend",
    "avatar": "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop",
    "background": "https://images.unsplash.com/photo-1531055033036-f633a6a163af?w=800&q=80"
  },
  {
    "name": "Senior Software Engineer",
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    "background": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80"
  },
  {
    "name": "Career Mentor",
    "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    "background": "https://images.unsplash.com/photo-1454165833767-02302307ef1d?w=800&q=80"
  },
  {
    "name": "Technical Interviewer",
    "avatar": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
    "background": "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80"
  },
  {
    "name": "Empathetic Therapist",
    "avatar": "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop",
    "background": "https://images.unsplash.com/photo-1516302752625-fbc3c8c1fa07?w=800&q=80"
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
    console.log("Update completed.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

updateImages();
