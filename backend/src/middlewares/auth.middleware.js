import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

async function authUser(req,res,next){
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            success:false,
            message:"Unauthorized"
        })
    }
    try{
        const decoded = jwt.verify(token , process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id);
        req.user = user;
        next();

        
    }catch{
        res.status(401).json({success:false,message:"Unauthorized"})
    }
}

export default authUser;