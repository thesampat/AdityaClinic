const { Customer } = require("../../Models/CustomerModel");
require("dotenv").config();

const generatePatientId = async () => {
    try {
        const count = await Customer.countDocuments({});
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');

        const patientId = `${year}${month}${day}${count}`;
        return patientId;
    } catch (err) {
        console.error(err);
        // Handle the error here
        return null; // Return null or handle the error as needed
    }
};
const createCustomerByExternal = async (req, res) => {
    try {
        const {
            firstName,
            surname,
            email,
            bloodGroup,
            gender,
            maritalStatus,
            motherTongue,
            education,
            state,
            pincode,
            reference,
            location,
            patientStatus,
            profession,
            mobile,
            pic,
            // Add the missing fields with optional chaining
            status,
            patientId,
            date,
            dateOfBirth,
            anniversary,
            weight,
            height,
            diagnosis,
            package,
            industry,
            middleName
        } = req.body;


        let customerId
        try {
            let res = await generatePatientId()
            customerId = res
        } catch (error) {


            res.status(500).send('Error! Please Try Again')
        }


        const Role = "Customer";

        const customerData = {
            firstName,
            surname,
            email,
            bloodGroup,
            gender,
            maritalStatus,
            motherTongue,
            education,
            state,
            reference,
            location,
            pincode,
            patientStatus,
            profession,
            pic,
            mobile,
            role: Role,
            // Add the missing fields with optional chaining
            status,
            patientId,
            date,
            dateOfBirth,
            anniversary,
            weight,
            height,
            diagnosis,
            package,
            industry,
            customerId,
            middleName
        };

        const customer = new Customer(customerData);

        // Save the Customer record
        await customer.save();

        let message = "Customer created";
        return res.status(201).json({ msg: message, customer });
    } catch (error) {


        console.log(error)
        return res.status(500).json({ error: error.message });
    }
};


module.exports = { createCustomerByExternal };
