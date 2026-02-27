import express from "express";
import {registerUser,loginUser,updateProfile,updatePassword} from "../controllers/auth.controller.js";
import authUser from "../middlewares/auth.middleware.js";
import {googleAuthCallback} from "../controllers/auth.controller.js";
import passport from "passport";

const router = express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.put("/profile", authUser, updateProfile);
router.put("/password", authUser, updatePassword);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { session: false }), googleAuthCallback);


export default router;