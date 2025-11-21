import express from "express";
import {
  signup,
  login,
  logoutUser,
  verifyAuth,
  checkUsers,
  createAdmin,
} from "../controller/user.controller.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/verify", authenticateToken, verifyAuth);
router.post("/logout", authenticateToken, logoutUser);
router.get("/check-users", checkUsers); // Temporary debug endpoint
router.post("/create-admin", createAdmin); // Temporary admin creation endpoint

export default router;
