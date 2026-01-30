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
            required:true
        }
    }
} , {
        timestamps:true
    }
)

const userModel = mongoose.model("User",userSchema)

export default userModel

