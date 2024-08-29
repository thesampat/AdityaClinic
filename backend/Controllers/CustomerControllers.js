const { default: mongoose } = require("mongoose");
const { Customer } = require("../Models/CustomerModel");
const { SuperAdmin } = require("../Models/MainDoctorModel");
const { Prescription } = require("../Models/PrescriptionModel");
require("dotenv").config();


const client = new mongoose.mongo.MongoClient(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = client.db('DB2_Aditya');
const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'reports' });


const VerifyPhone = async (req, res) => {
  let { phone } = req?.body || {}
  try {
    let exists = await Customer.findOne({ mobile: phone }, {firstName:1, surname:1, middleName:1, customerId:1})
    if(exists){
      res.send({ 'data': exists})
    }
    else{
      res.send({ 'data': false })
    }
  } catch (error) {
    console.log(error)
    res.send({ 'exists': false })
  }
}

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
    return null;
  }
};

const createCustomerBySuperAdmin = async (req, res) => {
  try {
    const {
      firstName,
      surname,
      email,
      middleName,
      bloodGroup,
      gender,
      maritalStatus,
      motherTongue,
      education,
      country,
      state,
      city,
      area,
      pincode,
      reference,
      patient_reference,
      location,
      patientStatus,
      profession,
      mobile,
      pic,
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
      middleName,
      maritalStatus,
      motherTongue,
      education,
      country,
      state,
      city,
      area,
      reference,
      patient_reference,
      location,
      pincode,
      patientStatus,
      profession,
      pic,
      mobile,
      role: Role,
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
      customerId
    };

    const customer = new Customer(customerData);

    // Save the Customer record
    let newCustomer = await customer.save();

    let message = "Customer created by ";

    return res.status(201).send({ msg: 'Patient registered successfully.', data: newCustomer?._id });

  } catch (error) {


    console.log(error)
    return res.status(500).json({ error: error.message });
  }
};


const updateCustomerProfile = async (req, res) => {
  try {
    const superAdminId = req?.user?._id;
    const customerId = req.params.customerId;
    const updateData = req.body;

    // Find the Customer by ID and update its data
    const customer = await Customer.findByIdAndUpdate(customerId, updateData, {
      new: true,
    });

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    return res.status(200).json({ msg: 'Customer updated successfully.', customer });
  } catch (error) {


    return res.status(500).json({ error: error.message });
  }
};

const deleteCustomerById = async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (customer) {
    await customer.deleteOne()
    res.json({ message: "Customer Removed" })
  } else {
    res.status(404)
    throw new Error("Doctor not found")
  }
}

const getAllCustomer = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const search = req.query.search ? {
      $or: [
        { firstName: { $regex: req.query.search, $options: 'i' } },
        { surname: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { mobile: { $regex: req.query.search, $options: 'i' } },
      ]
    } : {}

    const customers = await Customer.find(search)
      .skip(skip)
      .limit(parseInt(limit))

    return res.status(200).send(customers)

  } catch (error) {


    return res.status(500).send(error);
  }
}


const getSinglePatient = async (req, res) => {
  try {
    const customerId = req.params.id;
    const customer = await Customer.findById(new mongoose.Types.ObjectId(customerId));
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    return res.status(200).json(customer);
  } catch (error) {


    console.log(error)
    return res.status(500).json({ error: 'An error occurred while fetching the customer' });
  }
};


const getAllPatientReports = async (req, res) => {
  try {
    const customerId = req.params.id;
    const date = req.query.date;

    let data = await Prescription.aggregate([{$match:{Date:date}} ,{$project:{pictures:1, previousReports:1, previousTreatment:1}}])
    let data2 = await Customer.find({_id:new mongoose.Types.ObjectId(customerId)} ,{previousReports:1, previousTreatment:1, externalUploads:1, pictures:1})

    const {pictures:cpictures=null, previousReports:cpreviousReports=null, previousTreatment:cpreviousTreatment=null, externalUploads=null} = data2?.[0]||{}

    
    let {previousReports=null, previousTreatment=null, pictures=null} = data?.[0]||{}
    let allReports = [cpreviousReports, cpreviousTreatment,  previousReports, previousTreatment, ...pictures||[], ...cpictures||[], ...externalUploads||[]]?.filter(e=>e!==null)
    
    let cursor

    try {
        cursor = bucket.find({_id:{$in:allReports}});
    } catch (error) {
        return res.status(400).send('invalid object id')
    }

    const files = await cursor.toArray();

    files?.forEach(f => {
      if (cpictures && cpictures?.includes(f._id)) {
        f.typeOfDoc = 'profile';
      } else if (f._id.equals(cpreviousReports)) {
        f.typeOfDoc = 'profile';
      } else if (f._id.equals(cpreviousTreatment)) {
        f.typeOfDoc = 'profile';
      } else if (externalUploads && externalUploads?.includes(f._id)) {
        f.typeOfDoc = 'external';
      } else {
        f.typeOfDoc = 'treatment';
      }
    });

    res.send(files)

  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'An error occurred while fetching the customer' });
  }
};




module.exports = {VerifyPhone, getAllPatientReports, createCustomerBySuperAdmin, updateCustomerProfile, deleteCustomerById, getAllCustomer, getSinglePatient };
