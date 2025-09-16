import express from "express";
import multer from "multer";
import uploadOnCloud from "../config/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";
import File from "../models/files.model.js";
import { authenticateAdmin } from "../middleware/auth.js";
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

// Delete file endpoint (admin only)
router.delete("/file/:id", authenticateAdmin, async (req, res) => {
  try {
    const fileId = req.params.id;
    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Extract Cloudinary public_id from URL
    const urlParts = file.fileUrl.split("/");
    const fileNameWithExtension = urlParts[urlParts.length - 1];
    const publicId = fileNameWithExtension.split(".")[0]; // Remove extension

    // Find the folder path in the URL
    const folderIndex = urlParts.findIndex((part) =>
      part.includes("djsce_resources")
    );
    const folderPath =
      folderIndex !== -1 ? urlParts.slice(folderIndex, -1).join("/") : "";
    const fullPublicId = folderPath ? `${folderPath}/${publicId}` : publicId;

    try {
      // Delete from Cloudinary
      const cloudinaryResult = await cloudinary.uploader.destroy(fullPublicId);
      console.log("Cloudinary deletion result:", cloudinaryResult);
    } catch (cloudinaryError) {
      console.error("Failed to delete from Cloudinary:", cloudinaryError);
      // Continue with database deletion even if Cloudinary deletion fails
    }

    // Delete from database
    await File.findByIdAndDelete(fileId);

    res.json({
      message: "File deleted successfully from both database and cloud storage",
      deletedFile: {
        id: file._id,
        name: file.name,
        subject: file.subject,
        year: file.year,
      },
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete file: " + error.message });
  }
});

// Update file name endpoint (admin only)
router.put("/file/:id", authenticateAdmin, async (req, res) => {
  try {
    const fileId = req.params.id;
    const { name, subject, type } = req.body;

    if (!name && !subject && !type) {
      return res.status(400).json({
        error:
          "At least one field (name, subject, or type) is required to update",
      });
    }

    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Update only provided fields
    const updateFields = {};
    if (name) updateFields.name = name.trim();
    if (subject) updateFields.subject = subject.trim();
    if (type) updateFields.type = type.trim();

    const updatedFile = await File.findByIdAndUpdate(fileId, updateFields, {
      new: true,
      runValidators: true,
    });

    res.json({
      message: "File updated successfully",
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
    res.status(500).json({ error: "Failed to update file: " + error.message });
  }
});

export default router;
