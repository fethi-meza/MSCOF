// controllers/student.controller.js
const e = require('express');
const prisma = require('../prisma/prismaClient');

// Create a new student ony admin can do this
exports.createStudent = async (req, res) => {
    try {
        const { firstName, lastName, dateOfBirth, email, phoneNumber, enrollmentDate, status } = req.body;
        const newStudent = await prisma.student.create({
            data: { firstName, lastName, dateOfBirth, email, phoneNumber, enrollmentDate, status }
        });
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create student', details: error.message });
    }
};

// Get all students only admin can do this
exports.getAllStudents = async (req, res) => {
    try {
        const students = await prisma.student.findMany();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch students', details: error.message });
    }
};

// Get a single student by ID only admin can do this
exports.getStudentById = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await prisma.student.findUnique({ where: { id: Number(id) } });
        if (!student) return res.status(404).json({ error: 'Student not found' });
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch student', details: error.message });
    }
};

// Update a student only admin can do this
exports.updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, dateOfBirth, email, phoneNumber, enrollmentDate, status } = req.body;
        const updatedStudent = await prisma.student.update({
            where: { id: Number(id) },
            data: { firstName, lastName, dateOfBirth, email, phoneNumber, enrollmentDate, status }
        });
        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update student', details: error.message });
    }
};

// Delete a student only admin can do this
exports.deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.student.delete({ where: { id: Number(id) } });
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete student', details: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const student = await prisma.student.findUnique({ where: { id: req.user.id } });
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch student', details: error.message });
    }
}
//login student only student can do this
 exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const student = await prisma.student.findUnique({ where: { email } });
        if (!student) return res.status(404).json({ error: 'Invalid credentials' });
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ error: 'Failed to login', details: error.message });
    }
}