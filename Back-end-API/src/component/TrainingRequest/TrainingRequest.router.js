// routes/trainingRequest.routes.js
const express = require('express');
const router = express.Router();
const trainingRequestController = require('../controllers/trainingRequest.controller');

router.post('/', trainingRequestController.createTrainingRequest);
router.get('/', trainingRequestController.getAllTrainingRequests);
router.get('/:id', trainingRequestController.getTrainingRequestById);
router.put('/:id', trainingRequestController.updateTrainingRequest);
router.delete('/:id', trainingRequestController.deleteTrainingRequest);

module.exports = router;
