// const express = require('express');
// const router = express.Router();
// const User = require('../models/user');
// const verifyToken = require('../middleware/verifyToken');

// // Get all users (admin or super-admin only)
// router.get('/', verifyToken, async (req, res) => {
//   if (!['admin', 'super-admin'].includes(req.user.role)) {
//     return res.status(403).json({ error: 'Access denied' });
//   }

//   try {
//     const users = await User.find({}, 'fullname email role isApproved');
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch users.' });
//   }
// });

// // Approve user or admin
// router.put('/:id/approve', verifyToken, async (req, res) => {
//   try {
//     const approver = req.user;
//     const targetUser = await User.findById(req.params.id);

//     if (!targetUser) {
//       return res.status(404).json({ error: 'User not found.' });
//     }

//     if (approver.id === targetUser.id) {
//       return res.status(403).json({ error: 'You cannot approve yourself.' });
//     }

//     if (targetUser.isApproved) {
//       return res.status(400).json({ error: 'User is already approved.' });
//     }

//     // Super-admin approves admins
//     if (targetUser.role === 'admin') {
//       if (approver.role !== 'super-admin') {
//         return res.status(403).json({ error: 'Only super-admins can approve admins.' });
//       }
//     }

//     // Admin approves users
//     if (targetUser.role === 'user') {
//       if (!['admin', 'super-admin'].includes(approver.role)) {
//         return res.status(403).json({ error: 'Only admins or super-admins can approve users.' });
//       }
//     }

//     targetUser.isApproved = true;
//     await targetUser.save();
//     res.status(200).json({ message: `${targetUser.role} approved successfully.` });
//   } catch (error) {
//     res.status(500).json({ error: 'Approval failed.' });
//   }
// });

// // Update user role (super-admin only)
// router.put('/:id/role', verifyToken, async (req, res) => {
//   if (req.user.role !== 'super-admin') {
//     return res.status(403).json({ error: 'Only super-admin can update user roles.' });
//   }

//   try {
//     const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
//     res.status(200).json({ message: `User role updated to ${user.role}` });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to update role.' });
//   }
// });

// // Delete user (super-admin only)
// router.delete('/:id', verifyToken, async (req, res) => {
//   if (req.user.role !== 'super-admin') {
//     return res.status(403).json({ error: 'Only super-admin can delete users.' });
//   }

//   try {
//     await User.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: 'User deleted successfully.' });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to delete user.' });
//   }
// });

// // // userRoutes.js snippet
// // router.get('/profile', verifyToken, async (req, res) => {
// //   try {
// //     const user = await User.findById(req.user.id, 'fullname email role');
// //     if (!user) {
// //       return res.status(404).json({ error: 'User not found.' });
// //     }
// //     res.status(200).json(user);
// //   } catch (error) {
// //     res.status(500).json({ error: 'Failed to fetch user profile.' });
// //   }
// // });

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const User = require("../models/user");
// const verifyToken = require("../middleware/verifyToken");

// // Get all users (admin or super-admin only)
// router.get("/", verifyToken, async (req, res) => {
//   if (!["admin", "super-admin"].includes(req.user.role)) {
//     return res.status(403).json({ error: "Access denied" });
//   }

//   try {
//     const users = await User.find({}, "fullname email role isApproved");
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch users." });
//   }
// });

// // Approve user or admin
// router.put("/:id/approve", verifyToken, async (req, res) => {
//   try {
//     const approver = req.user;
//     const targetUser = await User.findById(req.params.id);

//     if (!targetUser) {
//       return res.status(404).json({ error: "User not found." });
//     }

//     if (approver.id === targetUser.id) {
//       return res.status(403).json({ error: "You cannot approve yourself." });
//     }

//     if (targetUser.isApproved) {
//       return res.status(400).json({ error: "User is already approved." });
//     }

//     // Super-admin approves admins
//     if (targetUser.role === "admin") {
//       if (approver.role !== "super-admin") {
//         return res
//           .status(403)
//           .json({ error: "Only super-admins can approve admins." });
//       }
//     }

//     // Admin approves users
//     if (targetUser.role === "user") {
//       if (!["admin", "super-admin"].includes(approver.role)) {
//         return res
//           .status(403)
//           .json({ error: "Only admins or super-admins can approve users." });
//       }
//     }

//     targetUser.isApproved = true;
//     await targetUser.save();
//     res
//       .status(200)
//       .json({ message: `${targetUser.role} approved successfully.` });
//   } catch (error) {
//     res.status(500).json({ error: "Approval failed." });
//   }
// });

// // Update user role (super-admin only)
// router.put("/:id/role", verifyToken, async (req, res) => {
//   if (req.user.role !== "super-admin") {
//     return res
//       .status(403)
//       .json({ error: "Only super-admin can update user roles." });
//   }

//   try {
//     const user = await User.findByIdAndUpdate(
//       req.params.id,
//       { role: req.body.role },
//       { new: true }
//     );
//     res.status(200).json({ message: `User role updated to ${user.role}` });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to update role." });
//   }
// });

// // Delete user (super-admin only)
// router.delete("/:id", verifyToken, async (req, res) => {
//   if (req.user.role !== "super-admin") {
//     return res
//       .status(403)
//       .json({ error: "Only super-admin can delete users." });
//   }

//   try {
//     await User.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "User deleted successfully." });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to delete user." });
//   }
// });

// // Get logged-in user's profile details
// router.get("/profile", verifyToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id, "fullname email role");
//     if (!user) {
//       return res.status(404).json({ error: "User not found." });
//     }
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch user profile." });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const User = require("../models/user");
const verifyToken = require("../middleware/verifyToken");

/**
 * ✅ Get logged-in user's profile (place FIRST before any :id route!)
 */
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(
      req.user.id,
      "fullname email role createdAt"
    );
    if (!user) return res.status(404).json({ error: "User not found." });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user profile." });
  }
});

/**
 * ✅ Get all users (admin or super-admin only)
 */
router.get("/", verifyToken, async (req, res) => {
  if (!["admin", "super-admin"].includes(req.user.role)) {
    return res.status(403).json({ error: "Access denied" });
  }

  try {
    // Added createdAt for frontend sorting/filtering
    const users = await User.find(
      {},
      "fullname email role isApproved createdAt"
    );
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users." });
  }
});

/**
 * ✅ Approve user/admin
 */
router.put("/:id/approve", verifyToken, async (req, res) => {
  try {
    const approver = req.user;
    const targetUser = await User.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({ error: "User not found." });
    }

    if (approver.id === targetUser.id) {
      return res.status(403).json({ error: "You cannot approve yourself." });
    }

    if (targetUser.isApproved) {
      return res.status(400).json({ error: "User is already approved." });
    }

    // Role-based approval rules
    if (targetUser.role === "admin" && approver.role !== "super-admin") {
      return res
        .status(403)
        .json({ error: "Only super-admins can approve admins." });
    }
    if (
      targetUser.role === "user" &&
      !["admin", "super-admin"].includes(approver.role)
    ) {
      return res
        .status(403)
        .json({ error: "Only admins or super-admins can approve users." });
    }

    targetUser.isApproved = true;
    await targetUser.save();

    res.status(200).json({
      message: `${targetUser.role} approved successfully.`,
      user: targetUser,
    });
  } catch (error) {
    res.status(500).json({ error: "Approval failed." });
  }
});

/**
 * ✅ Update user role (super-admin only)
 */
router.put("/:id/role", verifyToken, async (req, res) => {
  if (req.user.role !== "super-admin") {
    return res
      .status(403)
      .json({ error: "Only super-admin can update user roles." });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    );
    res.status(200).json({
      message: `User role updated to ${user.role}`,
      user,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update role." });
  }
});

/**
 * ✅ Delete user (super-admin only)
 */
router.delete("/:id", verifyToken, async (req, res) => {
  if (req.user.role !== "super-admin") {
    return res
      .status(403)
      .json({ error: "Only super-admin can delete users." });
  }

  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user." });
  }
});

module.exports = router;
