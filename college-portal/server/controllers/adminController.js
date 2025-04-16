const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const AcademicData = require('../models/AcademicData');
const MiniProject = require('../models/MiniProject');
const MOOC = require('../models/MOOC');

exports.createUser = async (req, res) => {
  // ... (Similar to register in authController, but for admin-created users)
};

exports.getAllStudentData = async (req, res) => {
  try {
    const students = await StudentProfile.find().populate('userId', 'username email');
    const academicData = await AcademicData.find();
    const miniProjects = await MiniProject.find();
    const moocs = await MOOC.find();

    res.json({ students, academicData, miniProjects, moocs });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    await StudentProfile.findOneAndDelete({userId: userId});
    await AcademicData.deleteMany({studentId: userId});
    await MiniProject.deleteMany({studentId: userId});
    await MOOC.deleteMany({studentId: userId});

    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.suspendUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findByIdAndUpdate(userId, {isAuthorized: false}, {new: true});
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        res.json({message: "user suspended"});
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};