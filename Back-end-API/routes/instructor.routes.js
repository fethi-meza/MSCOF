
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { validate } = require('../middleware/validate.middleware');
const { protect, restrictTo } = require('../middleware/auth.middleware');

const prisma = new PrismaClient();

// Get all instructors
router.get('/', async (req, res, next) => {
  try {
    const instructors = await prisma.instructor.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        specialization: true,
        isSpecialist: true,
        departmentId: true,
      },
    });
    
    res.status(200).json({
      status: 'success',
      results: instructors.length,
      data: instructors,
    });
  } catch (error) {
    next(error);
  }
});

// Get instructor by ID
router.get('/:id', async (req, res, next) => {
  try {
    const instructor = await prisma.instructor.findUnique({
      where: { id: parseInt(req.params.id) },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        specialization: true,
        isSpecialist: true,
        departmentId: true,
        department: true,
        classes: true,
        formations: true,
      },
    });

    if (!instructor) {
      return res.status(404).json({
        status: 'fail',
        message: 'Instructor not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: instructor,
    });
  } catch (error) {
    next(error);
  }
});

// Update instructor
router.patch('/:id', protect, restrictTo('instructor', 'admin'), async (req, res, next) => {
  try {
    // Ensure instructors can only update their own profile
    if (req.role === 'instructor' && req.user.id !== parseInt(req.params.id)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You can only update your own profile',
      });
    }

    // Prevent updating email (which is unique) or password via this route
    const { email, password, ...updateData } = req.body;

    const updatedInstructor = await prisma.instructor.update({
      where: { id: parseInt(req.params.id) },
      data: updateData,
    });

    res.status(200).json({
      status: 'success',
      data: updatedInstructor,
    });
  } catch (error) {
    next(error);
  }
});

// Delete instructor
router.delete('/:id', protect, restrictTo('admin'), async (req, res, next) => {
  try {
    await prisma.instructor.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
