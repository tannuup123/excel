const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  loginTime: Date,
  logoutTime: Date
});

module.exports = mongoose.model('Session', sessionSchema);
