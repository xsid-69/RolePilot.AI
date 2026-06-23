import { Server } from "socket.io";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import aiService from "../services/ai.service.js";
import messageModel from "../models/message.model.js";
import ChatModel from "../models/chat.model.js";
import { createMemory, queryMemory } from "../services/vector.service.js";
import promptBuilderService from "../services/promptBuilder.service.js";

function initSocketServer(httpServer) {
    const allowedOrigins = [
        process.env.FRONTEND_URL,
        "http://localhost:5173"
    ].filter(Boolean);

    const io = new Server(httpServer, {
        cors: {
            origin: allowedOrigins,
            allowedHeaders: ["Content-Type", "Authorization"],
            credentials: true
        }
    });

    io.use(async (socket, next) => {
        const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
        
        // Accept token from socket handshake (localStorage) or fallback to cookies
        const token = socket.handshake.auth?.token || cookies.token;

        if (!token) {
            return next(new Error("Authentication error: No token provided"));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await userModel.findById(decoded.id);

            if (!user) {
                return next(new Error("Authentication error: User not found"));
            }

            socket.user = user;
            next();
        } catch (err) {
            return next(new Error(`Authentication error: ${err.message}`));
        }
    });

    io.on("connection", (socket) => {
        socket.on("ai-message", async (messagePayload) => {
            try {
                if (!messagePayload?.chat || !messagePayload?.content) {
                    socket.emit("ai-error", { error: "Invalid message payload." });
                    return;
                }

                /* Save the user message and bump chat activity. */
                const storedMessage = await messageModel.create({
                    chat: messagePayload.chat,
                    user: socket.user._id,
                    content: messagePayload.content,
                    role: "user"
                });
                ChatModel.findByIdAndUpdate(messagePayload.chat, { lastActivity: new Date() }).catch((e) =>
                    console.error("Failed to update chat activity:", e)
                );

                /* Long-term memory (vector db) is best-effort. A failure here must not
                   prevent the user from getting an AI response. */
                let memory = [];
                try {
                    const vectors = await aiService.generateVector(messagePayload.content);

                    memory = await queryMemory({
                        queryVector: vectors,
                        limit: 5,
                        metadata: {
                            user: socket.user._id.toString()
                        }
                    });

                    await createMemory({
                        vector: vectors,
                        id: storedMessage._id.toString(),
                        metadata: {
                            chat: messagePayload.chat.toString(),
                            user: socket.user._id.toString(),
                            text: messagePayload.content
                        }
                    });
                } catch (memoryError) {
                    console.error("Memory step failed (non-fatal):", memoryError);
                }

                /*get last 20 messages as chatHistory from db*/
                const chatHistory = await messageModel.find({
                        chat: messagePayload.chat
                    }).sort({ createdAt: -1 }).limit(20).lean().then(messages => messages.reverse());

                const stm = chatHistory.map(item => {
                    return {
                        role: item.role,
                        parts: [{ text: item.content }]
                    };
                });

                const ltmContent = memory.map(item => item.metadata.text).join("\n");
                
                // Ab prompt bana rahe hain jisme purani baatein (context) bhi hongi
                const isNewChat = chatHistory.length <= 1;
                const ltmInstruction = isNewChat 
                    ? "These are past memories. As this is a NEW chat session, DO NOT bring them up unless the user specifically references past context or asks about them. Otherwise, ignore them."
                    : "These are previous messages from the user's history, use them for context.";

                 const ltm = [
                    {
                        role: "user",
                        parts: [ {
                            text: `
                            ${ltmInstruction}
    
                            ${ltmContent}
                            
                            ` } ]
                    }
                ]
                /*get chat and persona to build system prompt*/
                const chat = await ChatModel.findById(messagePayload.chat).populate("persona");
                const systemPrompt = promptBuilderService.buildSystemPrompt(chat?.persona, socket.user);

                /*generate response from ai*/
                const response = await aiService.generateAIResponse([...ltm, ...stm], systemPrompt);

                socket.emit('ai-response', {
                    content: response,
                    chat: messagePayload.chat
                });

                /* Persist the AI response. This is important, so failures here are logged
                   but must not surface an error to the user since they already got the reply. */
                try {
                    const responseMessage = await messageModel.create({
                        chat: messagePayload.chat,
                        user: socket.user._id,
                        content: response,
                        role: "model"
                    });

                    await ChatModel.findByIdAndUpdate(messagePayload.chat, { lastActivity: new Date() });

                    /* Store response in vector db (pinecone). Best-effort: don't fail the turn. */
                    const responseVectors = await aiService.generateVector(response);
                    await createMemory({
                        vector: responseVectors,
                        id: responseMessage._id.toString(),
                        metadata: {
                            chat: messagePayload.chat.toString(),
                            user: socket.user._id.toString(),
                            text: response
                        }
                    });
                } catch (persistError) {
                    console.error("Post-response persistence error (non-fatal):", persistError);
                }
            } catch (error) {
                console.error("AI Message Error:", error);

                const status = error?.status ?? error?.code ?? error?.response?.status;
                let friendlyMessage = "Something went wrong while generating a response. Please try again.";

                if (Number(status) === 503 || Number(status) === 429) {
                    friendlyMessage = "The AI is experiencing high demand right now. Please wait a moment and try again.";
                }

                socket.emit("ai-error", {
                    error: friendlyMessage,
                    chat: messagePayload?.chat
                });
            }
        });
    });
}

export default initSocketServer;