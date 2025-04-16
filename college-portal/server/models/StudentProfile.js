const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  studentName: { type: String, required: true },
  usn: { type: String, required: true, unique: true },
  fatherName: { type: String, required: true },
  motherName: { type: String, required: true },
  gender: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  bloodGroup: { type: String },
  aadharNumber: { type: String },
  category: { type: String },
  religion: { type: String },
  nationality: { type: String },
  address: { type: String },
  phoneNumber: { type: String },
  email: { type: String },
  sslcMarks: { type: Number },
  pucMarks: { type: Number },
  branch: { type: String, required: true },
  section: { type: String },
  semester: { type: Number },
});

module.exports = mongoose.model('StudentProfile', studentProfileSchema);