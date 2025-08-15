const mongoose = require('mongoose');

const deletionLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deletedAt: { type: Date, default: Date.now },
  userEmail: String,
  userName: String
});

// Use this pattern to avoid OverwriteModelError
module.exports = mongoose.models.DeletionLog || mongoose.model('DeletionLog', deletionLogSchema);
