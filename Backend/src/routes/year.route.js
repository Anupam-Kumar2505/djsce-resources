import express from "express";
import File from "../models/files.model.js";

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
    const files = await File.find({ year: yearId }).sort({ createdAt: -1 });
    res.json({ year: yearId, files });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
