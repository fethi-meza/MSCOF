
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { generateToken } = require('../utils/jwt');
const prisma = new PrismaClient();

exports.registerStudent = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      dateOfBirth,
      phoneNumber
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
        status: 'ACTIVE'
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
        role: 'student'
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
      departmentId
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
        departmentId
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
        role: 'instructor'
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

exports.registerAdmin = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      departmentId
    } = req.body;

    // Check if admin exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email }
    });

    if (existingAdmin) {
      return res.status(400).json({
        status: 'fail',
        message: 'Admin already exists with this email'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin
    const admin = await prisma.admin.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phoneNumber,
        departmentId
      }
    });

    // Generate token
    const token = generateToken(admin.id, 'admin');

    res.status(201).json({
      status: 'success',
      token,
      data: {
        id: admin.id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        role: 'admin'
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

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    let user;
    
    // Find user based on role
    if (role === 'student') {
      user = await prisma.student.findUnique({
        where: { email }
      });
    } else if (role === 'instructor') {
      user = await prisma.instructor.findUnique({
        where: { email }
      });
    } else if (role === 'admin') {
      user = await prisma.admin.findUnique({
        where: { email }
      });
    }

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user.id, role);

    res.status(200).json({
      status: 'success',
      token,
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role
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
