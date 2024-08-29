const express = require('express');
const { assistantDoctorRegisterBySuperAdmin, getAllAssistantDoctor, AssistantDoctorLogin, deleteAssistantDoctorById, getSingleAssistantDoctor, updateAssistantDoctor } = require("../Controllers/AssistantDoctorController")
const { getAllDoctor_External } = require('../Controllers/Public/ExternalDoctorController');
const { UploadReport, deleteReport, getReport, getImage, deleteImages, UploadMultipleDocs } = require('../Controllers/CustomUploadModals');
const checkRolesPermissions = require('../Middlewares/PermissionRolesMiddleware');

const router = express.Router();

router.route('/login').post(AssistantDoctorLogin)
router.route("/profile/:doctorId").put(checkRolesPermissions, updateAssistantDoctor)
router.route("/:id").delete(checkRolesPermissions, deleteAssistantDoctorById)
router.route("/:id").get(checkRolesPermissions, getSingleAssistantDoctor)
router.route('/').get(getAllAssistantDoctor);
router.route('/').post(checkRolesPermissions, assistantDoctorRegisterBySuperAdmin)

router.route('/upload/:itemId/:uploadType').post(checkRolesPermissions, UploadReport)
router.route('/upload_files/:itemId/:uploadType').post(checkRolesPermissions, UploadMultipleDocs)
router.route('/remove/:id/:itemId/:uploadType').delete(checkRolesPermissions, deleteReport)
router.route('/get/:id').get(getReport)
router.route('/get/image/:id').get(getImage)
router.route('/delete/image/:itemId/:uploadType').delete(checkRolesPermissions, deleteImages)


module.exports = router