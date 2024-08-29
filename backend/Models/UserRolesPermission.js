const mongoose = require("mongoose");

const userRolePermissionSchema = new mongoose.Schema({
    username: String,
    role: String,
    permissions: [],
    active: { type: Boolean, default: true },
    user_id: String,
})

const UserRolePermissionModel = mongoose.model("RoleAndPermissions", userRolePermissionSchema);

module.exports = { UserRolePermissionModel }