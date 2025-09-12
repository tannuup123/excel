const express = require("express");
const router = express.Router();
const User = require("../models/user");
const DeletionLog = require("../models/DeletionLog");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const verifyToken = require("../middleware/verifyToken");

//=================================================
// --- Setup ---

// Multer Setup
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    cb(null, "user-" + req.user.id + "-" + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: Please upload images only (jpeg, jpg, png).");
    }
  },
}).single("profilePicture");

// Nodemailer Setup
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

//=================================================
// --- User Profile Management (Logged-in User) ---

router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id, "-password -otp -otpExpires");
    if (!user) return res.status(404).json({ error: "User not found." });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user profile." });
  }
});

router.post("/upload-picture", verifyToken, (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err });
    if (!req.file) return res.status(400).json({ error: "No file selected!" });
    try {
      const user = await User.findById(req.user.id);
      user.profilePicture = req.file.path;
      await user.save();
      res.status(200).json({ message: "Profile picture updated!", filePath: req.file.path });
    } catch (dbError) {
      res.status(500).json({ error: "Database error while saving picture." });
    }
  });
});

router.put("/profile", verifyToken, async (req, res) => {
  try {
    const { fullname } = req.body;
    if (!fullname) return res.status(400).json({ error: "Fullname is required." });
    const user = await User.findByIdAndUpdate(req.user.id, { fullname }, { new: true }).select("-password -otp -otpExpires");
    res.status(200).json({ message: "Profile updated successfully.", user });
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile." });
  }
});

//=================================================
// --- OTP-Based Changes (Logged-in User) ---

router.post("/initiate-change", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 600000; // 10 minutes
    await user.save();
    await transporter.sendMail({
      to: user.email,
      from: process.env.EMAIL_USERNAME,
      subject: "Your Verification Code",
      html: `<p>Your verification code is: <strong>${otp}</strong>. It will expire in 10 minutes.</p>`,
    });
    res.status(200).json({ message: `An OTP has been sent to ${user.email}.` });
  } catch (error) {
    res.status(500).json({ error: "Failed to send OTP." });
  }
});

router.post("/verify-change-email", verifyToken, async (req, res) => {
  const { newEmail, otp } = req.body;
  try {
    const user = await User.findOne({ _id: req.user.id, otp: otp, otpExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ error: "Invalid or expired OTP." });
    const emailExists = await User.findOne({ email: newEmail });
    if (emailExists) return res.status(400).json({ error: "This email is already in use." });
    user.email = newEmail;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    res.status(200).json({ message: "Email address updated successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to update email." });
  }
});

router.post("/verify-change-password", verifyToken, async (req, res) => {
  try {
    const { newPassword, otp } = req.body;
    const user = await User.findOne({ _id: req.user.id, otp: otp, otpExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ error: "Invalid or expired OTP." });
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) return res.status(400).json({ error: "New password cannot be the same as the old password." });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    res.json({ message: "Password changed successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to update password." });
  }
});

//=================================================
// --- Forgot Password Flow (Logged-out User) ---  ✅ FIXED
//=================================================

// This route name now matches the one your frontend is calling
router.post("/request-password-reset", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      // For security, don't reveal if the user exists or not.
      return res.status(200).json({ message: "If an account with that email exists, a password reset link has been sent." });
    }
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`; // Adjust if your frontend URL is different
    await transporter.sendMail({
      to: user.email,
      from: process.env.EMAIL_USERNAME,
      subject: "Password Reset Request",
      html: `<p>Click the link to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`,
    });
    res.json({ message: "Password reset email sent." });
  } catch (error) {
    res.status(500).json({ error: "Failed to send password reset email." });
  }
});

router.post("/reset-password/:token", async (req, res) => {
  try {
    const { newPassword } = req.body;
    const user = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ error: "Password reset token is invalid or has expired." });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ message: "Password has been successfully reset." });
  } catch (error) {
    res.status(500).json({ error: "Failed to reset password." });
  }
});

//=================================================
// --- Admin & Super-admin Actions ---
//=================================================

router.get("/", verifyToken, async (req, res) => {
  if (!["admin", "super-admin"].includes(req.user.role)) {
    return res.status(403).json({ error: "Access denied" });
  }
  try {
    const users = await User.find({ deletedAt: null }, "fullname email role isApproved createdAt");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users." });
  }
});

router.post("/", verifyToken, async (req, res) => {
  if (req.user.role !== "super-admin") {
    return res.status(403).json({ error: "Access denied. Super Admin role required." });
  }
  try {
    const { fullname, email, role } = req.body;
    if (!fullname || !email || !role) return res.status(400).json({ error: "Full Name, Email, and Role are required." });
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: `The email '${email}' is already in use.` });
    const generatedPassword = crypto.randomBytes(4).toString("hex");
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);
    const newUser = new User({ fullname, email, password: hashedPassword, role, isApproved: true });
    await newUser.save();
    await transporter.sendMail({
      to: newUser.email,
      from: process.env.EMAIL_USERNAME,
      subject: "Your New Account Details",
      html: `<p>Welcome, ${fullname}!</p><p>Your temporary password is: <strong>${generatedPassword}</strong></p>`,
    });
    res.status(201).json({ message: "User added! A temporary password has been sent." });
  } catch (error) {
    res.status(500).json({ error: "Server error while adding user." });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  if (req.user.role !== "super-admin") {
    return res.status(403).json({ error: "Access denied. Super Admin role required." });
  }
  try {
    const { fullname, email, role, isApproved } = req.body;
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ error: "User not found." });
    if (req.user.id === targetUser._id.toString()) return res.status(403).json({ error: "You cannot edit your own account via this route." });
    if (targetUser.role !== "super-admin" && req.body.role === "super-admin" && req.user.role !== "super-admin") {
      return res.status(403).json({ error: "Only an existing super-admin can assign the super-admin role." });
    }
    if (fullname) targetUser.fullname = fullname;
    if (email) targetUser.email = email;
    if (role) targetUser.role = role;
    if (isApproved !== undefined) targetUser.isApproved = isApproved;
    await targetUser.save();
    res.status(200).json({ message: "User details updated successfully.", user: targetUser });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user details." });
  }
});

router.put("/:id/approve", verifyToken, async (req, res) => {
  try {
    const approver = req.user;
    const targetUser = await User.findById(req.params.id);
    const { isApproved } = req.body;
    if (typeof isApproved !== "boolean") return res.status(400).json({ error: "Invalid approval status." });
    if (!targetUser) return res.status(404).json({ error: "User not found." });
    if (approver.id === targetUser.id) return res.status(403).json({ error: "You cannot change your own approval status." });
    if (targetUser.role === "admin" && approver.role !== "super-admin") return res.status(403).json({ error: "Only super-admins can modify admin approval." });
    if (targetUser.role === "user" && !["admin", "super-admin"].includes(approver.role)) {
      return res.status(403).json({ error: "Only admins or super-admins can modify user approval." });
    }
    targetUser.isApproved = isApproved;
    await targetUser.save();
    res.status(200).json({ message: `${targetUser.role} ${isApproved ? "approved" : "disapproved"}.`, user: targetUser });
  } catch (error) {
    res.status(500).json({ error: "Failed to update approval status." });
  }
});

router.put("/:id/role", verifyToken, async (req, res) => {
  if (req.user.role !== "super-admin") {
    return res.status(403).json({ error: "Only super-admin can update user roles." });
  }
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
    res.status(200).json({ message: `User role updated to ${user.role}`, user });
  } catch (error) {
    res.status(500).json({ error: "Failed to update role." });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  const requesterRole = req.user.role;
  if (!["admin", "super-admin"].includes(requesterRole)) {
    return res.status(403).json({ error: "Access denied. Only admins or super-admins can delete users." });
  }
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ error: "User not found." });
    if (requesterRole === "admin" && ["admin", "super-admin"].includes(targetUser.role)) {
      return res.status(403).json({ error: "Admins can only delete regular users." });
    }
    await User.findByIdAndDelete(req.params.id);
    await DeletionLog.create({
      userId: targetUser._id,
      deletedBy: req.user.id,
      userEmail: targetUser.email,
      userName: targetUser.fullname,
    });
    res.status(200).json({ message: "User permanently deleted and logged." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user." });
  }
});

module.exports = router;