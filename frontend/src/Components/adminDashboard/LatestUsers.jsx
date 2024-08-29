import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllDoctor, getAllReceptionist, getAllPatient, getAllConsultant, getSingleDoctor, getSingleReceptionist, getSinglePatient, getSingleConsultant } from '../../Redux/AdminReducer/action';
import CustomSpinner from '../CommonComponents/CustomSpinner';

function UserTable({ users, handleUpdateClick }) {
  return (
    <div className="overflow-x-auto ">
      <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
        <thead>
          <tr className="text-left text-xs bg-primary-400 font-medium text-primary-50 uppercase tracking-wider">
            <th className="px-4 py-3 border border-gray-300">Name</th>
            <th className="px-4 py-3 border border-gray-300">Email</th>
            <th className="px-4 py-3 border border-gray-300">Phone</th>
            <th className="px-4 py-3 border border-gray-300">Education</th>
            <th className="px-4 py-3 border border-gray-300">Modify</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users &&
            users.length > 0 &&
            users.map((item, index) => (
              <tr key={item._id}>
                <td className="px-4 py-3 border border-gray-300 whitespace-nowrap">{item.name || 'NA'}</td>
                <td className="px-4 py-3 border border-gray-300 whitespace-nowrap">{item.email || 'NA'}</td>
                <td className="px-4 py-3 border border-gray-300 whitespace-nowrap">{item.phone || 'NA'}</td>
                <td className="px-4 py-3 border border-gray-300 whitespace-nowrap">{item.education || 'NA'}</td>
                <td className="px-4 py-3 border border-gray-300 whitespace-nowrap">
                  <span onClick={() => handleUpdateClick(item)} className="bg-gray-100 cursor-pointer text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded border border-gray-500">
                    modify
                  </span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default function LatestUsers() {
  const [activeTab, setActiveTab] = useState('doctors');
  const [query, setQuery] = useState({ search: '', page: 1, limit: 7 });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { getAllDoctorData, getAllDoctorMessage, getAllDoctorFail, getAllDoctorProcessing, getAllReceptionistData, getAllReceptionistMessage, getAllReceptionistFail, getAllReceptionistProcessing, getAllConsultantData, getAllConsultantMessage, getAllConsultantFail, getAllConsultantProcessing, getAllPatientData, getAllPatientMessage, getAllPatientFail, getAllPatientProcessing } = useSelector(
    (state) => state.AdminReducer,
  );

  useEffect(() => {
    if (activeTab === 'doctors') {
      dispatch(getAllDoctor(query));
    } else if (activeTab === 'receptionists') {
      dispatch(getAllReceptionist(query));
    } else if (activeTab === 'patients') {
      dispatch(getAllPatient(query));
    } else if (activeTab === 'consultants') {
      dispatch(getAllConsultant(query));
    } else {
      dispatch(getAllDoctor(query));
    }
  }, [activeTab, query, dispatch]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleUpdateClick = (user) => {
    if (activeTab === 'doctors') {
      dispatch(getSingleDoctor(user));
      navigate(`/doctors/update`);
    } else if (activeTab === 'receptionists') {
      dispatch(getSingleReceptionist(user));
      navigate(`/receptionist/update`);
    } else if (activeTab === 'patients') {
      dispatch(getSinglePatient(user));
      navigate(`/patients/update`);
    } else if (activeTab === 'consultants') {
      dispatch(getSingleConsultant(user));
      navigate(`/consultant/update`);
    }
  };

  let usersData, usersProcessing, usersFail, usersMessage;

  switch (activeTab) {
    case 'doctors':
      usersData = getAllDoctorData;
      usersProcessing = getAllDoctorProcessing;
      usersFail = getAllDoctorFail;
      usersMessage = getAllDoctorMessage;
      break;
    case 'receptionists':
      usersData = getAllReceptionistData;
      usersProcessing = getAllReceptionistProcessing;
      usersFail = getAllReceptionistFail;
      usersMessage = getAllReceptionistMessage;
      break;
    case 'patients':
      usersData = getAllPatientData;
      usersProcessing = getAllPatientProcessing;
      usersFail = getAllPatientFail;
      usersMessage = getAllPatientMessage;
      break;
    case 'consultants':
      usersData = getAllConsultantData;
      usersProcessing = getAllConsultantProcessing;
      usersFail = getAllConsultantFail;
      usersMessage = getAllConsultantMessage;
      break;
    default:
      usersData = [];
      usersProcessing = false;
      usersFail = false;
      usersMessage = '';
  }

  return (
    <>
      <p className="font-bold mt-8 ml-1">Latest User's</p>
      <div className="bg-white min-h-[500px] h-fit mt-2 rounded-lg p-4">
        <div className="flex justify-around flex-wrap gap-4 mt-1">
          <div className="flex flex-wrap gap-4">
            {['doctors', 'receptionists', 'patients', 'consultants'].map((tab) => (
              <button key={tab} className={`${activeTab === tab ? 'bg-primary-300 text-primary-50 font-bold' : 'bg-gray-200 text-gray-700'} px-4 py-2 rounded-lg focus:outline-none`} onClick={() => handleTabClick(tab)}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          {/* Render content based on the active tab */}
          {activeTab && (
            <div className="w-full">
              {usersProcessing && <CustomSpinner height={2} />}
              {usersFail && <p>Error: {usersMessage}</p>}
              {!usersProcessing && !usersFail && <UserTable users={usersData} handleUpdateClick={handleUpdateClick} />}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
