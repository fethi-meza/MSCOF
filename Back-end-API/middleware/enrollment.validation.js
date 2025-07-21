
const { check } = require('express-validator');

const createEnrollmentValidation = [
  check('studentId', 'Student ID is required and must be a number').isInt({ min: 1 }),
  check('formationId', 'Formation ID is required and must be a number').isInt({ min: 1 }),
  check('status', 'Status must be a valid enrollment status').optional().isIn(['ACTIVE', 'COMPLETED', 'CANCELLED']),
];

const updateEnrollmentValidation = [
  check('status', 'Status must be a valid enrollment status').optional().isIn(['ACTIVE', 'COMPLETED', 'CANCELLED']),
];

module.exports = {
  createEnrollmentValidation,
  updateEnrollmentValidation,
};
