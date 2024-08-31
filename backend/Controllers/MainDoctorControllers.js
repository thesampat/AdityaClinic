const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { MainDoctor } = require("../Models/MainDoctorModel");
const { getPermissions, setPermissionRoles } = require("./Other");
require("dotenv").config();

const MainDoctorRegister = async (req, res) => {

  const { name, email, MainDoctorId, password } = req.body;

  const Role = "MainDoctor";
  if (!name || !email || !password) {
    return res.status(422).json({ error: "please add all fields !" });
  }

  try {
    const auth_MainDoctor = await MainDoctor.findOne({ email });

    if (auth_MainDoctor) {
      return res.status(403).send({ msg: "Super admin are already exists!" });
    } else {
      bcrypt.hash(password, 5, async function (err, hash) {
        if (err) {
          return res.status(501).send(err);
        }
        try {
          const new_MainDoctor = new MainDoctor({
            name,
            email,
            password: hash,
            role: Role,
            MainDoctorId,
          });

          await new_MainDoctor.save();
          await setPermissionRoles(name, Role, email, new_MainDoctor?._id)

          return res.status(201).send({ msg: "Signup Successfully" });
        } catch (error) {


          return res.status(403).send(error);
        }
      });
    }
  } catch (error) {


    return res.status(500).send(err);
  }
};

const MainDoctorLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(422)
      .json({ error: "Please provide email and password." });
  }

  try {
    const MainDoctorRef = await MainDoctor.findOne({ email: email });
    let permissions = await getPermissions(MainDoctor._id)

    if (!MainDoctorRef) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    bcrypt.compare(password, MainDoctorRef.password, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Server error." });
      }

      if (result) {
        const token = jwt.sign(
          { id: MainDoctorRef._id, permissions: MainDoctorRef?.permissions, role: MainDoctorRef?.role },
          process.env.SECRET_KEY,
          {
            expiresIn: "100y",
          }
        );

        return res.status(200).json({
          message: "Main Doctor Login successful!",
          token,
          data: {
            _id: MainDoctorRef._id,
            name: MainDoctorRef.name,
            email: MainDoctorRef.email,
            role: MainDoctorRef.role,
          },
        });
      } else {
        return res.status(401).json({ error: "Invalid credentials." });
      }
    });
  } catch (error) {


    console.log(error)
    return res.status(500).json({ error: "Server error." });
  }
};

module.exports = { MainDoctorRegister, MainDoctorLogin };
