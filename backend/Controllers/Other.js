const { UserRolePermissionModel } = require('./../Models/UserRolesPermission');


const setPermissionRoles = async (name, role, email, id) => {

    let userExist = await UserRolePermissionModel.countDocuments({ name }).get()

    try {
        const newUserRolePermission = new UserRolePermissionModel({
            user_id: id,
            username: name,
            role: role,
            email: email
        });

        await newUserRolePermission.save();
        return true
    } catch (error) {


        throw new Error('Failed To Create User')
    }
}


const getPermissions = async (id) => {
    let permissions
    try {
        permissions = await UserRolePermissionModel.findOne({ user_id: id })
        return permissions
    } catch (error) {



    }

}


const generateItemId = async (Model) => {
    try {
        const count = await Model.countDocuments({});
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');

        const itemId = `${year}${month}${day}${count}`;
        return itemId;
    } catch (err) {
        console.error(err);
        return null;
    }
};


const defaultPasswordAll = 'Shiven123'



module.exports = { setPermissionRoles, getPermissions, generateItemId, defaultPasswordAll }