import express from "express";
import multer from "multer";
import uploadOnCloud from "../config/cloudinary.js";
import File from "../models/files.model.js";
import fs from "fs";
import path from "path";

const router = express.Router();

// Configure multer for file uploads to disk temporarily
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "./temp";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Update file name endpoint
router.patch("/files/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "File name is required" });
    }

    const updatedFile = await File.findByIdAndUpdate(
      id,
      { name: name.trim() },
      { new: true }
    );

    if (!updatedFile) {
      return res.status(404).json({ error: "File not found" });
    }

    res.json({
      message: "File name updated successfully",
      file: {
        id: updatedFile._id,
        fileUrl: updatedFile.fileUrl,
        name: updatedFile.name,
        type: updatedFile.type,
        subject: updatedFile.subject,
        year: updatedFile.year,
      },
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Update failed: " + error.message });
  }
});

// Upload file endpoint
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { type, subject, year } = req.body;

    if (!type || !subject || !year) {
      return res
        .status(400)
        .json({ error: "Type, subject, and year are required" });
    }

    // Upload to Cloudinary using the uploadOnCloud function
    const uploadOptions = {
      folder: `djsce_resources/year_${year}`,
      public_id: `${type.replace(/\s+/g, "_")}_${Date.now()}`,
    };

    const uploadResult = await uploadOnCloud(req.file.path, uploadOptions);

    if (!uploadResult) {
      return res
        .status(500)
        .json({ error: "Failed to upload file to cloud storage" });
    }

    // Save to MongoDB
    const newFile = new File({
      fileUrl: uploadResult.secure_url,
      name: req.file.originalname,
      type: type,
      subject: subject,
      year: year,
    });

    await newFile.save();

    res.json({
      message: "File uploaded successfully",
      file: {
        id: newFile._id,
        fileUrl: newFile.fileUrl,
        name: newFile.name,
        type: newFile.type,
        subject: newFile.subject,
        year: newFile.year,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    // Clean up temp file if it exists
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: "Upload failed: " + error.message });
  }
});

export default router;
