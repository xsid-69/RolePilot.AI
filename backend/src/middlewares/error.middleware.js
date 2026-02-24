/**
 * Centralized error handling middleware.
 */
const errorMiddleware = (err, req, res, next) => {
    console.error("Unhandled Error:", err);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        message,
        // Include stack trace only in development
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
};

export default errorMiddleware;
