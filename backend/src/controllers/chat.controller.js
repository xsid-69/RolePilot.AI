import ChatModel from "../models/chat.model.js";
import MessageModel from "../models/message.model.js";
import PersonaModel from "../models/persona.model.js";

async function createChat(req,res){
    const {title, personaId} = req.body;
    const user = req.user;

    if (!personaId) {
        return res.status(400).json({
            success: false,
            message: "Persona ID is required to start a chat."
        });
    }

    const chat = await ChatModel.create({
        title,
        user:user._id,
        persona: personaId
    })

    // Fetch persona to check for opening message
    const persona = await PersonaModel.findById(personaId);
    if (persona && persona.openingMessage) {
        await MessageModel.create({
            chat: chat._id,
            role: "model",
            content: persona.openingMessage,
            user: user._id
        });
    }

    return res.status(200).json({
        chat:{
            _id:chat._id,
            title:chat.title,
            user:chat.user,
            persona: chat.persona,
            lastActivity:chat.lastActivity
        },
        success:true,
        message:"Chat created successfully",
        
    })
}

async function getAllChats(req, res) {
    try {
        const chats = await ChatModel.find({ user: req.user._id }).sort({ lastActivity: -1 }).populate("persona");
        return res.status(200).json({
            chats,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch chats",
            error: error.message
        });
    }
}

async function getMessages(req, res) {
    try {
        const { chatId } = req.params;
        const messages = await MessageModel.find({ chat: chatId }).sort({ createdAt: 1 });
        return res.status(200).json({
            messages,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch messages",
            error: error.message
        });
    }
}

async function deleteChat(req, res) {
    try {
        const { chatId } = req.params;
        const chat = await ChatModel.findOne({ _id: chatId, user: req.user._id });

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found or access denied"
            });
        }

        await ChatModel.deleteOne({ _id: chatId });
        await MessageModel.deleteMany({ chat: chatId });

        return res.status(200).json({
            success: true,
            message: "Chat and its history deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete chat",
            error: error.message
        });
    }
}

export { createChat, getAllChats, getMessages, deleteChat };