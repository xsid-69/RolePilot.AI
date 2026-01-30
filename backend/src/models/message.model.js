import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    content:{
        type:String,
        required:true
    },
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"chat"
    },
    role:{
        type:String,
        enum:["user","model"],
        default:"user"
    }
},{timestamps:true});

const messageModel = mongoose.model("message",messageSchema);

export default messageModel;