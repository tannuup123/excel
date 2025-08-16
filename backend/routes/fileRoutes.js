// backend/routes/admin.js
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const File = require("../models/File");
const verifyToken = require("../middleware/verifyToken");
const { uploadFile, getFiles, saveAnalysis } = require('../controllers/fileController');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET /api/files — Get history for logged-in user
router.get("/", verifyToken, getFiles);

// POST /api/files/upload — Upload new Excel file
router.post("/upload", verifyToken, upload.single('excelFile'), uploadFile);

// POST /api/files/:fileId/analyze — Save a chart analysis for a file
router.post("/:fileId/analyze", verifyToken, saveAnalysis);

// GET /api/files/:fileId — Get details of a specific file
router.get("/:fileId", verifyToken, async (req, res) => {
  try {
    const file = await File.findOne({ fileId: req.params.fileId, user: req.user.id });
    if (!file) {
      return res.status(404).json({ error: "File not found." });
    }
    res.status(200).json({
      fileId: file.fileId,
      fileName: file.fileName,
      uploadDate: file.uploadDate,
      data: file.processedData,
      analyses: file.analyses,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to load file." });
  }
});


// GET admin stats
router.get("/stats", verifyToken, async (req, res) => {
  try {
    // Allow only admin or super-admin
    if (!["admin", "super-admin"].includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }

    let userFilter = {};
    let fileMatch = {};

    // If normal admin → restrict to user accounts only
    if (req.user.role === "admin") {
      userFilter = { role: "user" };
      fileMatch = { "userData.role": "user" };
    }

    // 1️⃣ Users list based on role
    const userAccounts = await User.find(userFilter);

    // 2️⃣ All files (join with users to filter when needed)
    const files = await File.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userData",
        },
      },
      { $unwind: "$userData" },
      ...(req.user.role === "admin" ? [{ $match: fileMatch }] : []),
    ]);

    const totalFilesUploaded = files.length;

    // 3️⃣ Active users — last 7 days
    const activeUsers = await User.countDocuments({
      ...userFilter,
      lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });

    // 4️⃣ Accounts created (total matching filter)
    const accountsCreated = userAccounts.length;

    // 5️⃣ Accounts deleted (needs soft delete flag)
    const accountsDeleted = await User.countDocuments({
      ...userFilter,
      isDeleted: true, // Change based on your soft delete logic
    });

    // 6️⃣ Per-user file counts (grouped)
    const filesPerUser = await File.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userData",
        },
      },
      { $unwind: "$userData" },
      ...(req.user.role === "admin" ? [{ $match: fileMatch }] : []),
      {
        $group: {
          _id: "$user",
          fileCount: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      totalUsers: userAccounts.length,
      totalFilesUploaded,
      activeUsers,
      accountsCreated,
      accountsDeleted,
      filesPerUser, // array with { _id: userId, fileCount }
    });
  } catch (err) {
    console.error("Error fetching admin stats:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
