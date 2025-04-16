const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const AcademicData = require('../models/AcademicData');
const MiniProject = require('../models/MiniProject');
const MOOC = require('../models/MOOC');
const xlsx = require('xlsx');

exports.authorizeStudent = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(userId, { isAuthorized: true }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ message: 'Student authorized.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.addAcademicData = async (req, res) => {
    // ... (Add IA/Assignment marks, handles individual entries)
    try {
        const { userId, subject, marks } = req.body;

        // Validate input
        if (!userId || !subject || !marks) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        // Create a new academic data entry
        const academicData = new AcademicData({
            userId,
            subject,
            marks,
        });

        // Save the academic data to the database
        await academicData.save();

        res.status(201).json({ message: 'Academic data added successfully.', academicData });
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};

exports.addAcademicDataExcel = async (req, res) => {
    // ... (Add IA/Assignment marks via Excel upload)
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an Excel file.' });
        }

        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        if (!data || data.length === 0) {
            return res.status(400).json({ message: 'Excel file contains no data.' });
        }

        for (const row of data) {
            const { studentId, subject, marks } = row;

            if (!studentId || !subject || marks === undefined) {
                return res.status(400).json({ message: 'Invalid data in Excel file.' });
            }

            // Update or create academic data for the student
            await AcademicData.findOneAndUpdate(
                { userId: studentId, subject },
                { marks },
                { upsert: true, new: true }
            );
        }

        res.status(200).json({ message: 'Academic data updated successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

exports.deleteStudent = async (req, res) => {
    // ... (delete student user and all related data)
    try {
        const { studentId } = req.params;

        // Delete the student user
        const user = await User.findByIdAndDelete(studentId);
        if (!user) {
            return res.status(404).json({ message: 'Student not found.' });
        }

        // Delete related student profile
        await StudentProfile.findOneAndDelete({ userId: studentId });

        // Delete related academic data
        await AcademicData.deleteMany({ userId: studentId });

        // Delete related mini projects
        await MiniProject.deleteMany({ userId: studentId });

        // Delete related MOOCs
        await MOOC.deleteMany({ userId: studentId });

        res.json({ message: 'Student and related data deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};

exports.approveMiniProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    await MiniProject.findByIdAndUpdate(projectId, { approved: true });
    res.json({ message: 'Mini project approved.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.approveMOOC = async (req, res) => {
  try {
    const { moocId } = req.params;
    await MOOC.findByIdAndUpdate(moocId, { approved: true });
    res.json({ message: 'MOOC approved.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getStudentDashboardData = async (req, res) => {
    try {
        const { studentId } = req.params;

        // Fetch user details
        const user = await User.findById(studentId);
        if (!user) {
            return res.status(404).json({ message: 'Student not found.' });
        }

        // Fetch student profile
        const studentProfile = await StudentProfile.findOne({ userId: studentId });
        if (!studentProfile) {
            return res.status(404).json({ message: 'Student profile not found.' });
        }

        // Fetch academic data
        const academicData = await AcademicData.find({ userId: studentId });

        // Fetch mini projects
        const miniProjects = await MiniProject.find({ userId: studentId });

        // Fetch MOOCs
        const moocs = await MOOC.find({ userId: studentId });

        // Combine all data into a single response
        const dashboardData = {
            user,
            studentProfile,
            academicData,
            miniProjects,
            moocs,
        };

        res.json(dashboardData);
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};

exports.searchStudents = async (req, res) => {
    // ... (search student by name or USN)
    exports.searchStudents = async (req, res) => {
        try {
          const { query } = req.query;
      
          const students = await StudentProfile.find({
            $or: [
              { studentName: { $regex: query, $options: 'i' } }, // Case-insensitive search
              { usn: { $regex: query, $options: 'i' } },
            ],
          }).populate('userId', 'username email');
      
          res.json(students);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Server error.' });
        }
      };
};

exports.getStudentProfileBySemester = async (req, res) => {
    // ... (get student profile filtered by semester)
    exports.getStudentProfileBySemester = async (req, res) => {
        try {
          const { userId } = req.params;
          const { semester } = req.query;
      
          const academicData = await AcademicData.find({ studentId: userId, semester });
      
          res.json(academicData);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Server error.' });
        }
      };
};

exports.uploadStudentPerformance = async (req, res) => {
    upload.single('excelFile')(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: 'File upload error.' });
      }
  
      try {
        if (!req.file) {
          return res.status(400).json({ message: 'Please upload an Excel file.' });
        }
  
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);
  
        if (!data || data.length === 0) {
          return res.status(400).json({ message: 'Excel file contains no data.' });
        }
  
        const studentAverages = {};
        const subjectDistributions = {};
        const studentSubjectMarks = {};
  
        data.forEach((row) => {
          const studentId = row.studentId;
          const subject = row.subject;
          const marks = parseFloat(row.marks); // Ensure marks are numbers
  
          if (isNaN(marks)) {
            return; // Skip rows with invalid marks
          }
  
          // Calculate student averages
          if (!studentAverages[studentId]) {
            studentAverages[studentId] = { totalMarks: 0, count: 0 };
          }
          studentAverages[studentId].totalMarks += marks;
          studentAverages[studentId].count++;
  
          // Calculate subject distributions
          if (!subjectDistributions[subject]) {
            subjectDistributions[subject] = { marks: [] };
          }
          subjectDistributions[subject].marks.push(marks);
  
          //student marks per subject
          if(!studentSubjectMarks[studentId]){
            studentSubjectMarks[studentId] = {};
          }
          if(!studentSubjectMarks[studentId][subject]){
            studentSubjectMarks[studentId][subject] = [];
          }
          studentSubjectMarks[studentId][subject].push(marks);
  
        });
  
        // Calculate actual student averages
        for (const studentId in studentAverages) {
          studentAverages[studentId].average = studentAverages[studentId].totalMarks / studentAverages[studentId].count;
          delete studentAverages[studentId].totalMarks;
          delete studentAverages[studentId].count;
        }
  
        // Calculate subject distributions (min, max, average)
        for (const subject in subjectDistributions) {
          const marks = subjectDistributions[subject].marks;
          subjectDistributions[subject].min = Math.min(...marks);
          subjectDistributions[subject].max = Math.max(...marks);
          subjectDistributions[subject].average = marks.reduce((sum, mark) => sum + mark, 0) / marks.length;
        }
  
        res.json({ studentAverages, subjectDistributions, studentSubjectMarks });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
      }
    });
  };