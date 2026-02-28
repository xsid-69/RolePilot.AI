import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import userModel from "../models/user.model.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "dummy_id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "dummy_secret",
      callbackURL: `${process.env.BACKEND_URL || "http://localhost:3000"}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
        if (!email) {
            return done(new Error("No email found in Google profile"), null);
        }

        let user = await userModel.findOne({ email });

        if (!user) {
          user = await userModel.create({
            email,
            fullName: {
              firstName: profile.name.givenName,
              lastName: profile.name.familyName || "",
            },
            profilePic: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : "",
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport;
