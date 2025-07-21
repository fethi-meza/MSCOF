
const express = require('express');
const { check } = require('express-validator');
const gradeController = require('../controllers/grade.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');

const router = express.Router();

// Get all grades - Admin/instructor only
router.get('/', protect, restrictTo('admin', 'instructor'), gradeController.getAllGrades);

// Create grade - Admin/instructor only
router.post(
  '/',
  protect,
  restrictTo('admin', 'instructor'),
  [
    check('value', 'Value is required and must be between 0 and 100').isFloat({ min: 0, max: 100 }),
    check('studentId', 'Student ID is required').isInt({ min: 1 }),
    check('courseId', 'Course ID is required').isInt({ min: 1 }),
    validate
  ],
  gradeController.createGrade
);

// Get grade by ID
router.get('/:id', protect, gradeController.getGradeById);

// Update grade - Admin/instructor only
router.put(
  '/:id',
  protect,
  restrictTo('admin', 'instructor'),
  [
    check('value', 'Value is required and must be between 0 and 100').isFloat({ min: 0, max: 100 }),
    validate
  ],
  gradeController.updateGrade
);

// Delete grade - Admin/instructor only
router.delete(
  '/:id',
  protect,
  restrictTo('admin', 'instructor'),
  gradeController.deleteGrade
);

module.exports = router;
