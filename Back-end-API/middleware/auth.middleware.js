
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.protect = async (req, res, next) => {
  try {
    // Get token from header
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in. Please log in to get access.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    let currentUser;
    if (decoded.role === 'student') {
      currentUser = await prisma.student.findUnique({
        where: { id: decoded.id }
      });
    } else if (decoded.role === 'instructor') {
      currentUser = await prisma.instructor.findUnique({
        where: { id: decoded.id }
      });
    } else if (decoded.role === 'admin') {
      currentUser = await prisma.admin.findUnique({
        where: { id: decoded.id }
      });
    }

    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token no longer exists.'
      });
    }

    // Grant access to protected route
    req.user = currentUser;
    req.role = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({
      status: 'fail',
      message: 'Not authorized to access this route'
    });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};
