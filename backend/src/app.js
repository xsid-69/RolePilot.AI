import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

/*Routes*/ 
import authRoutes from "./routes/auth.routes.js"
import chatRoutes from "./routes/chat.routes.js"
import personaRoutes from "./routes/persona.routes.js"
import errorMiddleware from "./middlewares/error.middleware.js";
import passport from "./config/passport.js";

const app = express();
app.use(passport.initialize());

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/chat",chatRoutes);
app.use("/api/personas",personaRoutes);

// Error handling middleware should be registered last
app.use(errorMiddleware);

export default app;
