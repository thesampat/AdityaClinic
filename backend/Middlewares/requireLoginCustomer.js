const jwt = require('jsonwebtoken');
const { Customer } = require("../Models/CustomerModel");

const protectCustomer = (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) {
        return res.status(401).json({ error: "you must be logged in!" })
    }
    const token = authorization.replace("Bearer ", "")
    jwt.verify(token, "clinic7865", (err, payload) => {
        if (err) {
            return res.status(401).json({ error: "you must be logged in", err })
        }
        // console.log(payload)
        const { customerId } = payload
        Customer.findById(customerId).then(customerdata => {
            req.customer = customerdata
            next()
        })
    })
}

module.exports = { protectCustomer }