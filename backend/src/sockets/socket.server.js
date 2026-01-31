import { Server } from "socket.io";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import aiService from "../services/ai.service.js";
import messageModel from "../models/message.model.js";
import { createMemory, queryMemory } from "../services/vector.service.js";

function initSocketServer(httpServer){
    const io = new Server(httpServer,{})
    
    io.use(async (socket, next) => {
        const cookies = cookie.parse(socket.request.headers?.cookie || "");
        console.log("Socket Connection cookies :", cookies);

        if (!cookies.token) {
            return next(new Error("Authentication error: No token provided"));
        }

        try {
            const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
            const user = await userModel.findById(decoded._id || decoded.id); // Handle potentially different id fields

            if (!user) {
                return next(new Error("Authentication error: User not found"));
            }

            socket.user = user;
            next();
        } catch (error) {
            console.error("Socket authentication error:", error.message);
            return next(new Error("Authentication error: Invalid or expired token"));
        }
    })

    io.on("connection", (socket) => {
        // console.log("A user connected", socket.user);
        // // console.table(socket.user);
        socket.on("ai-message" , async (messagePayload) =>{
            console.log("AI Message Payload :", messagePayload);

            try {
                await messageModel.create({
                    chat:messagePayload.chat,
                    user:messagePayload.user,
                    content:messagePayload.content,
                    role:"user"
                })
                
                const chatHistory = (await messageModel.find({
                    chat:messagePayload.chat
                }).sort({createdAt:-1}).limit(20).lean()).reverse()
                
                const response = await aiService.generateAIResponse(chatHistory.map(item=>{
                    return {
                        role:item.role,
                        parts:[{text:item.content}]
                    }
                }));

                await messageModel.create({
                    chat:messagePayload.chat,
                    user:messagePayload.user,
                    content:response,
                    role:"model"
                })

                socket.emit("ai-response",{
                    content:response,
                    chat:messagePayload.chat
                });
            } catch (error) {
                console.error("AI Message Error:", error);
                socket.emit("ai-error", { error: error?.message || "Something went wrong" });
            }
        })
    })
}

export default initSocketServer;