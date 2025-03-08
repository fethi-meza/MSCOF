// controllers/trainingRequest.controller.js
const prisma = require('../prisma/prismaClient');

// Create a new training request
exports.createTrainingRequest = async (req, res) => {
    try {
        const { studentId, trainingName, status, requestDate } = req.body;
        const newTrainingRequest = await prisma.trainingRequest.create({
            data: { studentId, trainingName, status, requestDate }
        });
        res.status(201).json(newTrainingRequest);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create training request', details: error.message });
    }
};

// Get all training requests
exports.getAllTrainingRequests = async (req, res) => {
    try {
        const trainingRequests = await prisma.trainingRequest.findMany();
        res.status(200).json(trainingRequests);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch training requests', details: error.message });
    }
};

// Get a single training request by ID
exports.getTrainingRequestById = async (req, res) => {
    try {
        const { id } = req.params;
        const trainingRequest = await prisma.trainingRequest.findUnique({ where: { id: Number(id) } });
        if (!trainingRequest) return res.status(404).json({ error: 'Training request not found' });
        res.status(200).json(trainingRequest);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch training request', details: error.message });
    }
};

// Update a training request
exports.updateTrainingRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { studentId, trainingName, status, requestDate } = req.body;
        const updatedTrainingRequest = await prisma.trainingRequest.update({
            where: { id: Number(id) },
            data: { studentId, trainingName, status, requestDate }
        });
        res.status(200).json(updatedTrainingRequest);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update training request', details: error.message });
    }
};

// Delete a training request
exports.deleteTrainingRequest = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.trainingRequest.delete({ where: { id: Number(id) } });
        res.status(200).json({ message: 'Training request deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete training request', details: error.message });
    }
};
