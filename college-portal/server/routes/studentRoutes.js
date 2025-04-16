const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Protect student routes with auth middleware
router.use(authMiddleware);

router.post('/profile', studentController.completeProfile);
router.post('/miniproject', upload.fields([{ name: 'report', maxCount: 1 }, { name: 'ppt', maxCount: 1 }]), studentController.uploadMiniProject);
router.post('/mooc', upload.single('certificate'), studentController.uploadMOOC);
router.get('/academicdata', studentController.getAcademicData);

module.exports = router;