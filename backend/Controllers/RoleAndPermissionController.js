const { default: mongoose, ConnectionStates } = require('mongoose');
const { UserRolePermissionModel } = require('./../Models/UserRolesPermission');

const createUserRolePermission = async (req, res) => {
    try {
        const { username, role, permissions, active } = req.body;
        const newUserRolePermission = new UserRolePermissionModel({
            username,
            role,
            permissions,
            active: active || true,
        });

        const savedUserRolePermission = await newUserRolePermission.save();
        return true
    } catch (error) {


        throw new Error('Failed To Create User')
    }
};

const getAllUserRolePermissions = async (req, res) => {
    try {
        const userRolePermissions = await UserRolePermissionModel.find();
        res.json(userRolePermissions);
    } catch (error) {


        res.status(500).json({ error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        let { uid } = req.query;
        let query = {};

        if (uid !== 'all') {
            query.user_id = uid;
        }

        const userRolePermissions = await UserRolePermissionModel.find(
            query,
            { user_id: 1, role: 1, username: 1, _id: 0 }
        );

        res.json(userRolePermissions);
    } catch (error) {


        res.status(500).json({ error: error.message });
    }
};



const getUserRolePermissionByUsername = async (req, res) => {

    try {
        const { username } = req.params;

        const userRolePermission = await UserRolePermissionModel.findOne({ username });

        if (userRolePermission) {
            res.json(userRolePermission);
        } else {
            res.status(404).json({ message: 'User role and permissions not found' });
        }
    } catch (error) {


        res.status(500).json({ error: error.message });
    }
};

const updateUserRolePermission = async (req, res) => {
    try {
        const { username } = req.params;
        const { role, permissions, active } = req.body;

        const updatedUserRolePermission = await UserRolePermissionModel.findOneAndUpdate(
            { username },
            { role, permissions, active },
            { new: true }
        );

        if (updatedUserRolePermission) {
            res.json(updatedUserRolePermission);
        } else {
            res.status(404).json({ message: 'User role and permissions not found' });
        }
    } catch (error) {


        res.status(500).json({ error: error.message });
    }
};

const deleteUserRolePermission = async (req, res) => {
    try {
        const { username } = req.params;
        const deletedUserRolePermission = await UserRolePermissionModel.findOneAndDelete({
            username,
        });

        if (deletedUserRolePermission) {
            res.json({ message: 'User role and permissions deleted successfully' });
        } else {
            res.status(404).json({ message: 'User role and permissions not found' });
        }
    } catch (error) {


        res.status(500).json({ error: error.message });
    }
};

const getUserDetails = async (req, res) => {
    const { username, role } = req.query
    let userModel
    try {
        userModel = mongoose.model(role);
    } catch (error) {


        return res.status(500).send(`No model found role: ${role}`);

    }

    try {
        if (userModel) {
            const user = await userModel.findOne({ name: username }, { email: 1 });
            if (user) {
                res.status(200).send(user?.['email']);
            } else {
                res.status(404).send(`User not found for username: ${username}`);
            }
        } else {
            res.status(500).send(`could not fetch`);

        }
    } catch (error) {


        console.log(error)
        res.status(500).send(error)
    }
}

module.exports = {
    createUserRolePermission,
    getAllUserRolePermissions,
    getUserRolePermissionByUsername,
    updateUserRolePermission,
    deleteUserRolePermission,
    getAllUsers,
    getUserDetails
};
