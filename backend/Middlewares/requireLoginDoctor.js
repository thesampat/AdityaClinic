const jwt = require('jsonwebtoken');
const { Doctor } = require("../Models/DoctorsModel");

const protectDoctor = (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) {
        return res.status(401).json({ error: "you must be logged in!" })
    }
    const token = authorization.replace("Bearer ", "")
    jwt.verify(token, "clinic7865", (err, payload) => {
        if (err) {
            return res.status(401).json({ error: "you must be logged in", err })
        }

        const { doctorId } = payload
        Doctor.findById(doctorId).then(doctordata => {
            req.doctor = doctordata
            next()
        })
    })
}

module.exports = { protectDoctor }