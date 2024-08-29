import React from "react";
import { FaUserMd, FaUser, FaUserSecret } from "react-icons/fa";

const ProfileCard = ({ name, role, doctorCount, patientCount, receptionistCount, imageUrl }) => {
  return (
    <div className="w-72 p-4 bg-white rounded-lg shadow-lg hover:shadow-xl ">
      <div className="text-center">
        <img
          src={imageUrl}
          alt={`${name}'s profile`}
          className="w-32 h-32 mx-auto rounded-full mb-4"
        />
        <h2 className="mt-2 text-lg font-semibold text-primary-500">{name}</h2>
        <p className="text-gray-600">{role}</p>
      </div>
      <div className="mt-4">
        <div className="flex justify-between mt-2">
          <div className="text-center">
            <p className="text-lg font-semibold">{doctorCount}</p>
            <p className="text-sm text-gray-600">Doctors</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold">{patientCount}</p>
            <p className="text-sm text-gray-600">Patients</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold">{receptionistCount}</p>
            <p className="text-sm text-gray-600">Receptionists</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
