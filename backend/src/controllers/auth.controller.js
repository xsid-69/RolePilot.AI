import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

async function registerUser(req,res){
    const {fullName:{firstName,lastName} , email , password } = req.body;

    const userAlreadyExist = await userModel.findOne({email});

    if(userAlreadyExist){
       return res.status(400).json({message:"User already exist"});
    }

    const hashPassword = await bcrypt.hash(password,10);

    const user =await userModel.create({
        fullName:{firstName,lastName},
        email,
        password:hashPassword
    })
      
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"4d"});
    
    res.cookie("token" ,token)

    res.status(201).json({
        message: " User created Successfully",
        user:{
            email:user.email,
            fullName:user.fullName,
            _id:user._id
        }
    })
}

async function loginUser(req,res){
   const {email , password } = req.body;

   const user = await userModel.findOne({email})
   if(!user){
      return res.status(400).json({message:"Invalid Credentials"})
   }
   const isPasswordValid = await bcrypt.compare(password,user.password);
   if(!isPasswordValid){
      return res.status(400).json({message:"Invalid Credentials"})
   }

   const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"4d"})

   res.cookie("token",token);

   res.status(200).json({
      message:"Logged-in Successfully",
      user:{
         email:user.email,
         fullName:user.fullName,
         _id:user._id
      }
   })

}  

export {registerUser , loginUser}