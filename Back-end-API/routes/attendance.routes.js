
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { validate } = require('../middleware/validate.middleware');
const { protect, restrictTo } = require('../middleware/auth.middleware');

const prisma = new PrismaClient();

// Get attendance records for a student
router.get('/student/:studentId', protect, async (req, res, next) => {
  try {
    // Students should only access their own attendance
    if (req.role === 'student' && req.user.id !== parseInt(req.params.studentId)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You can only access your own attendance records',
      });
    }

    const attendanceRecords = await prisma.attendance.findMany({
      where: { 
        studentId: parseInt(req.params.studentId) 
      },
      orderBy: {
        date: 'desc',
      },
    });
    
    res.status(200).json({
      status: 'success',
      results: attendanceRecords.length,
      data: attendanceRecords,
    });
  } catch (error) {
    next(error);
  }
});

// Create a new attendance record
router.post('/', protect, restrictTo('instructor', 'admin'), async (req, res, next) => {
  try {
    const { studentId, date, status } = req.body;
    
    const newAttendance = await prisma.attendance.create({
      data: {
        studentId: parseInt(studentId),
        date: new Date(date),
        status,
      },
    });

    res.status(201).json({
      status: 'success',
      data: newAttendance,
    });
  } catch (error) {
    next(error);
  }
});

// Update attendance record
router.patch('/:id', protect, restrictTo('instructor', 'admin'), async (req, res, next) => {
  try {
    const updatedAttendance = await prisma.attendance.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });

    res.status(200).json({
      status: 'success',
      data: updatedAttendance,
    });
  } catch (error) {
    next(error);
  }
});

// Delete attendance record
router.delete('/:id', protect, restrictTo('admin'), async (req, res, next) => {
  try {
    await prisma.attendance.delete({
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

// Batch create attendance records
router.post('/batch', protect, restrictTo('instructor', 'admin'), async (req, res, next) => {
  try {
    const { records } = req.body;
    
    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide an array of attendance records',
      });
    }

    const createdRecords = await prisma.$transaction(
      records.map(record => 
        prisma.attendance.create({
          data: {
            studentId: parseInt(record.studentId),
            date: new Date(record.date),
            status: record.status,
          },
        })
      )
    );

    res.status(201).json({
      status: 'success',
      results: createdRecords.length,
      data: createdRecords,
    });
  } catch (error) {
    next(error);
  }
});

// Get attendance statistics for a student
router.get('/stats/student/:studentId', protect, async (req, res, next) => {
  try {
    // Students should only access their own statistics
    if (req.role === 'student' && req.user.id !== parseInt(req.params.studentId)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You can only access your own attendance statistics',
      });
    }

    const totalCount = await prisma.attendance.count({
      where: { studentId: parseInt(req.params.studentId) },
    });
    
    const presentCount = await prisma.attendance.count({
      where: { 
        studentId: parseInt(req.params.studentId),
        status: 'PRESENT',
      },
    });

    const absentCount = await prisma.attendance.count({
      where: { 
        studentId: parseInt(req.params.studentId),
        status: 'ABSENT',
      },
    });

    const excusedCount = await prisma.attendance.count({
      where: { 
        studentId: parseInt(req.params.studentId),
        status: 'EXCUSED',
      },
    });

    res.status(200).json({
      status: 'success',
      data: {
        totalCount,
        presentCount,
        absentCount,
        excusedCount,
        presentPercentage: totalCount > 0 ? (presentCount / totalCount) * 100 : 0,
        absentPercentage: totalCount > 0 ? (absentCount / totalCount) * 100 : 0,
        excusedPercentage: totalCount > 0 ? (excusedCount / totalCount) * 100 : 0,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
