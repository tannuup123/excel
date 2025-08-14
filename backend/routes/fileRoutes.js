// backend/routes/admin.js
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const File = require("../models/File");
const verifyToken = require("../middleware/verifyToken");

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
