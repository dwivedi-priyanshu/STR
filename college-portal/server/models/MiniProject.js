const mongoose = require('mongoose');

const miniProjectSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  reportPath: { type: String },
  pptPath: { type: String },
  approved: { type: Boolean, default: false },
});

module.exports = mongoose.model('MiniProject', miniProjectSchema);