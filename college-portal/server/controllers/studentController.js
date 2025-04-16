// controllers/studentController.js

const StudentProfile = require('../models/StudentProfile');
const User = require('../models/User');
const MiniProject = require('../models/MiniProject');
const MOOC = require('../models/MOOC');
const AcademicData = require('../models/AcademicData');
const path = require('path');

exports.completeProfile = async (req, res) => {
  try {
    const { userId } = req.user; // From authMiddleware
    const {
      studentName,
      usn,
      fatherName,
      motherName,
      gender,
      dateOfBirth,
      bloodGroup,
      aadharNumber,
      category,
      religion,
      nationality,
      address,
      phoneNumber,
      email,
      sslcMarks,
      pucMarks,
      branch,
      section,
      semester,
    } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isAuthorized) {
      return res.status(403).json({ message: 'User not authorized.' });
    }

    const profile = new StudentProfile({
      userId,
      studentName,
      usn,
      fatherName,
      motherName,
      gender,
      dateOfBirth,
      bloodGroup,
      aadharNumber,
      category,
      religion,
      nationality,
      address,
      phoneNumber,
      email,
      sslcMarks,
      pucMarks,
      branch,
      section,
      semester,
    });

    await profile.save();
    res.status(201).json({ message: 'Profile completed successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.uploadMiniProject = async (req, res) => {
  try {
    const { userId } = req.user; // From authMiddleware
    const { title, teamMembers, guideName, description } = req.body;

    // Check if report and ppt files were uploaded
    if (!req.files || !req.files.report || !req.files.ppt) {
      return res.status(400).json({ message: 'Report and PPT files are required.' });
    }

    const reportFile = req.files.report[0];
    const pptFile = req.files.ppt[0];

    const reportPath = path.join('uploads', reportFile.filename);
    const pptPath = path.join('uploads', pptFile.filename);

    const miniProject = new MiniProject({
      userId,
      title,
      teamMembers,
      guideName,
      description,
      reportPath,
      pptPath,
    });

    await miniProject.save();

    res.status(201).json({ message: 'Mini project uploaded successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.uploadMOOC = async (req, res) => {
  try {
    const { userId } = req.user; // From authMiddleware
    const { courseName, platform, completionDate } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Certificate file is required.' });
    }

    const certificatePath = path.join('uploads', req.file.filename);

    const mooc = new MOOC({
      userId,
      courseName,
      platform,
      completionDate,
      certificatePath,
    });

    await mooc.save();

    res.status(201).json({ message: 'MOOC certificate uploaded successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getAcademicData = async (req, res) => {
  try {
    const { userId } = req.user; // From authMiddleware

    const academicData = await AcademicData.find({ userId });

    res.status(200).json(academicData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};