import express from "express";
import authUser from "../middlewares/auth.middleware.js";
import { createChat, getAllChats, getMessages } from "../controllers/chat.controller.js";


const router = express.Router();

router.post("/", authUser, createChat);
router.get("/", authUser, getAllChats);
router.get("/:chatId/messages", authUser, getMessages);




export default router;