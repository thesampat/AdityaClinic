const jwt = require('jsonwebtoken');
const { SuperAdmin } = require("../Models/MainDoctorModel")

const protectSuperAdmin = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ error: "you must be logged in through super admin!" })
    }
    const token = authorization.replace("Bearer ", "")
    jwt.verify(token, "clinic7865", (err, payload) => {
        if (err) {
            return res.status(401).json({ error: "you must be logged in through super admin!" })
        }
        const { superAdminId } = payload
        SuperAdmin.findById(superAdminId).then(superadmindata => {
            req.superadmin = superadmindata
            next()
        })
    })
}

module.exports = { protectSuperAdmin }