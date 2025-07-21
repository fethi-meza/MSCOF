
const express = require('express');
const { check } = require('express-validator');
const studentController = require('../controllers/student.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');

const router = express.Router();

// Get all students - Admin only
router.get('/', protect, restrictTo('admin'), studentController.getAllStudents);

// Get student by ID
router.get('/:id', protect, studentController.getStudentById);

// Update student
router.put(
  '/:id',
  protect,
  [
    check('firstName', 'First name is required').optional().notEmpty(),
    check('lastName', 'Last name is required').optional().notEmpty(),
    check('email', 'Please include a valid email').optional().isEmail(),
    check('dateOfBirth', 'Date of birth must be a valid date').optional().isISO8601().toDate(),
    check('phoneNumber', 'Phone number is not valid').optional(),
    check('status', 'Status must be ACTIVE, GRADUATED, or DROPPED').optional().isIn(['ACTIVE', 'GRADUATED', 'DROPPED']),
    validate
  ],
  studentController.updateStudent
);

// Delete student - Admin only
router.delete('/:id', protect, restrictTo('admin'), studentController.deleteStudent);

// Get student formations
router.get('/:id/formations', protect, studentController.getStudentFormations);

// Get student grades
router.get('/:id/grades', protect, studentController.getStudentGrades);

// Get student attendance
router.get('/:id/attendance', protect, studentController.getStudentAttendance);

module.exports = router;
