import ChatModel from "../models/chat.model.js";

async function createChat(req,res){
    const {title} = req.body;
    const user = req.user;

    const chat = await ChatModel.create({
        title,
        user:user._id
    })

    return res.status(200).json({
        chat:{
            _id:chat._id,
            title:chat.title,
            user:chat.user,
            lastActivity:chat.lastActivity
        },
        success:true,
        message:"Chat created successfully",
        
    })
}

export {createChat}