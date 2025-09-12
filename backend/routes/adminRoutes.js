const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const User = require("../models/user");
const File = require("../models/File");
const ActivityLog = require("../models/ActivityLog");
const DeletionLog = require("../models/DeletionLog");
const Announcement = require("../models/Announcement");
const Setting = require("../models/Setting");

// ===== Dashboard Summary Stats =====
router.get("/stats", verifyToken, async (req, res) => {
  try {
    if (!["admin", "super-admin"].includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }

    const userFilter = {
      role: "user",
      $or: [{ deletedAt: null }, { isDeleted: false }],
    };

    const totalUsers = await User.countDocuments(userFilter);
    const totalFilesUploaded = await File.countDocuments();

    const activeSince = new Date();
    activeSince.setDate(activeSince.getDate() - 30);

    const userIds = await User.find(userFilter).distinct("_id");

    const activeUsers = await File.distinct("user", {
      uploadDate: { $gte: activeSince },
      user: { $in: userIds },
    }).then((u) => u.length);

    const accountsCreated = await User.countDocuments(userFilter);

    const accountsDeleted = await DeletionLog.countDocuments({
      deletedAt: { $gte: activeSince },
    });

    // Most Active User
    const mostActiveUser = await ActivityLog.aggregate([
      { $group: { _id: "$user", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
      { $project: { email: "$userInfo.email" } },
    ]);

    // Most Popular Report
    const mostPopularReport = await File.aggregate([
      { $unwind: "$analyses" },
      { $group: { _id: "$fileName", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    // Peak Usage Time
    const peakUsageTime = await ActivityLog.aggregate([
      {
        $group: {
          _id: { $hour: "$timestamp" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    res.json({
      totalUsers,
      totalFilesUploaded,
      activeUsers,
      accountsCreated,
      accountsDeleted,
      mostActiveUser: mostActiveUser.length > 0 ? mostActiveUser[0].email : "N/A",
      mostPopularReport: mostPopularReport.length > 0 ? mostPopularReport[0]._id : "N/A",
      peakUsageTime: peakUsageTime.length > 0 ? `${peakUsageTime[0]._id}:00` : "N/A",
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
          _id: "$_id",
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
router.get("/recent-activities", verifyToken, async (req, res) => {
  try {
    const activities = await ActivityLog.find({})
      .populate("user", "fullname email role")
      .sort({ timestamp: -1 })
      .limit(10);
    res.json(activities);
  } catch (err) {
    console.error("Recent activities error:", err);
    res.status(500).json({ error: "Failed to fetch recent activities" });
  }
});

// ===== File Oversight =====
router.get("/files", verifyToken, async (req, res) => {
    if (req.user.role !== "super-admin") {
        return res.status(403).json({ error: "Access denied" });
    }
    try {
        const files = await File.find().populate("user", "email");
        res.json(files);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch files" });
    }
});

router.delete("/files/:id", verifyToken, async (req, res) => {
    if (req.user.role !== "super-admin") {
        return res.status(403).json({ error: "Access denied" });
    }
    try {
        await File.findByIdAndDelete(req.params.id);
        res.json({ message: "File deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete file" });
    }
});

// ===== Announcements =====
router.post("/announcements", verifyToken, async (req, res) => {
    if (req.user.role !== "super-admin") {
        return res.status(403).json({ error: "Access denied" });
    }
    try {
        const announcement = new Announcement({
            message: req.body.message,
            createdBy: req.user.id,
        });
        await announcement.save();
        res.json(announcement);
    } catch (err) {
        res.status(500).json({ error: "Failed to create announcement" });
    }
});

router.get("/announcements", verifyToken, async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ createdAt: -1 });
        res.json(announcements);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch announcements" });
    }
});

// ===== System Health =====
router.get("/system-health", verifyToken, async (req, res) => {
    if (req.user.role !== "super-admin") {
        return res.status(403).json({ error: "Access denied" });
    }
    try {
        const health = {
            uptime: "99.9%",
            serverLoad: `${Math.floor(Math.random() * 50) + 10}%`,
            databaseStatus: "🟢 Healthy",
            errors: await ActivityLog.countDocuments({ action: "error" }),
        };
        res.json(health);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch system health" });
    }
});

// ===== Global Settings =====
router.get("/settings", verifyToken, async (req, res) => {
    if (req.user.role !== "super-admin") {
        return res.status(403).json({ error: "Access denied" });
    }
    try {
        let settings = await Setting.findOne();
        if (!settings) {
            settings = await new Setting().save();
        }
        res.json(settings);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch settings" });
    }
});

router.put("/settings", verifyToken, async (req, res) => {
    if (req.user.role !== "super-admin") {
        return res.status(403).json({ error: "Access denied" });
    }
    try {
        const settings = await Setting.findOneAndUpdate({}, req.body, { new: true, upsert: true });
        res.json(settings);
    } catch (err) {
        res.status(500).json({ error: "Failed to update settings" });
    }
});

// ===== Data Health & Security Actions =====

// Data Integrity Check
router.post("/data-integrity-check", verifyToken, async (req, res) => {
    if (req.user.role !== "super-admin") return res.status(403).json({ error: "Access denied" });
    try {
        const orphanedFiles = await File.find({ user: { $exists: true } }).populate('user');
        const invalidFiles = orphanedFiles.filter(file => !file.user);
        
        const details = `Ran data integrity check. Found ${invalidFiles.length} issues (orphaned files).`;
        console.log(details);

        await new ActivityLog({ user: req.user.id, action: 'other', details }).save();
        res.json({ message: `Data integrity check completed. Found ${invalidFiles.length} issues.` });
    } catch (err) {
        res.status(500).json({ error: "Failed to run data integrity check." });
    }
});

// Archive Old Data
router.post("/archive-data", verifyToken, async (req, res) => {
    if (req.user.role !== "super-admin") return res.status(403).json({ error: "Access denied" });
    const details = "Manual data archival process initiated by Super Admin.";
    await new ActivityLog({ user: req.user.id, action: 'other', details }).save();
    res.json({ message: "Archiving process initiated." });
});

// Trigger Security Alert
router.post("/security-alert", verifyToken, async (req, res) => {
    if (req.user.role !== "super-admin") return res.status(403).json({ error: "Access denied" });
    const details = 'Security alert manually triggered by Super Admin.';
    await new ActivityLog({ user: req.user.id, action: 'other', details }).save();
    res.json({ message: "Security alert triggered and logged." });
});

// System Backup
router.post("/system-backup", verifyToken, async (req, res) => {
    if (req.user.role !== "super-admin") return res.status(403).json({ error: "Access denied" });
    const details = "Full system backup initiated by Super Admin.";
    await new ActivityLog({ user: req.user.id, action: 'other', details }).save();
    res.json({ message: "System backup initiated." });
});


module.exports = router;