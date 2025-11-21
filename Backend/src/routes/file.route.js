import express from "express";
import File from "../models/files.model.js";
import { authenticateAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/years", async (req, res) => {
  try {
    const years = await File.distinct("year");
    res.json({ years });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/year/:id", async (req, res) => {
  try {
    const yearId = req.params.id;

    const approvedFiles = await File.find({
      year: yearId,
      isChecked: true,
    }).sort({ createdAt: -1 });

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
