const mongoose = require("mongoose");

const MainDoctorSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String },
    pic: {
        type: String,
        default:
            "https://res.cloudinary.com/dmzzzl5jj/image/upload/v1673894892/avatar_gvyled.jpg",
    },
    role: { type: String, enum: ["MainDoctor"], required: true },
    MainDoctorId: { type: String }
})

const MainDoctor = mongoose.model("MainDoctor", MainDoctorSchema);

module.exports = { MainDoctor }