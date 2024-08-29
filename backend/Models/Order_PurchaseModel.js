const mongoose = require("mongoose");

const orderListSchema = new mongoose.Schema({
    Order_Id: String,
    nameOfMedicine: { type: String, required: true },
    company: { type: String },
    potencyOrPower: { type: String },
    quantity: { type: Number, required: true },
    typeOfMedicine: { type: String },
    date: { type: Date, default: Date.now },
    distributor: new mongoose.SchemaTypes.ObjectId()
});

// Schema for the order return
const orderReturnSchema = new mongoose.Schema({
    order: { type: String },
    damage: { type: String },
    date: { type: Date, default: Date.now },
});


// Model for the order
const OrderListModel = mongoose.model("OrderList", orderListSchema);
const OrderReturnModel = mongoose.model("OrderReturn", orderReturnSchema);

module.exports = { OrderListModel, OrderReturnModel };
