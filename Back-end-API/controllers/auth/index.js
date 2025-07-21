
const studentController = require('./student.controller');
const instructorController = require('./instructor.controller');
const adminController = require('./admin.controller');
const loginController = require('./login.controller');
const testAccountsController = require('./test-accounts.controller');

module.exports = {
  registerStudent: studentController.registerStudent,
  registerInstructor: instructorController.registerInstructor,
  registerAdmin: adminController.registerAdmin,
  login: loginController.login,
  seedTestAccounts: testAccountsController.seedTestAccounts
};
