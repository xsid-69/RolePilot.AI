import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";

/*Routes*/ 
import authRoutes from "./routes/auth.routes.js"
import chatRoutes from "./routes/chat.routes.js"
import personaRoutes from "./routes/persona.routes.js"
import errorMiddleware from "./middlewares/error.middleware.js";
import passport from "./config/passport.js";
import session from "express-session";
import MongoStore from "connect-mongo";

const app = express();

// Secure HTTP headers
app.use(helmet());

// Compress response bodies
app.use(compression());

// Rate Limiting to prevent brute-force
const limiter = rateLimit({
    max: 150,
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: "Too many requests from this IP, please try again in 15 minutes",
});
app.use("/api", limiter);

// Session middleware (store in MongoDB) - required for Passport sessions (OAuth flows)
app.use(session({
    secret: process.env.SESSION_SECRET || 'change_this_secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI || process.env.DATABASE_URL }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
}));

app.use(passport.initialize());
app.use(passport.session());

const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:5173"
].filter(Boolean);

// CORS configuration supporting dynamic frontends
app.use(cors({
    origin: function(origin, callback) {
        // Log origin for debugging in production
        try {
          console.log('[CORS] Incoming request origin:', origin, 'Allowed origins:', allowedOrigins);
        } catch (e) {}

        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn('[CORS] Rejected origin:', origin);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// Health Check Route
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok", message: "Server is healthy" });
});

app.use("/api/auth",authRoutes);
app.use("/api/chat",chatRoutes);
app.use("/api/personas",personaRoutes);

// Error handling middleware should be registered last
app.use(errorMiddleware);

export default app;
