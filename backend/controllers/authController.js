const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const crypto = require('crypto'); // Built-in Node.js module
const nodemailer = require('nodemailer'); // Make sure to install this: npm install nodemailer

const validRoles = ["user", "admin", "super-admin"];

// ✅ REGISTER
exports.register = async (req, res) => {
  try {
    const { fullname, email, password, role, phoneNumber, employeeId } =
      req.body;

    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role selected." });
    }

    if (role === "admin" && (!phoneNumber || !employeeId)) {
      return res
        .status(400)
        .json({
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
};

// ✅ LOGIN
exports.login = async (req, res) => {
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
        .json({
          error: `Forbidden: You are not authorized to login as ${role}.`,
        });
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
};

// ✅ ONE-TIME SUPER ADMIN CREATION
exports.createSuperAdmin = async (req, res) => {
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
};

// ✅ FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User with that email does not exist.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 1800000; // 30 Min
    await user.save();

    const resetURL = `${req.protocol}://${req.get('host')}/api/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USERNAME,
      subject: 'Password Reset',
      html: `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
                   <p>Please click on the following link, or paste this into your browser to complete the process within 30 Min:</p>
                   <a href="${resetURL}">Reset Password</a>`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Password reset email sent.' });

  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.status(500).json({ error: 'There was an error sending the email.' });
  }
};

// ✅ RESET PASSWORD
exports.resetPassword = async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  try {
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Token is invalid or has expired.' });
    }

    user.password = await bcrypt.hash(req.body.password, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully.' });

  } catch (err) {
    res.status(500).json({ error: 'Failed to reset password.' });
  }
};