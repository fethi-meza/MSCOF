
const { PrismaClient } = require('@prisma/client');
const AppError = require('../utils/errorHandler');
const prisma = new PrismaClient();

exports.getAllStudents = async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        dateOfBirth: true,
        phoneNumber: true,
        enrollmentDate: true,
        status: true
      }
    });

    res.status(200).json({
      status: 'success',
      results: students.length,
      data: students
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Only allow admins or the student themself to access this info
    if (req.role !== 'admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to access this resource'
      });
    }

    const student = await prisma.student.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        dateOfBirth: true,
        phoneNumber: true,
        enrollmentDate: true,
        status: true
      }
    });

    if (!student) {
      return res.status(404).json({
        status: 'fail',
        message: 'Student not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: student
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Only allow admins or the student themself to update
    if (req.role !== 'admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to update this resource'
      });
    }

    const {
      firstName,
      lastName,
      email,
      dateOfBirth,
      phoneNumber,
      status
    } = req.body;

    const updatedStudent = await prisma.student.update({
      where: { id: parseInt(id) },
      data: {
        firstName,
        lastName,
        email,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        phoneNumber,
        status
      }
    });

    res.status(200).json({
      status: 'success',
      data: {
        id: updatedStudent.id,
        firstName: updatedStudent.firstName,
        lastName: updatedStudent.lastName,
        email: updatedStudent.email,
        dateOfBirth: updatedStudent.dateOfBirth,
        phoneNumber: updatedStudent.phoneNumber,
        enrollmentDate: updatedStudent.enrollmentDate,
        status: updatedStudent.status
      }
    });
  } catch (error) {
    console.error(error);
    
    // Handle duplicate email error
    if (error.code === 'P2002') {
      return res.status(400).json({
        status: 'fail',
        message: 'Email already in use'
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if student exists
    const student = await prisma.student.findUnique({
      where: { id: parseInt(id) }
    });

    if (!student) {
      return res.status(404).json({
        status: 'fail',
        message: 'Student not found'
      });
    }

    // Delete student
    await prisma.student.delete({
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

exports.getStudentFormations = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Only allow admins or the student themself to access this info
    if (req.role !== 'admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to access this resource'
      });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: parseInt(id) },
      include: {
        formation: {
          include: {
            instructor: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              }
            }
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

exports.getStudentGrades = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Only allow admins or the student themself to access this info
    if (req.role !== 'admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to access this resource'
      });
    }

    const grades = await prisma.grade.findMany({
      where: { studentId: parseInt(id) },
      include: {
        course: true
      }
    });

    res.status(200).json({
      status: 'success',
      results: grades.length,
      data: grades
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

exports.getStudentAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Only allow admins or the student themself to access this info
    if (req.role !== 'admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to access this resource'
      });
    }

    const attendance = await prisma.attendance.findMany({
      where: { studentId: parseInt(id) }
    });

    res.status(200).json({
      status: 'success',
      results: attendance.length,
      data: attendance
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};
