
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Get all enrollments
const getAllEnrollments = async (req, res, next) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        formation: {
          select: {
            id: true,
            name: true,
            startDate: true,
            endDate: true,
          },
        },
      },
    });
    
    res.status(200).json({
      status: 'success',
      results: enrollments.length,
      data: enrollments,
    });
  } catch (error) {
    next(error);
  }
};

// Get enrollments for a student
const getStudentEnrollments = async (req, res, next) => {
  try {
    // Students can only view their own enrollments
    if (req.role === 'student' && req.user.id !== parseInt(req.params.studentId)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You can only access your own enrollments',
      });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: parseInt(req.params.studentId) },
      include: {
        formation: {
          select: {
            id: true,
            name: true,
            description: true,
            startDate: true,
            endDate: true,
            durationInHours: true,
            instructor: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
            schedules: true,
          },
        },
      },
      orderBy: {
        enrollmentDate: 'desc',
      },
    });
    
    res.status(200).json({
      status: 'success',
      results: enrollments.length,
      data: enrollments,
    });
  } catch (error) {
    next(error);
  }
};

// Get enrollments for a formation
const getFormationEnrollments = async (req, res, next) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { formationId: parseInt(req.params.formationId) },
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
      orderBy: {
        enrollmentDate: 'desc',
      },
    });
    
    res.status(200).json({
      status: 'success',
      results: enrollments.length,
      data: enrollments,
    });
  } catch (error) {
    next(error);
  }
};

// Create a new enrollment
const createEnrollment = async (req, res, next) => {
  try {
    const { studentId, formationId, status } = req.body;
    
    // Check if the student is already enrolled in this formation
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        studentId: parseInt(studentId),
        formationId: parseInt(formationId),
      },
    });

    if (existingEnrollment) {
      return res.status(400).json({
        status: 'fail',
        message: 'Student is already enrolled in this formation',
      });
    }

    // Check if there are available spots in the formation
    const formation = await prisma.formation.findUnique({
      where: { id: parseInt(formationId) },
      include: {
        _count: {
          select: { enrollments: true },
        },
      },
    });

    if (!formation) {
      return res.status(404).json({
        status: 'fail',
        message: 'Formation not found',
      });
    }

    if (formation._count.enrollments >= formation.availableSpots) {
      return res.status(400).json({
        status: 'fail',
        message: 'No available spots in this formation',
      });
    }

    const newEnrollment = await prisma.enrollment.create({
      data: {
        studentId: parseInt(studentId),
        formationId: parseInt(formationId),
        enrollmentDate: new Date(),
        status: status || 'ACTIVE',
      },
      include: {
        student: true,
        formation: true,
      },
    });

    res.status(201).json({
      status: 'success',
      data: newEnrollment,
    });
  } catch (error) {
    next(error);
  }
};

// Update enrollment
const updateEnrollment = async (req, res, next) => {
  try {
    const updatedEnrollment = await prisma.enrollment.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
      include: {
        student: true,
        formation: true,
      },
    });

    res.status(200).json({
      status: 'success',
      data: updatedEnrollment,
    });
  } catch (error) {
    next(error);
  }
};

// Delete enrollment
const deleteEnrollment = async (req, res, next) => {
  try {
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!enrollment) {
      return res.status(404).json({
        status: 'fail',
        message: 'Enrollment not found',
      });
    }

    // Students can only delete their own enrollments, admins can delete any
    if (req.role === 'student' && enrollment.studentId !== req.user.id) {
      return res.status(403).json({
        status: 'fail',
        message: 'You can only delete your own enrollments',
      });
    }

    await prisma.enrollment.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllEnrollments,
  getStudentEnrollments,
  getFormationEnrollments,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
};
