
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { validate } = require('../middleware/validate.middleware');
const { protect, restrictTo } = require('../middleware/auth.middleware');

const prisma = new PrismaClient();

// Get all departments
router.get('/', async (req, res, next) => {
  try {
    const departments = await prisma.department.findMany();
    
    res.status(200).json({
      status: 'success',
      results: departments.length,
      data: departments,
    });
  } catch (error) {
    next(error);
  }
});

// Get department by ID
router.get('/:id', async (req, res, next) => {
  try {
    const department = await prisma.department.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        courses: true,
        instructors: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            specialization: true,
          },
        },
        admins: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!department) {
      return res.status(404).json({
        status: 'fail',
        message: 'Department not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: department,
    });
  } catch (error) {
    next(error);
  }
});

// Create a new department
router.post('/', protect, restrictTo('admin'), async (req, res, next) => {
  try {
    const { name, description } = req.body;
    
    const newDepartment = await prisma.department.create({
      data: {
        name,
        description,
      },
    });

    res.status(201).json({
      status: 'success',
      data: newDepartment,
    });
  } catch (error) {
    next(error);
  }
});

// Update department
router.patch('/:id', protect, restrictTo('admin'), async (req, res, next) => {
  try {
    const updatedDepartment = await prisma.department.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });

    res.status(200).json({
      status: 'success',
      data: updatedDepartment,
    });
  } catch (error) {
    next(error);
  }
});

// Delete department
router.delete('/:id', protect, restrictTo('admin'), async (req, res, next) => {
  try {
    await prisma.department.delete({
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
