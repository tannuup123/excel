// models/File.js
const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  chartType: { type: String, required: true },
  xAxis: { type: String, required: true },
  yAxis: { type: [String], required: true },
  createdAt: { type: Date, default: Date.now },
});

const fileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileName: { type: String, required: true },
  fileId: { type: String, required: true, unique: true },
  uploadDate: { type: Date, default: Date.now },
  processedData: { type: mongoose.Schema.Types.Mixed },
  analyses: [analysisSchema], 
});

const File = mongoose.models.File || mongoose.model('File', fileSchema);

module.exports = File;