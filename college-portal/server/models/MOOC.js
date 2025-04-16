const mongoose = require('mongoose');

const moocSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseName: { type: String, required: true },
  platform: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  certificatePath: { type: String },
  approved: { type: Boolean, default: false },
});

module.exports = mongoose.model('MOOC', moocSchema);