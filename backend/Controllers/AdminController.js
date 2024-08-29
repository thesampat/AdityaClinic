const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Admin } = require("../Models/AdminModel"); // Assuming you have an Admin model
const { setPermissionRoles } = require("./Other");
require("dotenv").config();

const adminRegister = async (req, res) => {
    const { name, email, password } = req.body;

    const Role = "Admin";
    if (!name || !email || !password) {
        return res.status(422).json({ error: "Please add all fields!" });
    }

    try {
        const auth_admin = await Admin.findOne({ email });

        if (auth_admin) {
            return res.status(403).send({ msg: "Admin already exists!" });
        } else {
            bcrypt.hash(password, 5, async function (err, hash) {
                if (err) {
                    return res.status(501).send(err);
                }

                try {
                    const new_admin = new Admin({
                        name,
                        email,
                        password: hash,
                        role: Role,
                    });

                    await setPermissionRoles(name, Role, email, new_admin?._id)
                    await new_admin.save();
                    return res.status(201).send({ msg: "Signup Successful" });
                } catch (error) {

                    return res.status(403).send(error);
                }
            });
        }
    } catch (error) {


        return res.status(500).send(error);
    }
};

const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).json({ error: "Please provide email and password." });
    }

    try {
        const admin = await Admin.findOne({ email: email });

        if (!admin) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        bcrypt.compare(password, admin.password, (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Server error." });
            }

            if (result) {
                const token = jwt.sign(
                    { id: admin._id },
                    process.env.SECRET_KEY,
                    {
                        expiresIn: "100y",
                    }
                );

                return res.status(200).json({
                    message: "Admin Login successful!",
                    token,
                    data: {
                        _id: admin._id,
                        name: admin.name,
                        email: admin.email,
                        role: admin.role,
                    },
                });
            } else {
                return res.status(401).json({ error: "Invalid credentials." });
            }
        });
    } catch (error) {


        return res.status(500).json({ error: "Server error." });
    }
};

module.exports = { adminRegister, adminLogin };
