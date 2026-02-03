import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

/*Routes*/ 
import authRoutes from "./routes/auth.routes.js"
import chatRoutes from "./routes/chat.routes.js"

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/chat",chatRoutes);

export default app;
