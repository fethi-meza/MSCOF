
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { validate } = require('../middleware/validate.middleware');
const { protect, restrictTo } = require('../middleware/auth.middleware');

const prisma = new PrismaClient();

// Get all courses
router.get('/', async (req, res, next) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        department: true,
        formation: true,
      },
    });
    
    res.status(200).json({
      status: 'success',
      results: courses.length,
      data: courses,
    });
  } catch (error) {
    next(error);
  }
});

// Get course by ID
router.get('/:id', async (req, res, next) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        department: true,
        formation: true,
        grades: {
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!course) {
      return res.status(404).json({
        status: 'fail',
        message: 'Course not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: course,
    });
  } catch (error) {
    next(error);
  }
});

// Create a new course
router.post('/', protect, restrictTo('admin'), async (req, res, next) => {
  try {
    const { name, description, departmentId, formationId } = req.body;
    
    // Validate required fields
    if (!name || !departmentId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Name and department are required',
      });
    }
    
    const newCourse = await prisma.course.create({
      data: {
        name,
        description: description || null,
        departmentId: parseInt(departmentId),
        formationId: formationId ? parseInt(formationId) : null,
      },
      include: {
        department: true,
        formation: true,
      },
    });

    res.status(201).json({
      status: 'success',
      data: newCourse,
    });
  } catch (error) {
    console.error('Error creating course:', error);
    next(error);
  }
});

// Update course
router.patch('/:id', protect, restrictTo('admin'), async (req, res, next) => {
  try {
    const { name, description, departmentId, formationId } = req.body;
    
    const updatedCourse = await prisma.course.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name,
        description: description || null,
        departmentId: departmentId ? parseInt(departmentId) : undefined,
        formationId: formationId ? parseInt(formationId) : null,
      },
      include: {
        department: true,
        formation: true,
      },
    });

    res.status(200).json({
      status: 'success',
      data: updatedCourse,
    });
  } catch (error) {
    next(error);
  }
});

// Delete course
router.delete('/:id', protect, restrictTo('admin'), async (req, res, next) => {
  try {
    await prisma.course.delete({
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
