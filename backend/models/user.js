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
      return this.role === 'super_admin'; // Only super_admin auto-approved
    }
  }
});

module.exports = mongoose.model('User', userSchema);
