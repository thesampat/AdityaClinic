const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SuperAdmin } = require("../Models/MainDoctorModel");
const { AssistantDoctor } = require('../Models/AssitantDoctorModel');
const { setPermissionRoles, getPermissions, defaultPasswordAll } = require("./Other");
require("dotenv").config();


const assistantDoctorRegisterBySuperAdmin = async (req, res) => {
    const { name, email, password, fees, education, typesOfDoctor,
        pic, phone, experience, doctorAvailableDays, slotTimes, availableTime, doctorId, availability, education_details, experience_details } = req.body;

    const Role = "AssistantDoctor";
    if (!name || !email) {
        return res.status(422).json({ error: "Please provide all fields." });
    }

    try {

        const authDoctor = await AssistantDoctor.findOne({ email })
        if (authDoctor) {
            return res.status(403).send({ msg: 'AssistantDoctor is already registered.' });
        }



        bcrypt.hash(defaultPasswordAll, 10, async function (err, hash) {
            if (err) {
                return res.status(500).send(err);
            }

            try {
                const newDoctor = new AssistantDoctor({
                    name,
                    email,
                    password: hash,
                    role: Role,
                    pic,
                    fees,
                    education,
                    education_details,
                    typesOfDoctor,
                    phone,
                    experience,
                    experience_details,
                    doctorAvailableDays,
                    slotTimes,
                    availableTime,
                    doctorId,
                    availability
                })

                await setPermissionRoles(name, Role, email, newDoctor?._id)
                let newDoctorRes = await newDoctor.save()

                return res.status(201).send({ msg: 'Assistant doctor registered successfully.', data: newDoctorRes?._id });
            } catch (error) {


                console.log(error)
                return res.status(403).send('error');
            }
        })

    } catch (error) {


        console.log(error, 'on adding doctor')
        return res.status(500).send(error);
    }
};

const AssistantDoctorLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res
            .status(422)
            .json({ error: "Please provide email and password." });
    }

    try {
        const doctor = await AssistantDoctor.findOne({ email });

        if (!doctor) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        let userAccess = await getPermissions(doctor._id);

        bcrypt.compare(password, doctor.password, (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Server error." });
            }

            if (result) {
                const token = jwt.sign(
                    { id: doctor._id, permissions: userAccess?.permissions, role: userAccess?.role },
                    process.env.SECRET_KEY,
                    {
                        expiresIn: "100y",
                    }
                );

                return res.status(200).json({
                    message: "Assistant Doctor Login Successful!",
                    token,
                    data: {
                        _id: doctor._id,
                        name: doctor.name,
                        email: doctor.email,
                        role: doctor.role,
                        fees: doctor.fees,
                        typesOfDoctor: doctor.typesOfDoctor,
                        pic: doctor.pic,
                    }
                });
            } else {
                return res.status(401).json({ error: "Invalid credentials." });
            }
        });
    } catch (error) {


        console.error(error);
        return res.status(500).json({ error: "Server error." });
    }
};


const updateAssistantDoctor = async (req, res) => {
    const { doctorId } = req.params
    const doctor = await AssistantDoctor.findById(doctorId)
    // console.log(doctor)

    if (doctor) {
        doctor.name = req.body.name || doctor.name
        doctor.email = req.body.email || doctor.name
        doctor.fees = req.body.fees || doctor.fees
        doctor.education = req.body.education || doctor.education
        doctor.education_details = req.body.education_details || doctor.education_details
        doctor.typesOfDoctor = req.body.typesOfDoctor || doctor.typesOfDoctor
        doctor.pic = req.body.pic || doctor.pic
        doctor.phone = req.body.phone || doctor.phone
        doctor.experience = req.body.experience || doctor.experience
        doctor.experience_details = req.body.experience_details || doctor.experience_details
        doctor.doctorAvailableDays = req.body.doctorAvailableDays || doctor.doctorAvailableDays
        doctor.slotTimes = req.body.slotTimes || doctor.slotTimes
        doctor.availableTime = req.body.availableTime || doctor.availableTime
        doctor.availability = req.body.availability || doctor.availability
        doctor.status = req.body.status || doctor.status
        doctor.exit_date = req.body.exit_date || doctor.exit_date
        doctor.exit_reason = req.body.exit_reason || doctor.exit_reason
        const updatedDoctor = await doctor.save()

        res.json(updatedDoctor)
    } else {
        res.status(404);
        throw new Error("Assistant Doctor not found!");
    }
}

const getAllAssistantDoctor = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const skip = (page - 1) * limit;

        // Define a query object to filter based on search term
        const query = {
            $or: [
                { name: { $regex: search, $options: 'i' } }, // Case-insensitive search by name
                { email: { $regex: search, $optioxns: 'i' } }, // Case-insensitive search by email
                { typesOfDoctor: { $regex: search, $options: 'i' } }, // Case-insensitive search by typesOfDoctor
            ],
        };

        const doctors = await AssistantDoctor.find()
            .skip(skip)
            .limit(parseInt(limit));

        return res.status(200).send(doctors);
    } catch (error) {


        return res.status(500).send(error);
    }
}

const deleteAssistantDoctorById = async (req, res) => {

    const doctor = await AssistantDoctor.findById(req.params.id)

    if (doctor) {
        await doctor.deleteOne()
        res.json({ message: "Assistant Doctor Removed" })
    }
    else {
        res.status(404)
        throw new Error("Assistant Doctor not found")
    }
}

const getSingleAssistantDoctor = async (req, res) => {

    try {
        const doctor = await AssistantDoctor.findById(req.params.id)
        res.status(200).send(doctor)

    } catch (error) {


        res.status(404).send('Something went wrong')
    }
}

module.exports = {
    assistantDoctorRegisterBySuperAdmin,
    getAllAssistantDoctor,
    AssistantDoctorLogin,
    updateAssistantDoctor,
    deleteAssistantDoctorById,
    getSingleAssistantDoctor
}
