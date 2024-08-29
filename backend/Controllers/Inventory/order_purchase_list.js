const { Distributor } = require('../../Models/DistributorModel');
const { OrderListModel } = require('../../Models/Order_PurchaseModel'); // Adjust the path as needed
const sendEmail = require('../../APIS/emailing');


const getEmailTemplate = (body, Order_Id, distributor_user) => {


    const {
        nameOfMedicine,
        quantity,
        distributor,
        potencyOrPower,
        typeOfMedicine
    } = body;


    const template = `
        Hello ${distributor_user?.companyName},

        We have a new order request (${Order_Id}) for the following medicine:

        - Medicine: ${nameOfMedicine}
        - Quantity: ${quantity}
        - potencyOrPower: ${potencyOrPower}
        - potencyOrPower: ${potencyOrPower}
        - typeOfMedicine: ${typeOfMedicine}

        Please process the order at your earliest convenience.

        Best regards,
        ${process.env.COMPANY}
    `;

    return template;
};

// Example usage
const body = {
    nameOfMedicine: 'Test 1',
    quantity: 10,
    distributor: 'Distributor Name', // Replace with the actual distributor's name
    to: 'distributor@example.com' // Replace with the actual distributor's email address
};

const Order_Id = 'ORD2023121312';

const emailTemplate = getEmailTemplate(body, Order_Id);


const generateOrderId = async () => {
    try {
        const count = await OrderListModel.countDocuments({});
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');

        const patientId = `ORD${year}${month}${day}${count}`;
        return patientId;
    } catch (err) {
        console.error(err);
        return null;
    }
};


// Create a new order
const createOrder = async (req, res) => {
    try {
        const orderIds = [];

        for (const key in req.body) {
            const orderData = req.body[key];
            const Order_Id = await generateOrderId();
            let distributor_user = await Distributor.findOne({ email: orderData.to });
            await sendEmail(distributor_user?.email, 'Medicine Order Request From AdityaHomeopathic', getEmailTemplate(orderData, Order_Id, distributor_user));
            const newOrder = await OrderListModel.create({ ...orderData, Order_Id, distributor: distributor_user?._id });
            orderIds.push(newOrder?._id);
        }

        res.status(201).json({ msg: 'Purchase Orders Created', data: orderIds });
    } catch (error) {


        console.error(error);
        res.status(500).json({ error: 'Failed to create orders' });
    }
};


const getAllOrders = async (req, res) => {
    const { page, limit, search = '' } = req.query;
    const skip = page ? (parseInt(page) - 1) * (limit ? parseInt(limit) : 10) : 0;
    const pageSize = limit ? parseInt(limit) : 10;

    const query = {
        '$or': [
            { nameOfMedicine: { $regex: new RegExp(search, 'i') } },
            { company: { $regex: new RegExp(search, 'i') } }]
    }


    try {
        const enquiries = await OrderListModel.find(query).skip(skip).limit(pageSize);
        res.status(200).json(enquiries);
    } catch (error) {


        console.error(error);
        res.status(500).json({ error: "Error fetching enquiries" });
    }
};


// Get a specific order by ID
const getOrderById = async (req, res) => {
    try {
        const order = await OrderListModel.findById(req.params.id);
        if (order) {
            res.status(200).json(order);
        } else {
            res.status(404).json({ message: 'OrderListModel not found' });
        }
    } catch (error) {


        res.status(500).json({ error: error.message });
    }
};

const getOrderByIds = async (req, res) => {

    let { orders } = req.query

    try {
        const order = await OrderListModel.find({ '_id': { $in: orders } });
        if (order) {
            res.status(200).json(order);
        } else {
            res.status(404).json({ message: 'OrderListModel not found' });
        }
    } catch (error) {


        res.status(500).json({ error: error.message });
    }
};


const getAllOrderIds = async (req, res) => {
    try {
        const orders = await OrderListModel.find({}, 'Order_Id');
        const orderIds = orders.map(order => order.Order_Id);
        res.status(200).json(orderIds);
    } catch (error) {


        console.log(error)
        res.status(500).json({ error: error.message });
    }
};


// Update an order by ID
const updateOrderById = async (req, res) => {
    try {
        const updatedOrder = await OrderListModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (updatedOrder) {
            res.status(200).json(updatedOrder);
        } else {
            res.status(404).json({ message: 'OrderListModel not found' });
        }
    } catch (error) {


        res.status(500).json({ error: error.message });
    }
};

// Delete an order by ID
const deleteOrderById = async (req, res) => {
    try {
        const deletedOrder = await OrderListModel.findByIdAndDelete(req.params.id);
        if (deletedOrder) {
            res.status(200).json(deletedOrder);
        } else {
            res.status(404).json({ message: 'OrderListModel not found' });
        }
    } catch (error) {


        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderById,
    deleteOrderById,
    getAllOrderIds,
    getOrderByIds
};
