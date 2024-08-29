const express = require('express');
const { createPrescription, getPrescriptionDetails, getAllPrescriptions, deletePrescriptionById, getFeesCollectedData, getFilteredPrescription, getPrescriptionStatusData } = require("../Controllers/PrescriptionController");
const { UploadReport, deleteReport, getReport, getImage, deleteImages, getDownload } = require('../Controllers/PrescriptionUploads');
const checkRolesPermissions = require('../Middlewares/PermissionRolesMiddleware');


const router = express.Router();

router.route('/').post(createPrescription);
router.route('/').get(getAllPrescriptions);
router.route('/getFiltered').get(getFilteredPrescription)
router.route('/getDurationData').get(getPrescriptionStatusData)
router.route('/getFeesData').get(getFeesCollectedData)
router.route('/delete/:prescriptionId').delete(checkRolesPermissions, deletePrescriptionById);


router.route('/upload/:prescriptionId/:uploadType').post(UploadReport)
router.route('/remove/:id/:presid/:uploadType').delete(deleteReport)
router.route('/get/:id').get(getReport)
router.route('/download/:id').get(getDownload)
router.route('/get/image/:id').get(getImage)
router.route('/delete/image/:presid/:uploadType').delete(deleteImages)

// router.route('/patients/:mobileNumber').get(getPrescriptionDetails);

module.exports = router