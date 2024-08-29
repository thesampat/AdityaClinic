const mongoose = require("mongoose");

const timeSlotSchema = new mongoose.Schema({
    startTime: { type: String },
    endTime: { type: String },
});

const therapy_types = ['nutrition', 'counselling', 'acupuncture', 'acupressure', 'ayurvedic','neuropathy', 'physiotherapy']

const consultantSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String },
    profile_image: [],
    education_details: { type: String },
    experience_details: { type: String },
    fees: { type: String },
    location: { type: String },
    typesOfDoctor: { type: String, enum:therapy_types},
    role: { type: String, enum: ["Consultant"], required: true },
    phone: { type: String },
    consultantId: { type: String },

    availability: {
        type: Map,
        of: {
            a_status: { type: String }, // Status should be a String ("Available" or "Not Available")
            timeSlots: [timeSlotSchema],
        },
    },
    status: { type: String, default: 'Active' },
    exit_date: { type: String },
    exit_reason: { type: String },


    formalEducationDoc: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'reports.file'
    },
    professionalEducationDoc: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'reports.file'
    },
    additionalEducationDoc: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'reports.file'
    },
    recognition: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'reports.file'
    },
    registration: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'reports.file'
    },
    experience: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'reports.file'
    },
    resume: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'reports.file'
    },
    achievements: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'reports.file'
    },
    others: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'reports.file'
    },

    caseStudies: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'reports.file'
    },
    paperPresentations: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'reports.file'
    },
    otherDocs: [],




})

const Consultant = mongoose.model("Consultant", consultantSchema);

module.exports = { Consultant }