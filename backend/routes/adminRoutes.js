const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const User = require('../models/user');
const File = require('../models/File');
const ActivityLog = require('../models/activityLog');
const Session = require('../models/session');
const DeletionLog = require("../models/DeletionLog"); 

// ===== Dashboard Summary Stats =====
router.get('/stats', verifyToken, async (req, res) => {
  try {
    if (!['admin', 'super-admin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const totalUsers = await User.countDocuments({ role: 'user', deletedAt: null, isDeleted: { $ne: true } });
    const totalFilesUploaded = await File.countDocuments();

    const activeSince = new Date();
    activeSince.setDate(activeSince.getDate() - 30);
    // Get all user IDs of role 'user' and not deleted
const userIds = await User.find({ role: 'user', deletedAt: null }).distinct('_id');

// Count distinct users from files uploaded in last 30 days and filter by role
const activeUsers = await File.distinct('user', {
  uploadDate: { $gte: activeSince },
  user: { $in: userIds }
}).then(u => u.length);


    const accountsCreated = await User.countDocuments({ role: 'user', isDeleted: { $ne: true } });
    const accountsDeleted = await DeletionLog.countDocuments({
    deletedAt: { $gte: activeSince }
  });

    res.json({ totalUsers, totalFilesUploaded, activeUsers, accountsCreated, accountsDeleted });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// ===== User Growth Over Time =====
router.get('/user-growth', verifyToken, async (req, res) => {
  const growth = await User.aggregate([
    { $match: { role: 'user' } },
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);
  res.json(growth);
});

// ===== Role Distribution =====
router.get('/role-distribution', verifyToken, async (req, res) => {
  const distribution = await User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]);
  res.json(distribution);
});

// ===== File Upload Trends =====
router.get('/file-trends', verifyToken, async (req, res) => {
  const trends = await File.aggregate([
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$uploadDate" } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);
  res.json(trends);
});

// ===== Top Uploaders =====
router.get('/top-uploaders', verifyToken, async (req, res) => {
  const top = await File.aggregate([
    { $group: { _id: "$user", uploads: { $sum: 1 } } },
    { $sort: { uploads: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "userInfo"
      }
    },
    { $unwind: "$userInfo" },
    { $project: { name: "$userInfo.fullname", uploads: 1 } }
  ]);
  res.json(top);
});

// ===== Recent Activities =====
router.get('/recent-activities', verifyToken, async (req, res) => {
  const activities = await ActivityLog.find({}).populate('user', 'fullname email role')
    .sort({ timestamp: -1 }).limit(10);
  res.json(activities);
});

module.exports = router;
