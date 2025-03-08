const prisma = require('../prismaClient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET ;

// Register a new admin
exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, phoneNumber, password, departmentId } = req.body;

        // Check if user already exists
        const existingAdmin = await prisma.admin.findUnique({ where: { email } });
        if (existingAdmin) return res.status(400).json({ message: 'Admin already exists' });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create admin
        const newAdmin = await prisma.admin.create({
            data: { firstName, lastName, email, phoneNumber, password: hashedPassword, departmentId }
        });

        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login admin
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find admin by email
        const admin = await prisma.admin.findUnique({ where: { email } });
        if (!admin) return res.status(400).json({ message: 'Invalid email or password' });

        // Check password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

        // Generate JWT token
        const token = jwt.sign({ id: admin.id, email: admin.email }, SECRET_KEY, { expiresIn: '1h' });

        res.json({ token, admin });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get admin profile (protected route)
exports.getProfile = async (req, res) => {
    try {
        const admin = await prisma.admin.findUnique({ where: { id: req.user.id }, select: { id: true, firstName: true, lastName: true, email: true, phoneNumber: true } });
        res.json(admin);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
