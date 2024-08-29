const express = require('express');
const { consultantRegisterBySuperAdmin, consultantLogin, updateConsultantProfile, deleteConsultantById, getAllConsultant, getSingleConsultant } = require('../Controllers/ConsultantControllers');
const { UploadReport, deleteReport, getReport, getImage, deleteImages, UploadMultipleDocs } = require('../Controllers/CustomUploadModals');
const checkRolesPermissions = require('../Middlewares/PermissionRolesMiddleware');
const router = express.Router();

router.route("/").post(checkRolesPermissions, consultantRegisterBySuperAdmin);
router.route("/").get(getAllConsultant);
router.route("/:id").get(checkRolesPermissions, getSingleConsultant);
router.route("/login").post(consultantLogin);
router.route("/profile/:consultantId").put(checkRolesPermissions, updateConsultantProfile)
router.route("/:id").delete(checkRolesPermissions, deleteConsultantById)



router.route('/upload/:itemId/:uploadType').post(checkRolesPermissions, UploadReport)
router.route('/upload_files/:itemId/:uploadType').post(checkRolesPermissions, UploadMultipleDocs)
router.route('/remove/:id/:itemId/:uploadType').delete(checkRolesPermissions, deleteReport)
router.route('/get/:id').get(getReport)
router.route('/get/image/:id').get(getImage)
router.route('/delete/image/:itemId/:uploadType').delete(checkRolesPermissions, deleteImages)

module.exports = router