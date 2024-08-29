const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { AssistantDoctor } = require('../Models/AssitantDoctorModel');
const { Doctor } = require('../Models/DoctorsModel');
const { Consultant } = require('../Models/ConsultantModel');
const { Receptionist } = require('../Models/ReceptionistModel');
const { MainDoctor } = require('../Models/MainDoctorModel');
const sendEmail = require('../APIS/emailing');


const generateRandomPassword = (length) => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset.charAt(randomIndex);
    }

    return password;
};


// Reset password route
router.post('/:userId/:roleId', async (req, res) => {
    const { roleId, userId } = req.params;
    const { newPassword } = req.body;

    try {
        let userModel;

        switch (roleId) {
            case 'AssistantDoctor':
                userModel = AssistantDoctor;
                break;
            case 'Doctor':
                userModel = Doctor;
                break;
            case 'Consultant':
                userModel = Consultant;
                break;
            case 'Receptionist':
                userModel = Receptionist;
                break;
            case 'MainDoctor':
                userModel = MainDoctor;
                break;
            case 'SuperAdmin':
                userModel = SuperAdmin;
                break;
            default:
                return res.status(404).json({ error: 'Invalid role.' });
        }

        let user

        try {
            user = await userModel.findById(userId);
        } catch (error) {


            res.status(400).send('Something went wrong')
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }


        bcrypt.hash(newPassword, 10, async function (err, hash) {
            if (err) {
                console.log(err)
                return res.status(500).send(err);
            }

            user.password = hash;
            let passres = await user.save();

            return res.status(200).json({ msg: 'Password reset successfully.' });
        });




    } catch (error) {
        console.log(error);

        return res.status(500).send(error);
    }
});

router.post('/forgotPassword/:userId/:roleId', async (req, res) => {


    const { roleId, userId } = req.params;
    const newPassword = generateRandomPassword(6);



    try {
        let userModel;

        switch (roleId) {
            case 'AssistantDoctor':
                userModel = AssistantDoctor;
                break;
            case 'Doctor':
                userModel = Doctor;
                break;
            case 'Consultant':
                userModel = Consultant;
                break;
            case 'Receptionist':
                userModel = Receptionist;
                break;
            case 'MainDoctor':
                userModel = MainDoctor;
                break;
            case 'SuperAdmin':
                userModel = SuperAdmin;
                break;
            default:
                return res.status(404).json({ error: 'Invalid role' });
        }

        let user

        try {
            user = await userModel.findById(userId);
        } catch (error) {


            console.log(error)
            res.status(500).send('Something went wrong')
        }

        if (!user) {
            return res.status(500).send('User not found');
        }


        bcrypt.hash(newPassword, 10, async function (err, hash) {
            if (err) {
                console.log(err)
                return res.status(500).send(err);
            }

            user.password = hash;
            let passres = await user.save();


            await sendEmail(user?.email, 'Passowrd Reset Successfully', `Please Use This Password ${newPassword}`)


            return res.status(200).json({ msg: `Password reset email sent successfully to ${user?.name}` });
        });
    } catch (error) {


        console.log(error);

        return res.status(500).send(error);
    }
});


module.exports = router;
