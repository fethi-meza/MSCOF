
const express = require('express');
const { check } = require('express-validator');
const formationController = require('../controllers/formation.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');

const router = express.Router();

// Get all formations - Public
router.get('/', formationController.getAllFormations);

// Get formation by ID - Public
router.get('/:id', formationController.getFormationById);

// Create formation - Admin only
router.post(
  '/',
  protect,
  restrictTo('admin'),
  [
    check('name', 'Name is required').notEmpty(),
    check('availableSpots', 'Available spots must be a positive number').isInt({ min: 1 }),
    check('durationInHours', 'Duration must be a positive number').isInt({ min: 1 }),
    check('startDate', 'Start date is required').isISO8601().toDate(),
    check('endDate', 'End date is required').isISO8601().toDate(),
    validate
  ],
  formationController.createFormation
);

// Update formation - Admin only
router.put(
  '/:id',
  protect,
  restrictTo('admin'),
  formationController.updateFormation
);

// Delete formation - Admin only
router.delete(
  '/:id',
  protect,
  restrictTo('admin'),
  formationController.deleteFormation
);

// Get formation schedules
router.get('/:id/schedules', formationController.getFormationSchedules);

// Get formation enrollments
router.get(
  '/:id/enrollments',
  protect,
  restrictTo('admin', 'instructor'),
  formationController.getFormationEnrollments
);

// Enroll student in formation
router.post(
  '/:id/enroll',
  protect,
  formationController.enrollStudent
);

module.exports = router;
