const mongoose = require("mongoose");

const listOfCompiniesSchema = new mongoose.Schema({
    name: String,
    company_index: Number,
})

const distributorSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    address: { type: String },
    ownerName: { type: String },
    phone: { type: String },
    email: { type: String },
    gstNumber: { type: String },
    companies: [listOfCompiniesSchema],
});

const Distributor = mongoose.model("Distributor", distributorSchema);

module.exports = { Distributor };
