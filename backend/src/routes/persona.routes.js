import express from "express";
import authUser from "../middlewares/auth.middleware.js";
import { createPersona, getPersonas, updatePersona, deletePersona } from "../controllers/persona.controller.js";
import jwt from "jsonwebtoken";

const router = express.Router();

import userModel from "../models/user.model.js";

// Public route to view available roles
router.get("/", async (req, res, next) => {
    // Optional auth: try to authorize but don't fail if no token
    let token = req.cookies.token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await userModel.findById(decoded.id);
            if (user) {
                req.user = user;
            }
        } catch (e) {
            // Invalid token but we don't care for public route
            console.error(e);
        }
    }
    next();
}, getPersonas);

// Protected routes
router.use(authUser);
router.post("/", createPersona);
router.put("/:id", updatePersona);
router.delete("/:id", deletePersona);

export default router;
