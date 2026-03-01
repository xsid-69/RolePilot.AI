import express from "express";
import {registerUser,loginUser,updateProfile,updatePassword,googleAuthCallback} from "../controllers/auth.controller.js";
import authUser from "../middlewares/auth.middleware.js";
import passport from "passport";

const router = express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/user", authUser, (req, res) => {
	if (req.user) {
		res.status(200).json({ success: true, user: {
			_id: req.user._id,
			email: req.user.email,
			fullName: req.user.fullName,
			profilePic: req.user.profilePic
		}});
	} else {
		res.status(200).json({ success: false, user: null });
	}
});
router.put("/profile", authUser, updateProfile);
router.put("/password", authUser, updatePassword);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { session: false }), googleAuthCallback);


export default router;