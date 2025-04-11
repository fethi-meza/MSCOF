// controllers/schedule.controller.js
const prisma = require('../prisma/prismaClient');

// Create a new schedule
exports.createSchedule = async (req, res) => {
    try {
        const { studentId, courseName, startTime, endTime, day } = req.body;
        const newSchedule = await prisma.schedule.create({
            data: { studentId, courseName, startTime, endTime, day }
        });
        res.status(201).json(newSchedule);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create schedule', details: error.message });
    }
};

// Get all schedules
exports.getAllSchedules = async (req, res) => {
    try {
        const schedules = await prisma.schedule.findMany();
        res.status(200).json(schedules);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch schedules', details: error.message });
    }
};

// Get a single schedule by ID
exports.getScheduleById = async (req, res) => {
    try {
        const { id } = req.params;
        const schedule = await prisma.schedule.findUnique({ where: { id: Number(id) } });
        if (!schedule) return res.status(404).json({ error: 'Schedule not found' });
        res.status(200).json(schedule);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch schedule', details: error.message });
    }
};

// Update a schedule
exports.updateSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const { studentId, courseName, startTime, endTime, day } = req.body;
        const updatedSchedule = await prisma.schedule.update({
            where: { id: Number(id) },
            data: { studentId, courseName, startTime, endTime, day }
        });
        res.status(200).json(updatedSchedule);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update schedule', details: error.message });
    }
};

// Delete a schedule
exports.deleteSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.schedule.delete({ where: { id: Number(id) } });
        res.status(200).json({ message: 'Schedule deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete schedule', details: error.message });
    }
};
