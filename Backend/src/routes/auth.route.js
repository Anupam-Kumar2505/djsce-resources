import express from "express";
import User from "../models/user.model.js";
import { generateToken } from "../middleware/auth.js";

const router = express.Router();

// Login endpoint
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        error: "Username and password are required",
      });
    }

    // Find user by username
    const user = await User.findOne({
      username: username.toLowerCase().trim(),
    });
    if (!user) {
      return res.status(401).json({
        error: "Invalid username or password",
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid username or password",
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Return user info and token
    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Create initial admin user (for development/setup only)
router.post("/setup-admin", async (req, res) => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      return res.status(400).json({
        error: "Admin user already exists",
      });
    }

    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        error: "Username and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters long",
      });
    }

    // Create admin user
    const admin = new User({
      username: username.toLowerCase().trim(),
      password,
      role: "admin",
    });

    await admin.save();

    res.status(201).json({
      message: "Admin user created successfully",
      user: {
        id: admin._id,
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin setup error:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        error: "Username already exists",
      });
    }
    res.status(500).json({ error: "Failed to create admin user" });
  }
});

// Logout endpoint (client-side token removal)
router.post("/logout", (req, res) => {
  res.json({ message: "Logout successful" });
});

export default router;
