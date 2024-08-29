const jwt = require('jsonwebtoken');
const { SuperAdmin } = require('../Models/MainDoctorModel');
const { Receptionist } = require('../Models/ReceptionistModel');

// Middleware to protect routes for super admins and receptionists
const protectSuperAdminAndReceptionist = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: 'You must be logged in!' });
  }

  const token = authorization.replace('Bearer ', '');

  jwt.verify(token, 'clinic7865', (err, payload) => {
    if (err) {
      return res.status(401).json({ error: 'You must be logged in!' });
    }

    const { superAdminId, receptionistId } = payload;
    console.log(superAdminId)
    // Check if the user is a super admin
    SuperAdmin.findById(superAdminId).then((superAdminData) => {
      if (superAdminData) {
        console.log(superAdminData)
        req.user = superAdminData;
        next(); // Allow access for super admin
      } else {
        // If not a super admin, check if the user is a receptionist
        Receptionist.findById(receptionistId).then((receptionistData) => {
          if (receptionistData) {
            req.user = receptionistData;
            next(); // Allow access for receptionist
          } else {
            return res.status(401).json({ error: 'You must be logged in!' });
          }
        });
      }
    });
  });
};

module.exports = { protectSuperAdminAndReceptionist };
