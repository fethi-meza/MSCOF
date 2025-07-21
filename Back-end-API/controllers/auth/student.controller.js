
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { generateToken } = require('../../utils/jwt');
const prisma = new PrismaClient();

exports.registerStudent = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      dateOfBirth,
      phoneNumber,
      photo
    } = req.body;

    // Check if student exists
    const existingStudent = await prisma.student.findUnique({
      where: { email }
    });

    if (existingStudent) {
      return res.status(400).json({
        status: 'fail',
        message: 'Student already exists with this email'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create student
    const student = await prisma.student.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        dateOfBirth: new Date(dateOfBirth),
        phoneNumber,
        enrollmentDate: new Date(),
        status: 'ACTIVE',
        photo
      }
    });

    // Generate token
    const token = generateToken(student.id, 'student');

    res.status(201).json({
      status: 'success',
      token,
      data: {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        role: 'student',
        photo: student.photo
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};
