require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/db");

// Routes
const authRoutes = require("./src/modules/auth/auth.routes");
const notificationRoutes = require("./src/modules/notifications/notification.routes");

// Cron Jobs
require("./src/cron/expiry.cron");

// Utils
const { successResponse, errorResponse } = require("./src/utils/response");

const app = express();

// Middleware
app.use(express.json());

app.use((req, res, next) => {
    res.success = (message, data = {}, statusCode = 200) => {
        return res.status(statusCode).json(successResponse(message, data));
    };
    res.error = (message, statusCode = 500) => {
        return res.status(statusCode).json(errorResponse(message));
    };
    next();
});

// Routes
app.use("/auth", authRoutes);
app.use("/notifications", notificationRoutes);

// Default route
app.get("/", (req, res) => {
    return res.success("API is running");
});

// 404 Handler
app.use((req, res) => {
    return res.error("Route not found", 404);
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json(errorResponse(err.message || "Internal Server Error"));
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();