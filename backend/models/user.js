const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['user', 'admin', 'super-admin'],
    default: 'user'
  },
  phoneNumber: { type: String },
  employeeId: { type: String },
  isApproved: { type: Boolean, default: false },
  passwordResetToken: String,
  passwordResetExpires: Date,
  // ✅ NEW FIELDS
  profilePicture: { type: String, default: 'uploads/default-avatar.png' }, // Default picture path
  otp: { type: String },
  otpExpires: { type: Date },
  deletedAt: { type: Date, default: null } // 🆕 NEW FIELD for soft delete
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
