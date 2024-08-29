const mongoose = require("mongoose");

const timeSlotSchema = new mongoose.Schema({
    startTime: { type: String },
    endTime: { type: String },
});

const doctorSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    address: { type: String },
    education_details: { type: String },
    experience_details: { type: String },
    password: { type: String },
    fees: { type: String },
    education: { type: String },
    typesOfDoctor: { type: String },
    pic: {
        type: String,
        default:
            "https://res.cloudinary.com/dmzzzl5jj/image/upload/v1673894892/avatar_gvyled.jpg",
    },
    phone: { type: String },
    experience: { type: String },
    availability: {
        type: Map,
        of: {
            a_status: { type: String }, // Status should be a String ("Available" or "Not Available")
            timeSlots: [timeSlotSchema],
        },
    },
    role: { type: String, enum: ["Doctor"], required: true },
    doctorId: { type: String },
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

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = { Doctor };
