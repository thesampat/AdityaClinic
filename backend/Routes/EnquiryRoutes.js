const express = require('express');

const { createEnquiry, getAllEnquiry, getEnquiryById, updateEnquiryById, deleteEnquiryById } = require("../Controllers/EnquiryController");
const { protectSuperAdminAndReceptionist } = require("../Middlewares/commonMiddleware")

const router = express.Router();

router.route('/').post(createEnquiry);
router.route('/').get(getAllEnquiry);
router.route('/:id').get(getEnquiryById);
router.route('/:id').put(updateEnquiryById);
router.route('/:id').delete(deleteEnquiryById);

module.exports = router