import express from "express";
import File from "../models/files.model.js";
import { authenticateAdmin } from "../middleware/auth.js";

const router = express.Router();

// Get all years
router.get("/years", async (req, res) => {
  try {
    const years = await File.distinct("year");
    res.json({ years });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get files by year
router.get("/year/:id", async (req, res) => {
  try {
    const yearId = req.params.id;

    // Get approved files (visible to all users)
    const approvedFiles = await File.find({
      year: yearId,
      isChecked: true,
    }).sort({ createdAt: -1 });

    // Get pending files (only for admins)
    const pendingFiles = await File.find({
      year: yearId,
      isChecked: false,
    }).sort({ createdAt: -1 });

    res.json({
      year: yearId,
      files: approvedFiles,
      pendingFiles: pendingFiles,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all pending files (admin only)
router.get("/pending", authenticateAdmin, async (req, res) => {
  try {
    const pendingFiles = await File.find({ isChecked: false }).sort({
      createdAt: -1,
    });
    res.json({ pendingFiles, count: pendingFiles.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
