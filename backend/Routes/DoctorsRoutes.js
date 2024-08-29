const express = require('express');
const { getSingleDoctor, doctorRegisterBySuperAdmin, doctorLogin, updateDoctorProfile, deleteDoctorById, getAllDoctor } = require("../Controllers/DoctorsControllers")
const { getAllDoctor_External } = require('../Controllers/Public/ExternalDoctorController');
const { UploadReport, deleteReport, getReport, getImage, deleteImages, UploadMultipleDocs } = require('../Controllers/CustomUploadModals');
const checkRolesPermissions = require('../Middlewares/PermissionRolesMiddleware');


const router = express.Router();

router.route('/login').post(doctorLogin)
router.route("/profile/:doctorId").put(checkRolesPermissions, updateDoctorProfile)
router.route("/:id").delete(checkRolesPermissions, deleteDoctorById)
router.route("/:id").get(checkRolesPermissions, getSingleDoctor)
router.route('/').get(checkRolesPermissions, getAllDoctor);
router.route('/').post(checkRolesPermissions, doctorRegisterBySuperAdmin)

router.route('/external/doctor').get(getAllDoctor_External)

router.route('/upload/:itemId/:uploadType').post(checkRolesPermissions, UploadReport)
router.route('/upload_files/:itemId/:uploadType').post(checkRolesPermissions, UploadMultipleDocs)
router.route('/remove/:id/:itemId/:uploadType').delete(checkRolesPermissions, deleteReport)
router.route('/get/:id').get(getReport)
router.route('/get/image/:id').get(getImage)
router.route('/delete/image/:itemId/:uploadType').delete(checkRolesPermissions, deleteImages)


module.exports = router