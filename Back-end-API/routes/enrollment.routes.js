
const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { createEnrollmentValidation, updateEnrollmentValidation } = require('../middleware/enrollment.validation');
const {
  getAllEnrollments,
  getStudentEnrollments,
  getFormationEnrollments,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
} = require('../controllers/enrollment.controller');

// Get all enrollments
router.get('/', protect, restrictTo('admin'), getAllEnrollments);

// Get enrollments for a student
router.get('/student/:studentId', protect, getStudentEnrollments);

// Get enrollments for a formation
router.get('/formation/:formationId', protect, getFormationEnrollments);

// Create a new enrollment
router.post('/', protect, createEnrollmentValidation, validate, createEnrollment);

// Update enrollment
router.patch('/:id', protect, restrictTo('admin'), updateEnrollmentValidation, validate, updateEnrollment);

// Delete enrollment - allow students to delete their own enrollments
router.delete('/:id', protect, deleteEnrollment);

module.exports = router;
