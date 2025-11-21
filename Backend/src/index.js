import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import yearRouter from "./routes/file.route.js";
import uploadRouter from "./routes/upload.route.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://djsce-resources.onrender.com",
      "https://djsce-resources.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "15mb" }));

try {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB connected: ${conn.connection.host}`);
} catch (error) {
  console.error(`Error connecting to MongoDB: ${error}`);
}

app.get("/", (req, res) => {
  res.json({ message: "Backend server is running" });
});

app.use("/", yearRouter);
app.use("/api", uploadRouter);
app.use("/auth", authRouter);
app.use("/api/users", userRouter);

app.listen(5000, "0.0.0.0", () => {
  console.log("Server is running on port 5000");
});
