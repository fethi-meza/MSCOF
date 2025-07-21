
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { generateToken } = require('../../utils/jwt');
const prisma = new PrismaClient();

exports.registerInstructor = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      specialization,
      isSpecialist,
      departmentId,
      photo
    } = req.body;

    // Check if instructor exists
    const existingInstructor = await prisma.instructor.findUnique({
      where: { email }
    });

    if (existingInstructor) {
      return res.status(400).json({
        status: 'fail',
        message: 'Instructor already exists with this email'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create instructor
    const instructor = await prisma.instructor.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phoneNumber,
        specialization,
        isSpecialist,
        departmentId,
        photo
      }
    });

    // Generate token
    const token = generateToken(instructor.id, 'instructor');

    res.status(201).json({
      status: 'success',
      token,
      data: {
        id: instructor.id,
        firstName: instructor.firstName,
        lastName: instructor.lastName,
        email: instructor.email,
        role: 'instructor',
        photo: instructor.photo
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
