const express = require('express');
const { createAppointment, getAppointment, updateStatusAppointment, getFilteredAppointment, updateAppointment } = require('../Controllers/AppointmentController');
const { getAppointment_External } = require('../Controllers/Public/ExternalAppointmentController');
const checkRolesPermissions = require('../Middlewares/PermissionRolesMiddleware');


const router = express.Router();

router.route("/").post(createAppointment);
router.route("/").get(checkRolesPermissions, getAppointment);
router.route("/getFiltered").post(checkRolesPermissions, getFilteredAppointment);
router.route("/:appointmentId").put(updateStatusAppointment);
router.route('/reSchedule/:appointmentId').put(updateAppointment)


router.route("/external").get(getAppointment_External)

module.exports = router