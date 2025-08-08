const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  role: {
    type: String,
    enum: ['regular_user', 'admin', 'super_admin'],
    default: 'regular_user'
  },

  isApproved: {
    type: Boolean,
    default: function () {
      return this.role === 'super_admin'; // Auto-approve only super_admins
    }
  }
});

// ✅ Prevent OverwriteModelError
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
