import React from 'react';
import { FaUserAlt, FaPrescriptionBottleAlt, FaCalendarCheck } from 'react-icons/fa';
import { IoMdPaper } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

const NavigationButtons = () => {
  const navigate = useNavigate();

  const tabs = [
    { label: 'Add Appointment', icon: <FaCalendarCheck />, url: '/appointment' },
    { label: 'Prescription', icon: <IoMdPaper />, url: '/prescription' },
  ];

  return (
    <div className="flex flex-wrap gap-4">
      {tabs.map((tab) => (
        <button
          key={tab.label}
          className="bg-white border-2 hover:bg-primary-300 hover:text-primary-50 active:text-primary-500 border-primary-400 text-primary-400 font-bold px-4 py-2 rounded-lg focus:outline-none flex items-center"
          onClick={() => {
            navigate(tab.url);
          }}
        >
          {tab.icon}
          <span className="ml-3">{tab.label.charAt(0).toUpperCase() + tab.label.slice(1)}</span>
        </button>
      ))}
    </div>
  );
};

export default NavigationButtons;
