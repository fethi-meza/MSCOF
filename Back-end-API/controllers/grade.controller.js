
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllGrades = async (req, res, next) => {
  try {
    const grades = await prisma.grade.findMany({
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        course: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    
    res.status(200).json({
      status: 'success',
      results: grades.length,
      data: grades,
    });
  } catch (error) {
    next(error);
  }
};

exports.getGradeById = async (req, res, next) => {
  try {
    const grade = await prisma.grade.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        course: {
          select: {
            id: true,
            name: true
          }
        }
      },
    });

    if (!grade) {
      return res.status(404).json({
        status: 'fail',
        message: 'Grade not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: grade,
    });
  } catch (error) {
    next(error);
  }
};

exports.createGrade = async (req, res, next) => {
  try {
    const { value, studentId, courseId } = req.body;
    
    // Verify student and course exist
    const student = await prisma.student.findUnique({
      where: { id: studentId }
    });

    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!student) {
      return res.status(404).json({
        status: 'fail',
        message: 'Student not found',
      });
    }

    if (!course) {
      return res.status(404).json({
        status: 'fail',
        message: 'Course not found',
      });
    }

    const newGrade = await prisma.grade.create({
      data: {
        value,
        studentId,
        courseId,
        date: new Date()
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        course: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.status(201).json({
      status: 'success',
      data: newGrade,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateGrade = async (req, res, next) => {
  try {
    const { value } = req.body;
    
    const updatedGrade = await prisma.grade.update({
      where: { id: parseInt(req.params.id) },
      data: { value },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        course: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.status(200).json({
      status: 'success',
      data: updatedGrade,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteGrade = async (req, res, next) => {
  try {
    await prisma.grade.delete({
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
