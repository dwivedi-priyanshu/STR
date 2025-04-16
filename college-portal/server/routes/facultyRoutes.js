const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/facultyController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Protect faculty routes with auth and role middleware
router.use(authMiddleware);
router.use(roleMiddleware(['faculty']));

router.put('/authorize/:userId', facultyController.authorizeStudent);
router.post('/academicdata', facultyController.addAcademicData);
router.post('/academicdata/excel', upload.single('excelFile'), facultyController.addAcademicDataExcel);
router.delete('/student/:userId', facultyController.deleteStudent);
router.put('/miniproject/:projectId', facultyController.approveMiniProject);
router.put('/mooc/:moocId', facultyController.approveMOOC);
router.get('/dashboard/:userId', facultyController.getStudentDashboardData);
router.get('/students', facultyController.searchStudents);
router.get('/student/semester/:userId', facultyController.getStudentProfileBySemester);
router.post('/performance', upload.single('excelFile'), facultyController.uploadStudentPerformance);

module.exports = router;