const { Mongoose, default: mongoose } = require('mongoose');
const { OrderReturnModel, OrderListModel } = require('../../Models/Order_PurchaseModel'); // Adjust the path as needed
const sendEmail = require('../../APIS/emailing');
const { Distributor } = require('../../Models/DistributorModel');


// Create a new order

const getReturnOrderEmailTemplate = (returnOrder, originalOrder, distributor_user_object) => {

    const {
        nameOfMedicine,
        quantity,
        distributor,
        date
    } = originalOrder;

    const template = `
        Hello ${distributor_user_object.companyName},

        A return order has been created for the original order (${originalOrder.Order_Id}). Here are the details:

        Return Order Details:
        - Medicine: ${originalOrder.nameOfMedicine}
        - Damage: ${returnOrder.damage}
        - Date: ${returnOrder.date}

        Original Order Details:
        - Medicine: ${nameOfMedicine}
        - Quantity: ${quantity}
        - Order Date: ${date}

        Best regards,
        Your Company Name
    `;

    return template;
};


const createReturnOrder = async (req, res) => {
    try {
        const orderIds = [];


        try {
            for (const key in req.body) {
                const orderData = req.body[key];
                let { damage, order } = orderData;

                let order_object = await OrderListModel.findOne({ Order_Id: order });
                let distributor_user_object = await Distributor.findById(order_object?.distributor);

                if (!order_object) {
                    return res.status(404).json({ error: 'Original order not found' });

                }

                const emailTemplate = getReturnOrderEmailTemplate({ ...orderData, date: new Date().toISOString().slice(0, 10) }, order_object, distributor_user_object);
                await sendEmail(distributor_user_object.email, 'Return Order Request', emailTemplate);
                const newOrder = await OrderReturnModel.create({ ...req.body?.[key], date: new Date().toISOString().slice(0, 10), order: order_object?.Order_Id });
            }

            res.status(201).json({ msg: 'Return Order Request' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create return orders' });
    }
};


// Get all orders
const getAllReturnOrders = async (req, res) => {

    const { page, limit, search = '' } = req.query;
    const skip = page ? (parseInt(page) - 1) * (limit ? parseInt(limit) : 10) : 0;
    const pageSize = limit ? parseInt(limit) : 10;

    const query = {
        '$or': [
            { nameOfMedicine: { $regex: new RegExp(search, 'i') } },
            { company: { $regex: new RegExp(search, 'i') } }]
    }


    try {
        const orders = await OrderReturnModel.find();
        res.status(200).json(orders);
    } catch (error) {


        res.status(500).json({ error: error.message });
    }
};


// Get a specific order by ID
const getReturnOrderById = async (req, res) => {
    try {
        const order = await OrderReturnModel.findById(req.params.id);
        if (order) {
            res.status(200).json(order);
        } else {
            res.status(404).json({ message: 'OrderReturnModel not found' });
        }
    } catch (error) {


        res.status(500).json({ error: error.message });
    }
};

// Update an order by ID
const updateReturnOrderById = async (req, res) => {
    try {
        const updatedOrder = await OrderReturnModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (updatedOrder) {
            res.status(200).json(updatedOrder);
        } else {
            res.status(404).json({ message: 'OrderReturnModel not found' });
        }
    } catch (error) {


        res.status(500).json({ error: error.message });
    }
};

// Delete an order by ID
const deleteReturnOrderById = async (req, res) => {
    try {
        const deletedOrder = await OrderReturnModel.findByIdAndDelete(req.params.id);
        if (deletedOrder) {
            res.status(200).json(deletedOrder);
        } else {
            res.status(404).json({ message: 'OrderReturnModel not found' });
        }
    } catch (error) {


        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createReturnOrder,
    getAllReturnOrders,
    getReturnOrderById,
    updateReturnOrderById,
    deleteReturnOrderById,
};