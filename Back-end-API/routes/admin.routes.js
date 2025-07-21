
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { validate } = require('../middleware/validate.middleware');
const { protect, restrictTo } = require('../middleware/auth.middleware');

const prisma = new PrismaClient();

// Restrict all admin routes to admin role
router.use(protect, restrictTo('admin'));

// Get all admins
router.get('/', async (req, res, next) => {
  try {
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        departmentId: true,
        department: true,
      },
    });
    
    res.status(200).json({
      status: 'success',
      results: admins.length,
      data: admins,
    });
  } catch (error) {
    next(error);
  }
});

// Get admin by ID
router.get('/:id', async (req, res, next) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        department: true,
      },
    });

    if (!admin) {
      return res.status(404).json({
        status: 'fail',
        message: 'Admin not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: admin,
    });
  } catch (error) {
    next(error);
  }
});

// Update admin
router.patch('/:id', async (req, res, next) => {
  try {
    // Prevent updating email or password via this route
    const { email, password, ...updateData } = req.body;

    const updatedAdmin = await prisma.admin.update({
      where: { id: parseInt(req.params.id) },
      data: updateData,
      include: {
        department: true,
      },
    });

    res.status(200).json({
      status: 'success',
      data: updatedAdmin,
    });
  } catch (error) {
    next(error);
  }
});

// Dashboard stats
router.get('/stats/dashboard', async (req, res, next) => {
  try {
    const studentsCount = await prisma.student.count();
    const instructorsCount = await prisma.instructor.count();
    const departmentsCount = await prisma.department.count();
    const formationsCount = await prisma.formation.count();
    
    const activeFormations = await prisma.formation.count({
      where: {
        startDate: { lte: new Date() },
        endDate: { gte: new Date() },
      },
    });

    res.status(200).json({
      status: 'success',
      data: {
        studentsCount,
        instructorsCount,
        departmentsCount,
        formationsCount,
        activeFormations,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
