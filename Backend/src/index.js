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
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

app.use("/", yearRouter);
app.use("/api", uploadRouter);
app.use("/auth", authRouter);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
