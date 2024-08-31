import React, { useEffect, useState } from 'react';
import { Link, NavLink, useMatches } from 'react-router-dom';
import { AiFillAccountBook, AiFillDashboard, AiOutlineHome, AiOutlineInfoCircle, AiOutlineMail, AiTwotoneDashboard } from 'react-icons/ai';
import AdminDashboard from '../../Routes/AdminRoutes/AdminDashboard';
import { GrContact, GrContactInfo, GrDashboard, GrLogout, GrPowerReset, GrUserWorker } from 'react-icons/gr';
import { IoLogOut } from 'react-icons/io5';
import { GiChest, GiDoctorFace, GiHelp, GiLetterBomb, GiMenhir, GiNotebook, GiPerson, GiPersonInBed, GiProgression, GiSergeant } from 'react-icons/gi';
import { BsPerson, BsPersonCircle, BsPersonDash, BsPersonFill, BsPersonFillGear } from 'react-icons/bs';
import { IoMdLogOut } from 'react-icons/io';
import { useSelector } from 'react-redux';
import ResetPasswordPopup from '../../Routes/AdminRoutes/ResetPassword';
import ContactUsPopup from '../../Routes/AdminRoutes/ContactUsEmail';
import { FaHammer, FaPaperPlane } from 'react-icons/fa';

const SidePanel = () => {
  const [isCollapsed, setCollapsed] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const [isResetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [popupContactUs, setPopupContactUs] = useState(false);
  let loggedInUser = useSelector((state) => state.AuthReducer.userLogindata.data);
  const toggleCollapse = () => {
    setCollapsed(!isCollapsed);
    setCurrentPath(window.location.pathname);
  };

  const links = [
    { id: 1, text: 'Dashboard', to: '/dashboard', icon: <AiTwotoneDashboard className='h-8 w-6 ' /> },
    { id: 2, text: 'Appointments', to: '/appointment/list', icon: <GiNotebook className='h-6 w-6'/> },
    { id: 3, text: 'Doctors', to: '/doctors', icon: <BsPersonFill className='h-6 w-6'/> },
    { id: 4, text: 'Assistant Doctor', to: '/assistantDoctor', icon: <BsPersonDash className='h-6 w-6'/> },
    { id: 5, text: 'Patient', to: '/patients', icon: <GiPersonInBed className='h-6 w-6'/> },
    { id: 6, text: 'Receptionist', to: '/receptionist', icon: <BsPerson className='h-6 w-6'/> },
    { id: 7, text: 'Consultant', to: '/consultant', icon: <BsPersonCircle className='h-6 w-6'/> },
    { id: 8, text: 'Enqiury', to: '/enquiry', icon: <GrContact  className='h-6 w-6'/> },
    { id: 9, text: 'Income & Expn', to: '/income_expenses', icon: <AiFillAccountBook className='h-6 w-6'/> },
    { id: 10, text: 'Inventory', to: '/main/inventory/inventory/addNew', icon: <GiChest className='h-6 w-6'/> },
    { id: 11, text: 'Alternative Therapies', to: '/AlternativeTherapies', icon: <GiChest className='h-6 w-6'/> },
    { id: 12, text: 'Feedback', to: '/feedback', icon: <FaPaperPlane className='h-6 w-6'/> },
    { id: 13, text: 'Bids', to: '/bids', icon: <FaHammer className='h-6 w-6'/> },
    { id: 13, text: 'Profile', to: '/clinic-profile', icon: <BsPersonFillGear className='h-6 w-6'/> },
  ];

  return (
    <div className={`bg-slate-100 SidePanel border border-2 border-slate-300 ms-3 mt-3 h-[100vh] text-black transition-all  ps-1 duration-300 ${isCollapsed ? 'w-14' : 'w-56'} overflow-hidden flex flex-col items-center shadow-md rounded`}>
      <button onClick={toggleCollapse} className="p-2">
        {isCollapsed ? (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        ) : (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        )}
      </button>
      <ul className={`${isCollapsed && 'flex flex-col'} flex flex-col gap-3`}>
        {links.map((link) => (
          <li key={link.id} className="flex items-center rounded-md w-100">
            <NavLink to={link.to} className={({ isActive, isPending }) => (isPending ? 'pending w-100' : isActive ? 'bg-blue-300 rounded-md w-full' : 'w-full')}>
              <div className="flex items-center p-2 rounded-md text-gray-800">
                {link.icon}
                {!isCollapsed && <span className="ml-3">{link.text}</span>}
              </div>
            </NavLink>
          </li>
        ))}
       
        {!isCollapsed && (
          <li className="flex items-center rounded-md w-100 mt-10 mx-3">
            <div className="ProfileName flex flex-col gap-2">
              <div className="flex justify-center items-center">
                <BsPerson className="h-12 w-12" />
                <div className="flex flex-col">
                  <h4 className="font-semibold text-md leading-6 capitalize">{loggedInUser.name?.slice(0, 30)}</h4>
                  <span class="bg-blue-500 text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-white">{loggedInUser?.role}</span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  window.sessionStorage.clear();
                  window.location.reload();
                }}
                className="p-1 flex items-center px-2 rounded-md text-white font-bold bg-orange-400" 
              >
                <IoMdLogOut />
                {!isCollapsed && <span className="ml-3">Logout</span>}
              </button>
              <button onClick={(e) => setResetPasswordOpen(true)} className="p-1 flex items-center px-2 rounded-md text-black bg-blue-300 font-semibold">
                <GrPowerReset className="text-white" />
                {!isCollapsed && <span className="ml-3">Reset Password</span>}
              </button>
              <button onClick={(e) => setPopupContactUs(true)} className="p-1 flex items-center px-2 rounded-md text-black bg-yellow-300 font-bold">
                <GrContactInfo className="text-white" />
                {!isCollapsed && <span className="ml-3">Contact Us</span>}
              </button>
            </div>
          </li>
        )}
      </ul>
      <ResetPasswordPopup isOpen={isResetPasswordOpen} onClose={() => setResetPasswordOpen(false)} />
      <ContactUsPopup isOpen={popupContactUs} onClose={() => setPopupContactUs(false)} />
    </div>
  );
};

export default SidePanel;
