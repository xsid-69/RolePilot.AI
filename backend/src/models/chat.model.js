import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    title:{
        type:String,
        required:true
    },
    lastActivity:{
        type:Date,
        default:Date.now
    }
},{
    timestamps:true
}
)

const ChatModel = mongoose.model("chat",chatSchema);

export default ChatModel;