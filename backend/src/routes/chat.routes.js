import express from "express";
import authUser from "../middlewares/auth.middleware.js";
import { createChat } from "../controllers/chat.controller.js";


const router = express.Router();

router.post("/", authUser, createChat);




export default router;