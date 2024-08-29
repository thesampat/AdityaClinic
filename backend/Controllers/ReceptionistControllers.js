const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Receptionist } = require("../Models/ReceptionistModel")
const { SuperAdmin } = require("../Models/MainDoctorModel");
const { setPermissionRoles, getPermissions, defaultPasswordAll } = require("./Other");
require("dotenv").config();

const generateItemId = async () => {
    try {
        const count = await Receptionist.countDocuments({});
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');

        const ItemId = `${year}${month}${day}${count}`;
        return ItemId;
    } catch (err) {
        console.error(err);
        return null;
    }
};

const receptionistRegisterBySuperAdmin = async (req, res) => {
    const { name, email, password, pic, phone, education_details, experience_details, location } = req.body;
    let receptionistId

    const Role = "Receptionist";
    if (!name || !email) {
        return res.status(400).send("Please provide all fields");
    }

    try {
        let res = await generateItemId()
        receptionistId = res
    } catch (error) {
        console.log(error)
        return res.status(500).send('Error! Please Try Again')
    }


    try {
        const authReceptionist = await Receptionist.findOne({ email })
        if (authReceptionist) {
            return res.status(403).send('Receptionist is already registered');
        }

        bcrypt.hash(defaultPasswordAll, 10, async function (err, hash) {
            if (err) {
                return res.status(500).send('Something went wrong');
            }

            try {
                const newReceptionist = new Receptionist({
                    name,
                    email,
                    password: hash,
                    role: Role,
                    pic,
                    phone,
                    receptionistId,
                    education_details,
                    experience_details,
                    location,
                })
                await setPermissionRoles(name, Role, email, newReceptionist?._id)
                await newReceptionist.save()
                return res.status(201).send({ msg: 'Receptionist registered successfully.', data: newReceptionist?._id });
            } catch (error) {


                console.log(error)
                return res.status(403).send('Something went wrong');
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send('Something went wrong');
    }
}

const receptionistLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res
            .status(422)
            .json({ error: "Please provide email and password." });
    }

    try {
        const receptionist = await Receptionist.findOne({ email });

        if (!receptionist) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        let permissions = await getPermissions(receptionist._id);

        bcrypt.compare(password, receptionist.password, (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Server error." });
            }

            if (result) {
                const token = jwt.sign(
                    { id: receptionist._id, permissions: permissions?.permissions, role: permissions?.role },
                    process.env.SECRET_KEY,
                    {
                        expiresIn: "100y",
                    }
                );

                return res.status(200).json({
                    message: "Receptionist Login Successful!",
                    token,
                    data: {
                        _id: receptionist._id,
                        name: receptionist.name,
                        email: receptionist.email,
                        role: receptionist.role,
                        pic: receptionist.pic
                    }
                });
            } else {
                return res.status(401).json({ error: "Invalid credentials." });
            }
        });
    } catch (error) {


        console.log(error);

        return res.status(500).json({ error: "Server error." });
    }
};


const updateReceptionistProfile = async (req, res) => {
    const { receptionistId } = req.params
    const receptionist = await Receptionist.findById(receptionistId);

    if (receptionist) {
        receptionist.name = req.body.name || receptionist.name
        receptionist.email = req.body.email || receptionist.email
        receptionist.pic = req.body.pic || receptionist.pic
        receptionist.phone = req.body.phone || receptionist.phone
        receptionist.education_details = req.body.education_details || receptionist.education_details
        receptionist.experience_details = req.body.experience_details || receptionist.experience_details
        receptionist.location = req.body.location || receptionist.location
        receptionist.status = req.body.exit_date && 'Left'
        receptionist.exit_date = req.body.exit_date || ''
        receptionist.exit_reason = req.body.exit_reason || ''
        const updatedReceptionist = await receptionist.save()

        res.json(updatedReceptionist)
    } else {
        res.status(404);
        throw new Error("Receptionist not found!");
    }
}

const getAllReceptionist = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const skip = (page - 1) * limit;

        // Define a query object to filter based on search term
        const query = {
            $or: [
                { name: { $regex: search, $options: 'i' } }, // Case-insensitive search by name
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }, // Case-insensitive search by email
                // Add more fields to search if needed
            ],
        };

        const receptionists = await Receptionist.find(query)
            .skip(skip)
            .limit(parseInt(limit));

        return res.status(200).json(receptionists);
    } catch (error) {


        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const deleteReceptionistById = async (req, res) => {
    const receptionist = await Receptionist.findById(req.params.id)

    if (receptionist) {
        await receptionist.deleteOne()
        res.json({ message: "Receptionist Removed" })
    } else {
        res.status(404)
        throw new Error("Receptionist not found")
    }
}

const getSingleReceptionist = async (req, res) => {

    try {
        const rescp = await Receptionist.findById(req.params.id)
        res.status(200).send(rescp)

    } catch (error) {


        res.status(404).send('Something went wrong')
    }
}

module.exports = { receptionistRegisterBySuperAdmin, receptionistLogin, updateReceptionistProfile, getAllReceptionist, deleteReceptionistById, getSingleReceptionist }