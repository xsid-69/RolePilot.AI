import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

async function registerUser(req,res){
    const { firstName, lastName, email, password } = req.body;

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
            _id:user._id,
            profilePic:user.profilePic,
            bio:user.bio,
            jobTitle:user.jobTitle,
            company:user.company
        }
    })
    console.log(user ,"user created");
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
         _id:user._id,
         profilePic:user.profilePic,
         bio:user.bio,
         jobTitle:user.jobTitle,
         company:user.company
      }
   })
   console.log(user ,"user logged in");

}  

async function updateProfile(req, res) {
   try {
      const userId = req.user._id;
      const { firstName, lastName, profilePic, bio, jobTitle, company } = req.body;

      const user = await userModel.findById(userId);
      if (!user) {
         return res.status(404).json({ message: "User not found" });
      }

      if (firstName) user.fullName.firstName = firstName;
      if (lastName !== undefined) user.fullName.lastName = lastName;
      if (profilePic !== undefined) user.profilePic = profilePic;
      if (bio !== undefined) user.bio = bio;
      if (jobTitle !== undefined) user.jobTitle = jobTitle;
      if (company !== undefined) user.company = company;

      await user.save();

      res.status(200).json({
         message: "Profile updated successfully",
         user: {
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            profilePic: user.profilePic,
            bio: user.bio,
            jobTitle: user.jobTitle,
            company: user.company
         }
      });
   } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Internal server error" });
   }
}

async function updatePassword(req, res) {
   try {
      const userId = req.user._id;
      const { currentPassword, newPassword } = req.body;

      const user = await userModel.findById(userId);
      if (!user) {
         return res.status(404).json({ message: "User not found" });
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
         return res.status(400).json({ message: "Incorrect current password" });
      }

      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      res.status(200).json({ message: "Password updated successfully" });
   } catch (error) {
      console.error("Error updating password:", error);
      res.status(500).json({ message: "Internal server error" });
   }
}

async function googleAuthCallback(req, res) {
   try {
      const user = req.user;
      if (!user) {
         return res.redirect("http://localhost:5173/login?error=GoogleAuthFailed");
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "4d" });
      res.cookie("token", token);

      const userData = JSON.stringify({
         email: user.email,
         fullName: user.fullName,
         _id: user._id,
         profilePic: user.profilePic,
         bio: user.bio,
         jobTitle: user.jobTitle,
         company: user.company
      });

      res.redirect(`http://localhost:5173/auth/success?user=${encodeURIComponent(userData)}`);
   } catch (error) {
      console.error("Error in google auth callback:", error);
      res.redirect("http://localhost:5173/login?error=InternalServerError");
   }
}

export { registerUser, loginUser, updateProfile, updatePassword, googleAuthCallback };