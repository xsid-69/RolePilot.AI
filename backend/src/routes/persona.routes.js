import express from "express";
import authUser from "../middlewares/auth.middleware.js";
import { createPersona, getPersonas, updatePersona, deletePersona } from "../controllers/persona.controller.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Public route to view available roles
router.get("/", (req, res, next) => {
    // Optional auth: try to authorize but don't fail if no token
    const token = req.cookies.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // We just need the ID for the query, controller handles the rest
            req.user = { _id: decoded.id };
        } catch (e) {
            // Invalid token but we don't care for public route
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
