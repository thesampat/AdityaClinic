const mongoose = require("mongoose");

const inventoryListSchema = new mongoose.Schema({
    medicine_id: Number,
    nameOfMedicine: { type: String, required: true },
    company: { type: String },
    potencyOrPower: { type: String },
    quantity: { type: Number, required: true },
    typeOfMedicine: { type: String },
    distributorName: { type: String },
    expiryDate: { type: Date },
    minQuantity: { type: Number },
    maxQuantity: { type: Number },
    mrp: { type: Number },
    discount: { type: Number },
    hsnCode: { type: String },
    package: { type: Number }
});

const InventoryList = mongoose.model("InventoryList", inventoryListSchema);

module.exports = { InventoryList };
