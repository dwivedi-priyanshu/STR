const mongoose = require('mongoose');

const academicDataSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  semester: { type: Number, required: true },
  subjectName: { type: String, required: true },
  ia1Marks: { type: Number },
  ia2Marks: { type: Number },
  assignmentMarks: { type: Number },
});

module.exports = mongoose.model('AcademicData', academicDataSchema);