const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/alert-system";

    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully");
    return mongoose.connection;
  } catch (err) {
    console.log("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;