const express = require('express');
const { MainDoctorRegister, MainDoctorLogin } = require("../Controllers/MainDoctorControllers");


const router = express.Router();

router.route('/').post(MainDoctorRegister);
router.route('/login').post(MainDoctorLogin);


module.exports = router