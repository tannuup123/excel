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
    const approver = req.user; // ✅ Same: Logged-in user performing the action
    const targetUser = await User.findById(req.params.id); // ✅ Same: User to approve/disapprove

    const { isApproved } = req.body; // ✅ 🔄 CHANGED: Extracted from body to support both true and false

    // ✅ 🔄 NEW: Validate that isApproved is boolean (true or false)
    if (typeof isApproved !== "boolean") {
      return res.status(400).json({ error: "Invalid approval status." });
    }

    // ✅ Same: Handle missing user
    if (!targetUser) {
      return res.status(404).json({ error: "User not found." });
    }

    // ✅ Same: Prevent self-approval/disapproval
    if (approver.id === targetUser.id) {
      return res
        .status(403)
        .json({ error: "You cannot change your own approval status." });
    }

    // ✅ Same: Only super-admins can approve or disapprove admins
    if (targetUser.role === "admin" && approver.role !== "super-admin") {
      return res
        .status(403)
        .json({ error: "Only super-admins can modify admin approval." });
    }

    // ✅ Same: Only admins or super-admins can approve/disapprove users
    if (
      targetUser.role === "user" &&
      !["admin", "super-admin"].includes(approver.role)
    ) {
      return res
        .status(403)
        .json({ error: "Only admins or super-admins can modify user approval." });
    }

    // ✅ 🔄 CHANGED: Now supports both approve (true) and disapprove (false)
    targetUser.isApproved = isApproved;
    await targetUser.save();

    // ✅ 🔄 CHANGED: Clear message for either action
    res.status(200).json({
      message: `${targetUser.role} ${
        isApproved ? "approved" : "disapproved"
      } successfully.`,
      user: targetUser,
    });

  } catch (error) {
    console.error("Approval error:", error);
    res.status(500).json({ error: "Failed to update approval status." });
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
