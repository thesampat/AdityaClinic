const jwt = require('jsonwebtoken');
const { getFilteredAppointment } = require('../Controllers/AppointmentController');

const express = require('express');
const multer = require('multer');
const app = express();

const upload = multer();

app.use(upload.any());

const verifyToken = (req, res) => {
    const { authorization } = req.headers;
    if (authorization) {
        const token = authorization.replace("Bearer ", "")
        let payload = jwt.verify(token, "clinic7865", (err, payload) => {
            if (err) {
                return res.status(401).json({ error: "you must be logged in" })
            }
            return payload
        })

        return payload
    }
}

const checkRolesPermissions = (req, res, next) => {
    let access = verifyToken(req, res)
    const { role, id } = access
    const { originalUrl } = req
    let query = {}
    let restriction = {}


    switch (originalUrl?.split('/')?.[1]) {

        case 'appointment':
            if (['Consultant', 'Doctor', 'AssistantDoctor'].includes(role) === true) {
                query['doctor.id'] = id
            }
        case 'alternative_therapy':
            if(Object.keys(req.body).includes('status') && role !== 'MainDoctor'){
                res.status(305).send('Not Allowed')
            }
    }

    switch (originalUrl?.split('?')?.[0]) {
        case `/prescription`:
            if (['Consultant', 'Doctor'].includes(role) === true) {
                query['doctor'] = id
            }
            if (['AssistantDoctor'].includes(role) === true) {
                restriction['MedicinePrescription'] = 0
                restriction['SupplimentoryMedicine'] = 0
            }
    }

    req.accessFilter = query
    req.secondaryAccessFilter = restriction
    req.userAbility = access
    req.role = role
    next()

};

module.exports = checkRolesPermissions;
