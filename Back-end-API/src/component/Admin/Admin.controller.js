
const prisma = require('../prismaClient');

// Get all admins
exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await prisma.admin.findMany();
        res.json(admins);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get admin by ID
exports.getAdminById = async (req, res) => {
    try {
        const admin = await prisma.admin.findUnique({ where: { id: parseInt(req.params.id) } });
        if (!admin) return res.status(404).json({ message: 'Admin not found' });
        res.json(admin);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create new admin
exports.createAdmin = async (req, res) => {
    try {
        const { firstName, lastName, email, phoneNumber, departmentId } = req.body;
        const newAdmin = await prisma.admin.create({
            data: { firstName, lastName, email, phoneNumber, departmentId }
        });
        res.status(201).json(newAdmin);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update admin
exports.updateAdmin = async (req, res) => {
    try {
        const { firstName, lastName, email, phoneNumber, departmentId } = req.body;
        const updatedAdmin = await prisma.admin.update({
            where: { id: parseInt(req.params.id) },
            data: { firstName, lastName, email, phoneNumber, departmentId }
        });
        res.json(updatedAdmin);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete admin
exports.deleteAdmin = async (req, res) => {
    try {
        await prisma.admin.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ message: 'Admin deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
