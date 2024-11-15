const router = express.Router();
const { createGlobelAdmin } = require('./../component/Admin-Globel/Admin-Globel.controller');



//GlobelAdmin
router.post('/createAdmin', createGlobelAdmin);











module.exports = router;
