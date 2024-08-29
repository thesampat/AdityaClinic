const express = require('express');
const { receptionistRegisterBySuperAdmin, receptionistLogin, updateReceptionistProfile, deleteReceptionistById, getAllReceptionist, getSingleReceptionist } = require("../Controllers/ReceptionistControllers");
const { protectSuperAdmin } = require('../Middlewares/requireLoginSuperAdmin');
const { UploadReport, deleteReport, getReport, getImage, deleteImages, UploadMultipleDocs } = require('../Controllers/CustomUploadModals');
const checkRolesPermissions = require('../Middlewares/PermissionRolesMiddleware');


const router = express.Router()

router.route("/").post(checkRolesPermissions, receptionistRegisterBySuperAdmin);
router.route("/").get(checkRolesPermissions, getAllReceptionist)
router.route("/:id").get(checkRolesPermissions, getSingleReceptionist)
router.route("/login").post(receptionistLogin);
router.route("/profile/:receptionistId").put(checkRolesPermissions, updateReceptionistProfile);
router.route("/:id").delete(checkRolesPermissions, deleteReceptionistById)

router.route('/upload/:itemId/:uploadType').post(checkRolesPermissions, UploadReport)
router.route('/upload_files/:itemId/:uploadType').post(checkRolesPermissions, UploadMultipleDocs)
router.route('/remove/:id/:itemId/:uploadType').delete(checkRolesPermissions, deleteReport)
router.route('/get/:id').get(getReport)
router.route('/get/image/:id').get(getImage)
router.route('/delete/image/:itemId/:uploadType').delete(checkRolesPermissions, deleteImages)

module.exports = router