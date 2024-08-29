const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema({
    name: { type: String },
    number: { type: Number },
    location: { type: String },
    reference: { type: String },
    patientReferance: { type: String },
    purposeOfEnquiry: { Primary: '', sub: '' },
    statusOfEnquiry: { type: String },
    conslusion: { type: String },
    createdAt: { type: String, default: () => new Date().toISOString().slice(0, 10) },
    createdTime: {
        type: String, default: () => {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            return `${hours}:${minutes}`;
        }
    },
});

const Enquiry = mongoose.model("Enquiry", enquirySchema);

module.exports = { Enquiry }
