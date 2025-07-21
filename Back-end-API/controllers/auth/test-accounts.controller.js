
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.seedTestAccounts = async (req, res) => {
  try {
    // Check if test accounts already exist
    const testStudent = await prisma.student.findUnique({
      where: { email: 'student@test.com' }
    });
    
    const testAdmin = await prisma.admin.findUnique({
      where: { email: 'admin@test.com' }
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    let createdStudent = null;
    let createdAdmin = null;

    // Create test student if not exists
    if (!testStudent) {
      createdStudent = await prisma.student.create({
        data: {
          firstName: 'Test',
          lastName: 'Student',
          email: 'student@test.com',
          password: hashedPassword,
          dateOfBirth: new Date('2000-01-01'),
          enrollmentDate: new Date(),
          status: 'ACTIVE'
        }
      });
    }

    // Create test admin if not exists
    if (!testAdmin) {
      createdAdmin = await prisma.admin.create({
        data: {
          firstName: 'Test',
          lastName: 'Admin',
          email: 'admin@test.com',
          password: hashedPassword
        }
      });
    }

    res.status(201).json({
      status: 'success',
      message: 'Test accounts created successfully',
      data: {
        student: testStudent ? 'Already exists' : {
          email: 'student@test.com',
          password: 'password123'
        },
        admin: testAdmin ? 'Already exists' : {
          email: 'admin@test.com',
          password: 'password123'
        }
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
