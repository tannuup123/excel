const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const User = require("../models/user");
const File = require("../models/File");
const ActivityLog = require("../models/activityLog");
const DeletionLog = require("../models/DeletionLog");

// ===== Dashboard Summary Stats =====
router.get("/stats", verifyToken, async (req, res) => {
  try {
    if (!["admin", "super-admin"].includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Standardized active user check (not deleted)
    const userFilter = {
      role: "user",
      $or: [{ deletedAt: null }, { isDeleted: false }],
    };

    const totalUsers = await User.countDocuments(userFilter);
    const totalFilesUploaded = await File.countDocuments();

    const activeSince = new Date();
    activeSince.setDate(activeSince.getDate() - 30);

    // Get all valid user IDs
    const userIds = await User.find(userFilter).distinct("_id");

    // Count distinct active users in last 30 days
    const activeUsers = await File.distinct("user", {
      uploadDate: { $gte: activeSince },
      user: { $in: userIds },
    }).then((u) => u.length);

    const accountsCreated = await User.countDocuments(userFilter);

    const accountsDeleted = await DeletionLog.countDocuments({
      deletedAt: { $gte: activeSince },
    });

    res.json({
      totalUsers,
      totalFilesUploaded,
      activeUsers,
      accountsCreated,
      accountsDeleted,
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// ===== User Growth Over Time =====
router.get("/user-growth", verifyToken, async (req, res) => {
  try {
    const growth = await User.aggregate([
      { $match: { role: "user" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json(growth);
  } catch (err) {
    console.error("User growth error:", err);
    res.status(500).json({ error: "Failed to fetch user growth" });
  }
});

// ===== Role Distribution =====
router.get("/role-distribution", verifyToken, async (req, res) => {
  try {
    const distribution = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);
    res.json(distribution);
  } catch (err) {
    console.error("Role distribution error:", err);
    res.status(500).json({ error: "Failed to fetch role distribution" });
  }
});

// ===== File Upload Trends =====
router.get("/file-trends", verifyToken, async (req, res) => {
  try {
    const trends = await File.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$uploadDate" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json(trends);
  } catch (err) {
    console.error("File trends error:", err);
    res.status(500).json({ error: "Failed to fetch file trends" });
  }
});

// ===== Top Uploaders =====
router.get("/top-uploaders", verifyToken, async (req, res) => {
  try {
    const top = await File.aggregate([
      { $group: { _id: "$user", uploads: { $sum: 1 } } },
      { $sort: { uploads: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          _id: "$_id", // <-- include user ID for frontend unique keys
          name: "$userInfo.fullname",
          uploads: 1,
        },
      },
    ]);
    res.json(top);
  } catch (err) {
    console.error("Top uploaders error:", err);
    res.status(500).json({ error: "Failed to fetch top uploaders" });
  }
});

// ===== Recent Activities =====
// router.get("/recent-activities", verifyToken, async (req, res) => {
//   try {
//     const activities = await ActivityLog.find({})
//       .populate("user", "fullname email role")
//       .sort({ timestamp: -1 })
//       .limit(10);
//     res.json(activities);
//   } catch (err) {
//     console.error("Recent activities error:", err);
//     res.status(500).json({ error: "Failed to fetch recent activities" });
//   }
// });

module.exports = router;
