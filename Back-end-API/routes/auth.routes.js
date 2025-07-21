
const express = require('express');
const { check } = require('express-validator');
const authController = require('../controllers/auth');
const { validate } = require('../middleware/validate.middleware');

const router = express.Router();

// Student registration
router.post(
  '/register/student',
  [
    check('firstName', 'First name is required').notEmpty(),
    check('lastName', 'Last name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    check('dateOfBirth', 'Date of birth is required').isISO8601().toDate(),
    validate
  ],
  authController.registerStudent
);

// Instructor registration
router.post(
  '/register/instructor',
  [
    check('firstName', 'First name is required').notEmpty(),
    check('lastName', 'Last name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    check('specialization', 'Specialization is required').notEmpty(),
    check('isSpecialist', 'Is specialist field is required').isBoolean(),
    validate
  ],
  authController.registerInstructor
);

// Admin registration
router.post(
  '/register/admin',
  [
    check('firstName', 'First name is required').notEmpty(),
    check('lastName', 'Last name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    validate
  ],
  authController.registerAdmin
);

// Updated login route without role requirement
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
    validate
  ],
  authController.login
);

// Create test accounts
router.post('/seed-test-accounts', authController.seedTestAccounts);

module.exports = router;
