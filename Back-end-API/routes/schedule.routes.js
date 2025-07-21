
const express = require('express');
const { check } = require('express-validator');
const scheduleController = require('../controllers/schedule.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');

const router = express.Router();

// Get all schedules
router.get('/', scheduleController.getAllSchedules);

// Create schedule - Admin only
router.post(
  '/',
  protect,
  restrictTo('admin'),
  [
    check('dayOfWeek', 'Day of week is required').isIn(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']),
    check('startTime', 'Start time is required in format HH:MM').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    check('endTime', 'End time is required in format HH:MM').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    check('location', 'Location is required').notEmpty(),
    check('formationId', 'Formation ID is required').isInt({ min: 1 }),
    validate
  ],
  scheduleController.createSchedule
);

// Get schedule by ID
router.get('/:id', scheduleController.getScheduleById);

// Update schedule - Admin only
router.put(
  '/:id',
  protect,
  restrictTo('admin'),
  scheduleController.updateSchedule
);

// Delete schedule - Admin only
router.delete(
  '/:id',
  protect,
  restrictTo('admin'),
  scheduleController.deleteSchedule
);

module.exports = router;
