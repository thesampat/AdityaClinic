const express = require('express');
const { createUserRolePermission, getAllUserRolePermissions, getUserDetails, getUserRolePermissionByUsername, updateUserRolePermission, deleteUserRolePermission, getAllUsers } = require("../Controllers/RoleAndPermissionController");
const checkRolesPermissions = require('../Middlewares/PermissionRolesMiddleware');


const router = express.Router();

router.route('/').get(getAllUserRolePermissions);
router.route('/:username').get(checkRolesPermissions, getUserRolePermissionByUsername);
router.route('/:username').put(checkRolesPermissions, updateUserRolePermission);
router.route('/users/getUsers').get(getAllUsers);
router.route('/users/getUsersDetails').get(getUserDetails);


module.exports = router