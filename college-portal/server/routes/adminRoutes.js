const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Protect admin routes with auth and role middleware
router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

router.post('/user', adminController.createUser);
router.get('/students', adminController.getAllStudentData);
router.delete('/user/:userId', adminController.deleteUser);
router.put('/user/suspend/:userId', adminController.suspendUser);

module.exports = router;