const express = require('express')
const { adminRegister, adminLogin } = require('../Controllers/AdminController')
const router = express.Router();

router.route('/').post(adminRegister);
router.route('/login').post(adminLogin);


module.exports = router