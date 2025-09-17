import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import yearRouter from "./routes/year.route.js";
import uploadRouter from "./routes/upload.route.js";
import authRouter from "./routes/auth.route.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '15mb' })); // Reasonable limit for API requests
app.use(express.urlencoded({ extended: true, limit: '15mb' })); // For form data

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Add a simple test route
app.get("/", (req, res) => {
  res.json({ message: "Backend server is running" });
});

app.use("/", yearRouter);
app.use("/api", uploadRouter);
app.use("/auth", authRouter);

app.listen(5000, "0.0.0.0", () => {
  console.log("Server is running on port 5000");
});
