
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { generateToken } = require('../../utils/jwt');
const prisma = new PrismaClient();

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Try to find the user in each role table
    let user = null;
    let role = null;

    // Check student table first
    user = await prisma.student.findUnique({
      where: { email }
    });
    if (user) role = 'student';
    
    // If not found, check instructor table
    if (!user) {
      user = await prisma.instructor.findUnique({
        where: { email }
      });
      if (user) role = 'instructor';
    }
    
    // If not found, check admin table
    if (!user) {
      user = await prisma.admin.findUnique({
        where: { email }
      });
      if (user) role = 'admin';
    }

    // If user not found in any table
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
