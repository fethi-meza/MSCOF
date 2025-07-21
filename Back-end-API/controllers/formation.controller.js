
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllFormations = async (req, res) => {
  try {
    const formations = await prisma.formation.findMany({
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            specialization: true
          }
        },
        schedules: true,
        _count: {
          select: { enrollments: true }
        }
      }
    });

    // Calculate remaining spots
    const formationsWithRemainingSpots = formations.map(formation => ({
      ...formation,
      remainingSpots: formation.availableSpots - formation._count.enrollments
    }));

    res.status(200).json({
      status: 'success',
      results: formations.length,
      data: formationsWithRemainingSpots
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

exports.getFormationById = async (req, res) => {
  try {
    const { id } = req.params;

    const formation = await prisma.formation.findUnique({
      where: { id: parseInt(id) },
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            specialization: true
          }
        },
        schedules: true,
        calendar: {
          include: {
            events: true
          }
        },
        _count: {
          select: { enrollments: true }
        }
      }
    });

    if (!formation) {
      return res.status(404).json({
        status: 'fail',
        message: 'Formation not found'
      });
    }

    // Calculate remaining spots
    const formationWithRemainingSpots = {
      ...formation,
      remainingSpots: formation.availableSpots - formation._count.enrollments
    };

    res.status(200).json({
      status: 'success',
      data: formationWithRemainingSpots
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

exports.createFormation = async (req, res) => {
  try {
    const {
      name,
      description,
      image,
      availableSpots,
      durationInHours,
      startDate,
      endDate,
      instructorId
    } = req.body;

    // Create formation
    const formation = await prisma.formation.create({
      data: {
        name,
        description,
        image,
        availableSpots,
        durationInHours,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        instructorId
      }
    });

    res.status(201).json({
      status: 'success',
      data: formation
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

exports.updateFormation = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      image,
      availableSpots,
      durationInHours,
      startDate,
      endDate,
      instructorId
    } = req.body;

    // Check if formation exists
    const formation = await prisma.formation.findUnique({
      where: { id: parseInt(id) }
    });

    if (!formation) {
      return res.status(404).json({
        status: 'fail',
        message: 'Formation not found'
      });
    }

    // Update formation
    const updatedFormation = await prisma.formation.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        image,
        availableSpots,
        durationInHours,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        instructorId
      }
    });

    res.status(200).json({
      status: 'success',
      data: updatedFormation
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

exports.deleteFormation = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if formation exists
    const formation = await prisma.formation.findUnique({
      where: { id: parseInt(id) }
    });

    if (!formation) {
      return res.status(404).json({
        status: 'fail',
        message: 'Formation not found'
      });
    }

    // Delete formation
    await prisma.formation.delete({
      where: { id: parseInt(id) }
    });

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

exports.getFormationSchedules = async (req, res) => {
  try {
    const { id } = req.params;

    const schedules = await prisma.schedule.findMany({
      where: { formationId: parseInt(id) }
    });

    res.status(200).json({
      status: 'success',
      results: schedules.length,
      data: schedules
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

exports.getFormationEnrollments = async (req, res) => {
  try {
    const { id } = req.params;

    const enrollments = await prisma.enrollment.findMany({
      where: { formationId: parseInt(id) },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    res.status(200).json({
      status: 'success',
      results: enrollments.length,
      data: enrollments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

exports.enrollStudent = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Only students can enroll themselves
    if (req.role !== 'student') {
      return res.status(403).json({
        status: 'fail',
        message: 'Only students can enroll in formations'
      });
    }

    // Check if formation exists
    const formation = await prisma.formation.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: { enrollments: true }
        }
      }
    });

    if (!formation) {
      return res.status(404).json({
        status: 'fail',
        message: 'Formation not found'
      });
    }

    // Check if there are available spots
    if (formation._count.enrollments >= formation.availableSpots) {
      return res.status(400).json({
        status: 'fail',
        message: 'No available spots in this formation'
      });
    }

    // Check if student is already enrolled
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        studentId: req.user.id,
        formationId: parseInt(id)
      }
    });

    if (existingEnrollment) {
      return res.status(400).json({
        status: 'fail',
        message: 'You are already enrolled in this formation'
      });
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: req.user.id,
        formationId: parseInt(id),
        enrollmentDate: new Date(),
        status: 'ACTIVE'
      }
    });

    res.status(201).json({
      status: 'success',
      data: enrollment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};
