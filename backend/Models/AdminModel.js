const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String },
    pic: {
        type: String,
        default:
            "https://res.cloudinary.com/dmzzzl5jj/image/upload/v1673894892/avatar_gvyled.jpg",
    },
    role: { type: String, enum: ["Admin"], required: true },
    adminId: { type: String }
})

const Admin = mongoose.model("Admin", adminSchema);

module.exports = { Admin }
