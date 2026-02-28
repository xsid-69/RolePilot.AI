/**
 * Centralized error handling middleware.
 */
const errorMiddleware = (err, req, res, next) => {
    if (process.env.NODE_ENV !== "production") {
        console.error("Unhandled Error:", err);
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        message: process.env.NODE_ENV === "production" && statusCode === 500 ? "Internal Server Error" : message,
        stack: process.env.NODE_ENV === "production" ? undefined : err.stack
    });
};

export default errorMiddleware;
