const express = require('express');
const { createAlternativeTherapiesModelRecord, listAllThrapies, getAlternativeTherapiesModelRecordById, UpdateAlternativeTherapiesModelRecordById, ApproveConsultantBid, UpdateTherapy } = require('../Controllers/AlternativeTherapiesController');
const { getReport } = require('../Controllers/CustomUploadModals');
const checkRolesPermissions = require('../Middlewares/PermissionRolesMiddleware');

const multer = require('multer');
const app = express();

const upload = multer();

const router = express.Router();

router.post('/create/:therapy', createAlternativeTherapiesModelRecord)
router.get('/list/', listAllThrapies)
router.get('/getForm/:id', getAlternativeTherapiesModelRecordById)
router.patch('/approve/:id', UpdateAlternativeTherapiesModelRecordById)
router.patch('/approve_consultant/:id', ApproveConsultantBid)
router.post('/update_therapy/:therapy_id', checkRolesPermissions ,UpdateTherapy)
router.get('/download/:id', getReport)


module.exports = router