const express = require("express");
const router = express.Router();
const User = require("../models/user");
const verifyToken = require("../middleware/verifyToken"); 
const bcrypt = require('bcryptjs'); // You need bcrypt for password hashing
const crypto = require('crypto'); // Used to generate the random password 
const nodemailer = require('nodemailer'); // Used for sending the email

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

// =================== NEW ROUTE ===================
/**
 * ✅ Create a new user (super-admin only) and send a password
 */
router.post("/", verifyToken, async (req, res) => {
    if (req.user.role !== "super-admin") {
        return res.status(403).json({ error: "Access denied. Super Admin role required." });
    }

    try {
        const { fullname, email, role } = req.body;

        if (!fullname || !email || !role) {
            return res.status(400).json({ error: "Full Name, Email, and Role are required." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: `The email '${email}' is already in use.` });
        }

        // 🆕 NEW: Generate a random 8-character password
        const generatedPassword = crypto.randomBytes(4).toString('hex');

        // 🆕 NEW: Hash the generated password
        const hashedPassword = await bcrypt.hash(generatedPassword, 10);

        const newUser = new User({
            fullname,
            email,
            password: hashedPassword,
            role,
            isApproved: true,
        });

        await newUser.save();

        // 🆕 NEW: Send the auto-generated password to the user's email
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            to: newUser.email,
            from: process.env.EMAIL_USERNAME,
            subject: 'Your New Account Details',
            html: ` <p>Welcome to our platform, ${newUser.fullname}!</p>
                <p>A new account has been created for you on our system.</p>
                <p>Your login details are:</p>
                <ul>
                    <li><strong>Email:</strong> ${newUser.email}</li>
                    <li><strong>Password:</strong> ${generatedPassword}</li>
                </ul>
                <p>Please log in and change your password immediately for security purposes.</p>
                <p>Thank you,</p>
                <p>Your Team</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: 'User added successfully! A temporary password has been sent to their email.' });

    } catch (error) {
        console.error("❌ Failed to add new user:", error);
        res.status(500).json({ error: 'Server error while adding user or sending email.' });
    }
});

/**
 * ✅ Update user details (super-admin only)
 * This route allows updating fullname, email, and role, but NOT the password.
 */
router.put("/:id", verifyToken, async (req, res) => {
    if (req.user.role !== "super-admin") {
        return res.status(403).json({ error: "Access denied. Super Admin role required." });
    }

    try {
        const { fullname, email, role, isApproved } = req.body;
        const targetUser = await User.findById(req.params.id);

        if (!targetUser) {
            return res.status(404).json({ error: "User not found." });
        }

        // Prevent a super admin from editing their own account via this route
        if (req.user.id === targetUser._id.toString()) {
            return res.status(403).json({ error: "You cannot edit your own account details via this route." });
        }
        
        // Ensure no one tries to change their own role to super-admin
        if (targetUser.role !== 'super-admin' && req.body.role === 'super-admin' && req.user.role !== 'super-admin') {
            return res.status(403).json({ error: 'Only an existing super-admin can assign the super-admin role.' });
        }

        // Apply updates if the fields are provided
        if (fullname) targetUser.fullname = fullname;
        if (email) targetUser.email = email;
        if (role) targetUser.role = role;
        if (isApproved !== undefined) targetUser.isApproved = isApproved;

        // The password field is explicitly excluded from being updated here.
        
        await targetUser.save();

        // Respond with the updated user data
        const updatedUser = {
            _id: targetUser._id,
            fullname: targetUser.fullname,
            email: targetUser.email,
            role: targetUser.role,
            isApproved: targetUser.isApproved,
            createdAt: targetUser.createdAt
        };

        res.status(200).json({
            message: "User details updated successfully.",
            user: updatedUser
        });

    } catch (error) {
        console.error("User update error:", error);
        res.status(500).json({ error: "Failed to update user details." });
    }
});
// =================================================

// ✅ Get all users (admin or super-admin only)
router.get("/", verifyToken, async (req, res) => {
  if (!["admin", "super-admin"].includes(req.user.role)) {
    return res.status(403).json({ error: "Access denied" });
  }

  try {
    // 🚀 Filter out deleted users so they don't reappear in table
    const users = await User.find(
  { deletedAt: null },
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
      return res.status(403).json({
        error: "Only admins or super-admins can modify user approval.",
      });
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

// ✅ Delete user - hard delete
const DeletionLog = require('../models/deletionLog'); // add at top

router.delete("/:id", verifyToken, async (req, res) => {
  const requesterRole = req.user.role;

  if (!["admin", "super-admin"].includes(requesterRole)) {
    return res.status(403).json({ error: "Access denied. Only admins or super-admins can delete users." });
  }

  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ error: "User not found." });
    }

    // prevent admins from deleting other admins or super-admins
    if (
      requesterRole === "admin" &&
      ["admin", "super-admin"].includes(targetUser.role)
    ) {
      return res.status(403).json({ error: "Admins can only delete regular users." });
    }

    // ✅ Hard delete user
    await User.findByIdAndDelete(req.params.id);

    // ✅ Log deletion
    await DeletionLog.create({
      userId: targetUser._id,
      deletedBy: req.user.id,
      userEmail: targetUser.email,
      userName: targetUser.fullname
    });

    res.status(200).json({ message: "User permanently deleted and logged." });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete user." });
  }
});




module.exports = router;
