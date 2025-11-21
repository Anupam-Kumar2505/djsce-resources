import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../middleware/auth.js";

export const signup = async (req, res) => {
  try {
    const { username, password } = req.body;

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

    const existingUser = await User.findOne({
      username: username.toLowerCase().trim(),
    });
    if (existingUser) {
      return res.status(409).json({
        error: "Username already exists",
      });
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username: username.toLowerCase().trim(),
      password: hashedPassword,
      role: "user",
    });

    await user.save();

    const token = generateToken(user._id, res);

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "Username and password are required",
      });
    }

    const user = await User.findOne({
      username: username.toLowerCase().trim(),
    });
    if (!user) {
      return res.status(401).json({
        error: "Invalid username or password",
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: "Invalid username or password",
      });
    }

    const token = generateToken(user._id, res);

    res.status(200).json({
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
    res.status(500).json({ error: "Failed to login" });
  }
};

export const verifyAuth = async (req, res) => {
  try {
    res.status(200).json({
      message: "Authentication verified",
      user: {
        id: req.user._id,
        username: req.user.username,
        role: req.user.role,
      },
    });
  } catch (error) {
    console.error("Auth verification error:", error);
    res.status(500).json({ error: "Failed to verify authentication" });
  }
};

export const checkUsers = async (req, res) => {
  try {
    const users = await User.find({}, "username role createdAt").lean();
    res.status(200).json({
      message: "Users found",
      users: users,
      count: users.length,
    });
  } catch (error) {
    console.error("Check users error:", error);
    res.status(500).json({ error: "Failed to check users" });
  }
};

export const createAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "Username and password are required",
      });
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      return res.status(409).json({
        error: "Admin user already exists",
        existingAdmin: {
          username: existingAdmin.username,
          createdAt: existingAdmin.createdAt,
        },
      });
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const admin = new User({
      username: username.toLowerCase().trim(),
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();

    const token = generateToken(admin._id, res);

    res.status(201).json({
      message: "Admin created successfully",
      user: {
        id: admin._id,
        username: admin.username,
        role: admin.role,
      },
      token,
    });
  } catch (error) {
    console.error("Create admin error:", error);
    res.status(500).json({ error: "Failed to create admin" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
    });

    res.json({ message: "Logout successful" });
  } catch (error) {
    console.log("Error in logout:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
