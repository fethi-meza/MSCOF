// routes/student.routes.js
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');

router.post('/', studentController.createStudent);
router.post('/login', studentController.loginStudent);
router.get('/', studentController.getAllStudents);
router.get('/:id', studentController.getStudentById);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

module.exports = router;
