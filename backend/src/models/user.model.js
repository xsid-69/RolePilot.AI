import mongoose from "mongoose"


const userSchema = new mongoose.Schema({
    
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        
    },
    fullName:{
        firstName:{
            type:String,
            required:true
        },
        lastName:{
            type:String,
        }
    },
    profilePic: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    },
    jobTitle: {
        type: String,
        default: ""
    },
    company: {
        type: String,
        default: ""
    }
} , {
        timestamps:true
    }
)

const userModel = mongoose.model("User",userSchema)

export default userModel

