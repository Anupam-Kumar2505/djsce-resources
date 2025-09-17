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
    fileSize: 10 * 1024 * 1024, // 10MB limit to match Cloudinary free plan
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

// Upload file endpoint - supports multiple files (up to 10)
router.post(
  "/upload",
  (req, res, next) => {
    upload.array("files", 10)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        console.error("Multer error:", err);
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            error:
              "File too large. Maximum size is 10MB per file due to Cloudinary free plan limits.",
          });
        }
        if (err.code === "LIMIT_FILE_COUNT") {
          return res
            .status(400)
            .json({ error: "Too many files. Maximum 10 files allowed." });
        }
        return res
          .status(400)
          .json({ error: "File upload error: " + err.message });
      } else if (err) {
        console.error("Upload error:", err);
        return res.status(500).json({ error: "Upload failed: " + err.message });
      }
      next();
    });
  },
  async (req, res) => {
    console.log("=== UPLOAD REQUEST RECEIVED ===");
    console.log("Files:", req.files?.length || 0);
    console.log("Body:", req.body);
    console.log("Headers:", req.headers);

    try {
      if (!req.files || req.files.length === 0) {
        console.log("No files in request");
        return res.status(400).json({ error: "No files uploaded" });
      }

      if (req.files.length > 10) {
        return res
          .status(400)
          .json({ error: "Maximum 10 files allowed per upload" });
      }

      const { type, subject, year } = req.body;

      if (!type || !subject || !year) {
        return res
          .status(400)
          .json({ error: "Type, subject, and year are required" });
      }

      const uploadResults = [];
      const errors = [];

      // Process each file
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        console.log(
          `Processing file ${i + 1}/${req.files.length}:`,
          file.originalname
        );

        try {
          // Upload to Cloudinary using the uploadOnCloud function
          const originalNameWithoutExt = path.parse(file.originalname).name;
          const fileExtension = path.extname(file.originalname);

          console.log("File details:", {
            originalname: file.originalname,
            path: file.path,
            size: file.size,
            mimetype: file.mimetype,
          });

          const uploadOptions = {
            folder: `djsce_resources/year_${year}`,
            public_id: originalNameWithoutExt, // Use exact original filename without timestamp
            resource_type: "auto", // This handles different file types automatically
          };

          console.log("Uploading to Cloudinary with options:", uploadOptions);
          const uploadResult = await uploadOnCloud(file.path, uploadOptions);
          console.log(
            "Cloudinary upload result:",
            uploadResult ? "Success" : "Failed"
          );

          if (!uploadResult) {
            console.error(`Cloudinary upload failed for ${file.originalname}`);
            errors.push(
              `Failed to upload ${file.originalname} to cloud storage`
            );
            continue;
          }

          console.log("Saving to MongoDB...");
          // Save to MongoDB
          const newFile = new File({
            fileUrl: uploadResult.secure_url,
            name: file.originalname,
            type: type,
            subject: subject,
            year: year,
            isChecked: false, // Requires admin approval
          });

          await newFile.save();
          console.log("MongoDB save successful for:", file.originalname);

          uploadResults.push({
            id: newFile._id,
            fileUrl: newFile.fileUrl,
            name: newFile.name,
            type: newFile.type,
            subject: newFile.subject,
            year: newFile.year,
          });

          // Clean up temp file
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        } catch (fileError) {
          console.error(`Error uploading ${file.originalname}:`, fileError);
          errors.push(
            `Failed to upload ${file.originalname}: ${fileError.message}`
          );

          // Clean up temp file even on error
          if (file.path && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        }
      }

      // Response based on results
      if (uploadResults.length === 0) {
        return res.status(500).json({
          error: "All file uploads failed",
          details: errors,
        });
      }

      const response = {
        message: `${uploadResults.length} file(s) uploaded successfully`,
        files: uploadResults,
        totalUploaded: uploadResults.length,
        totalRequested: req.files.length,
      };

      if (errors.length > 0) {
        response.warnings = errors;
        response.message += ` (${errors.length} failed)`;
      }

      res.json(response);
    } catch (error) {
      console.error("Upload error:", error);
      // Clean up temp files if they exist
      if (req.files) {
        req.files.forEach((file) => {
          if (file.path && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      }
      res.status(500).json({ error: "Upload failed: " + error.message });
    }
  }
);

// Delete file endpoint (admin only)
router.delete("/file/:id", authenticateAdmin, async (req, res) => {
  try {
    const fileId = req.params.id;
    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Extract Cloudinary public_id from URL
    // Cloudinary URL format: https://res.cloudinary.com/[cloud_name]/[resource_type]/upload/[folder]/[public_id].[extension]
    let cloudinaryDeletionSuccessful = false;

    try {
      const urlParts = file.fileUrl.split("/");
      const fileNameWithExtension = urlParts[urlParts.length - 1];
      // Decode URL-encoded characters (like %20 for spaces) back to original characters
      const decodedFileNameWithExtension = decodeURIComponent(
        fileNameWithExtension
      );
      const fileNameWithoutExtension =
        decodedFileNameWithExtension.split(".")[0]; // Remove extension

      // Find the folder path starting from after 'upload'
      const uploadIndex = urlParts.findIndex((part) => part === "upload");
      if (uploadIndex !== -1 && uploadIndex < urlParts.length - 2) {
        // Skip the version part (v[timestamp]) and get folder + filename
        let folderStartIndex = uploadIndex + 1;

        // Check if next part after upload is version (starts with 'v' followed by numbers)
        if (
          urlParts[folderStartIndex] &&
          /^v\d+$/.test(urlParts[folderStartIndex])
        ) {
          folderStartIndex += 1; // Skip version part
        }

        const folderParts = urlParts.slice(folderStartIndex, -1); // Exclude the filename
        const fullPublicId = [...folderParts, fileNameWithoutExtension].join(
          "/"
        ); // Use filename WITHOUT extension

        console.log("=== CLOUDINARY DEBUG ===");
        console.log("Original file URL:", file.fileUrl);
        console.log("URL parts:", urlParts);
        console.log(
          "File name with extension (encoded):",
          fileNameWithExtension
        );
        console.log(
          "File name with extension (decoded):",
          decodedFileNameWithExtension
        );
        console.log("File name without extension:", fileNameWithoutExtension);
        console.log("Constructed public_id:", fullPublicId);
        console.log("=== END DEBUG ===");

        console.log(
          "Attempting to delete from Cloudinary with public_id:",
          fullPublicId
        );

        // Delete from Cloudinary
        const cloudinaryResult = await cloudinary.uploader.destroy(
          fullPublicId
        );

        // Check if deletion was successful
        if (cloudinaryResult.result === "ok") {
          cloudinaryDeletionSuccessful = true;
        } else if (cloudinaryResult.result === "not found") {
          // File not found in Cloudinary, but we can still proceed with DB deletion
          console.warn(
            "File not found in Cloudinary, proceeding with database deletion"
          );
          cloudinaryDeletionSuccessful = true;
        } else {
          throw new Error(
            `Cloudinary deletion failed: ${cloudinaryResult.result}`
          );
        }
      } else {
        throw new Error("Could not parse Cloudinary URL structure");
      }
    } catch (cloudinaryError) {
      console.error("Failed to delete from Cloudinary:", cloudinaryError);
      return res.status(500).json({
        error:
          "Failed to delete file from cloud storage. Database record preserved.",
        details: cloudinaryError.message,
      });
    }

    // Only proceed with database deletion if Cloudinary deletion was successful
    if (!cloudinaryDeletionSuccessful) {
      return res.status(500).json({
        error:
          "Cloudinary deletion was not successful. Database record preserved.",
      });
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

// Approve file endpoint (admin only) - Only handles approvals
router.patch("/file/:id/approve", authenticateAdmin, async (req, res) => {
  try {
    const fileId = req.params.id;

    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    const updatedFile = await File.findByIdAndUpdate(
      fileId,
      { isChecked: true },
      { new: true, runValidators: true }
    );

    res.json({
      message: "File approved successfully",
      file: {
        id: updatedFile._id,
        fileUrl: updatedFile.fileUrl,
        name: updatedFile.name,
        type: updatedFile.type,
        subject: updatedFile.subject,
        year: updatedFile.year,
        isChecked: updatedFile.isChecked,
      },
    });
  } catch (error) {
    console.error("Approval error:", error);
    res.status(500).json({ error: "Failed to approve file: " + error.message });
  }
});

// Test Cloudinary deletion endpoint
router.post("/test-cloudinary-delete", async (req, res) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({ error: "publicId is required" });
    }

    console.log("=== TESTING CLOUDINARY DELETION ===");
    console.log("Original publicId input:", publicId);

    // Test URL decoding (like we do in actual deletion)
    const decodedPublicId = decodeURIComponent(publicId);
    console.log("Decoded publicId:", decodedPublicId);
    console.log("Are they different?", publicId !== decodedPublicId);

    // Test deletion with decoded publicId
    const result = await cloudinary.uploader.destroy(decodedPublicId);
    console.log("Cloudinary deletion result:", result);
    console.log("=== END TEST ===");

    res.json({
      message: "Test completed",
      originalPublicId: publicId,
      decodedPublicId: decodedPublicId,
      urlDecodingApplied: publicId !== decodedPublicId,
      cloudinaryResult: result,
      success: result.result === "ok" || result.result === "not found",
    });
  } catch (error) {
    console.error("Test deletion error:", error);
    res.status(500).json({
      error: "Test failed: " + error.message,
      details: error,
    });
  }
});

export default router;
