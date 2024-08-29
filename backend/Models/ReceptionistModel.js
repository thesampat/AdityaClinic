const mongoose = require("mongoose");

const receptionistSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String },
    profile_image: [],
    education_details: { type: String },
    experience_details: { type: String },
    location: { type: String },
    role: { type: String, enum: ["Receptionist"], required: true },
    phone: { type: String },
    receptionistId: { type: String },
    educationDoc: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'reports.file'
    },
    experienceDoc: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'reports.file'
    },
    resumeDoc: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'reports.file'
    },
    registrationDoc: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'reports.file'
    },
    otherDocs: [],
    status: { type: String, default: 'Active' },
    exit_date: { type: String },
    exit_reason: { type: String }
});


// name: 'Tets',
// email: 'Tets@gmail.com',
// pic: 'picsend',
// phone: '8787878787',
// address: '',
// education: '',
// experience: '',
// education_details: '',
// experience_details: '',
// password: 'sam676767',
// confirmPassword: 'sam676767',
// exit_date: new Date()?.toISOString()?.slice(0, 10),


const Receptionist = mongoose.model("Receptionist", receptionistSchema);

module.exports = { Receptionist }