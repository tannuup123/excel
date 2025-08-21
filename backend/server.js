const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config();

const verifyToken = require("./middleware/verifyToken");
const userRoutes = require("./routes/userRoutes");
const fileRoutes = require("./routes/fileRoutes");
const adminRoutes = require("./routes/adminRoutes");
const User = require("./models/user");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Atlas connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Atlas connection error:", err);
    process.exit(1);
  });

// =================== PUBLIC ROUTES ===================
app.post("/api/register", async (req, res) => {
  try {
    const { fullname, email, password, role, phoneNumber, employeeId } =
      req.body;
    const validRoles = ["user", "admin", "super-admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role selected." });
    }
    if (role === "admin" && (!phoneNumber || !employeeId)) {
      return res.status(400).json({
        error: "Admin registration requires phone number and employee ID.",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: `The email '${email}' is already in use.` });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
      role,
      phoneNumber: role === "admin" ? phoneNumber : undefined,
      employeeId: role === "admin" ? employeeId : undefined,
      isApproved: role === "super-admin" ? true : false,
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("❌ Registration failed:", error);
    res
      .status(500)
      .json({ error: "Registration failed due to a server error." });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "Invalid email or password." });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Invalid email or password." });
    if (user.role !== "super-admin" && user.role !== role) {
      return res
        .status(403)
        .json({ error: `You are not authorized to login as ${role}.` });
    }
    if (user.role === "admin" && !user.isApproved) {
      return res.status(403).json({ error: "Admin approval pending." });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.status(200).json({
      message: "Login successful!",
      user: {
        name: user.fullname,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("❌ Login failed:", error);
    res.status(500).json({ error: "Server error during login." });
  }
});

app.post("/api/forgot-password", async (req, res) => {
  const { email } = req.body;
  let user;
  try {
    user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ error: "User with that email does not exist." });
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.passwordResetExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USERNAME,
      subject: "Password Reset",
      html: `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
             <p>Please click on the following link, or paste this into your browser to complete the process within one hour:</p>
             <a href="${resetURL}">Reset Password</a>`,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Password reset email sent." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "There was an error sending the email." });
  }
});

app.post("/api/reset-password/:token", async (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  try {
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ error: "Token is invalid or has expired." });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to reset password." });
  }
});

app.post("/api/create-super-admin", async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    const existingSuperAdmin = await User.findOne({ role: "super-admin" });
    if (existingSuperAdmin) {
      return res.status(400).json({ error: "A super admin already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
      role: "super-admin",
      isApproved: true,
    });
    await newUser.save();
    res.status(201).json({ message: "Super Admin created successfully!" });
  } catch (error) {
    console.error("❌ Failed to create Super Admin:", error);
    res.status(500).json({ error: "Failed to create Super Admin." });
  }
});

// =================== PROTECTED ROUTES ===================
app.use("/api/users", verifyToken, userRoutes);
app.use("/api/files", verifyToken, fileRoutes);
app.use("/api/admin", verifyToken, adminRoutes);

// =================== START SERVER ===================
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
