const { UserRolePermissionModel } = require("./../Models/UserRolesPermission");
const { AssistantDoctor } = require("../Models/AssitantDoctorModel");
const { Doctor } = require("../Models/DoctorsModel");
const { Consultant } = require("../Models/ConsultantModel");
const { Receptionist } = require("../Models/ReceptionistModel");
const { MainDoctor } = require("../Models/MainDoctorModel");

const roles = async () => {
    console.log('runnin goles')
    await Promise.all(
      // Doctor, Consultant, Receptionist, MainDoctor, AssistantDoctor
      [Consultant]?.map(async (gmodel) => {
        let rolem = await UserRolePermissionModel.find({}, {user_id:1, username:1});
        return Promise.all(rolem?.map(async h => {
            let controller = await gmodel.find({_id:h?.user_id}).count();
                await UserRolePermissionModel.deleteOne({user_id:h?.user_id})
                console.log('delted', h?.username)
        }));
      })
    );
  };
  
  // roles();
