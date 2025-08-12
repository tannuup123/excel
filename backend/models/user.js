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
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
