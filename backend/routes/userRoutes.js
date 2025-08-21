const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const DeletionLog = require("../models/DeletionLog"); // ✅ fixed import

// --- Multer Setup for Image Upload ---
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      "user-" + req.user.id + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: Please upload images only (jpeg, jpg, png).");
    }
  },
}).single("profilePicture");

// --- Nodemailer Setup ---
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

//=================================================
// ✅ Profile routes
router.get("/profile", async (req, res) => {
  try {
    const user = await User.findById(req.user.id, "-password -otp -otpExpires");
    if (!user) return res.status(404).json({ error: "User not found." });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user profile." });
  }
});

// ✅ Upload profile picture
router.post("/upload-picture", (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No file selected!" });
    }
    try {
      const user = await User.findById(req.user.id);
      user.profilePicture = req.file.path; // Save the file path
      await user.save();
      res.status(200).json({
        message: "Profile picture updated successfully!",
        filePath: req.file.path,
      });
    } catch (dbError) {
      res.status(500).json({ error: "Database error while saving picture." });
    }
  });
});

// ✅ Update fullname
router.put("/profile", async (req, res) => {
  try {
    const { fullname } = req.body;
    if (!fullname)
      return res.status(400).json({ error: "Fullname is required." });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { fullname },
      { new: true }
    ).select("-password -otp -otpExpires");

    res.status(200).json({ message: "Profile updated successfully.", user });
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile." });
  }
});

//=================================================
// ✅ OTP-based changes
router.post("/initiate-change", async (req, res) => {
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

// ✅ Change email after OTP verification
router.post("/verify-change-email", async (req, res) => {
  const { newEmail, otp } = req.body;
  try {
    const user = await User.findOne({
      _id: req.user.id,
      otp: otp,
      otpExpires: { $gt: Date.now() },
    });
    if (!user)
      return res.status(400).json({ error: "Invalid or expired OTP." });

    const emailExists = await User.findOne({ email: newEmail });
    if (emailExists)
      return res.status(400).json({ error: "This email is already in use." });

    user.email = newEmail;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    res.status(200).json({ message: "Email address updated successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to update email." });
  }
});

// ✅ Change password after OTP verification
router.post("/verify-change-password", async (req, res) => {
  try {
    const { newPassword, otp } = req.body;

    const user = await User.findOne({
      _id: req.user.id,
      otp: otp,
      otpExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired OTP." });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        error:
          "New password cannot be the same as the old password. Cancel & Try Again",
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ message: "Password changed successfully." });
  } catch (error) {
    console.error("Password change error:", error);
    res.status(500).json({ error: "Failed to update password." });
  }
});

//=================================================
// ✅ Admin & Super-admin actions
router.post("/", async (req, res) => {
  if (req.user.role !== "super-admin") {
    return res
      .status(403)
      .json({ error: "Access denied. Super Admin role required." });
  }

  try {
    const { fullname, email, role } = req.body;

    if (!fullname || !email || !role) {
      return res
        .status(400)
        .json({ error: "Full Name, Email, and Role are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: `The email '${email}' is already in use.` });
    }

    const generatedPassword = crypto.randomBytes(4).toString("hex");
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
      role,
      isApproved: true,
    });

    await newUser.save();

    await transporter.sendMail({
      to: newUser.email,
      from: process.env.EMAIL_USERNAME,
      subject: "Your New Account Details",
      html: `<p>Welcome to our platform, ${newUser.fullname}!</p>
             <p>Your login details are:</p>
             <ul>
               <li><strong>Email:</strong> ${newUser.email}</li>
               <li><strong>Password:</strong> ${generatedPassword}</li>
             </ul>
             <p>Please log in and change your password immediately for security purposes.</p>`,
    });

    res.status(201).json({
      message:
        "User added successfully! A temporary password has been sent to their email.",
    });
  } catch (error) {
    console.error("❌ Failed to add new user:", error);
    res
      .status(500)
      .json({ error: "Server error while adding user or sending email." });
  }
});

// ✅ Update user details (super-admin only)
router.put("/:id", async (req, res) => {
  if (req.user.role !== "super-admin") {
    return res
      .status(403)
      .json({ error: "Access denied. Super Admin role required." });
  }

  try {
    const { fullname, email, role, isApproved } = req.body;
    const targetUser = await User.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({ error: "User not found." });
    }

    if (req.user.id === targetUser._id.toString()) {
      return res
        .status(403)
        .json({
          error: "You cannot edit your own account details via this route.",
        });
    }

    if (
      targetUser.role !== "super-admin" &&
      req.body.role === "super-admin" &&
      req.user.role !== "super-admin"
    ) {
      return res.status(403).json({
        error: "Only an existing super-admin can assign the super-admin role.",
      });
    }

    if (fullname) targetUser.fullname = fullname;
    if (email) targetUser.email = email;
    if (role) targetUser.role = role;
    if (isApproved !== undefined) targetUser.isApproved = isApproved;

    await targetUser.save();

    res.status(200).json({
      message: "User details updated successfully.",
      user: {
        _id: targetUser._id,
        fullname: targetUser.fullname,
        email: targetUser.email,
        role: targetUser.role,
        isApproved: targetUser.isApproved,
        createdAt: targetUser.createdAt,
      },
    });
  } catch (error) {
    console.error("User update error:", error);
    res.status(500).json({ error: "Failed to update user details." });
  }
});

// ✅ Get all users (admin or super-admin only)
router.get("/", async (req, res) => {
  if (!["admin", "super-admin"].includes(req.user.role)) {
    return res.status(403).json({ error: "Access denied" });
  }

  try {
    const users = await User.find(
      { deletedAt: null },
      "fullname email role isApproved createdAt"
    );
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users." });
  }
});

// ✅ Approve / disapprove user
router.put("/:id/approve", async (req, res) => {
  try {
    const approver = req.user;
    const targetUser = await User.findById(req.params.id);
    const { isApproved } = req.body;

    if (typeof isApproved !== "boolean") {
      return res.status(400).json({ error: "Invalid approval status." });
    }

    if (!targetUser) {
      return res.status(404).json({ error: "User not found." });
    }

    if (approver.id === targetUser.id) {
      return res
        .status(403)
        .json({ error: "You cannot change your own approval status." });
    }

    if (targetUser.role === "admin" && approver.role !== "super-admin") {
      return res
        .status(403)
        .json({ error: "Only super-admins can modify admin approval." });
    }

    if (
      targetUser.role === "user" &&
      !["admin", "super-admin"].includes(approver.role)
    ) {
      return res.status(403).json({
        error: "Only admins or super-admins can modify user approval.",
      });
    }

    targetUser.isApproved = isApproved;
    await targetUser.save();

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

// ✅ Update role (super-admin only)
router.put("/:id/role", async (req, res) => {
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

// ✅ Hard delete user
router.delete("/:id", async (req, res) => {
  const requesterRole = req.user.role;

  if (!["admin", "super-admin"].includes(requesterRole)) {
    return res
      .status(403)
      .json({
        error: "Access denied. Only admins or super-admins can delete users.",
      });
  }

  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ error: "User not found." });
    }

    if (
      requesterRole === "admin" &&
      ["admin", "super-admin"].includes(targetUser.role)
    ) {
      return res
        .status(403)
        .json({ error: "Admins can only delete regular users." });
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
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete user." });
  }
});

module.exports = router;
