import React, { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomButton from '../../Components/CommonComponents/CustomButton';

const ContactUsPopup = ({ isOpen, onClose }) => {
  useEffect(() => {
    toast.dismiss();
  }, []);

  return (
    <div className={`absolute inset-0 flex items-center justify-center ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-white p-8 w-full max-w-md relative z-50">
        <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
        <p className="text-gray-700 mb-4">
          For any inquiries, please contact us at <span className="text-black font-bold text-lg">shivenclinicsoftware@googlegroups.com</span>.
        </p>
        <div className="flex justify-end">
          <CustomButton onClick={onClose} label="Close" color="primary-200" width={32} />
        </div>
      </div>
      <ToastContainer />
      <div className={`absolute inset-0 bg-black opacity-50 transition-opacity z-40 ${isOpen ? '' : 'hidden'}`}></div>
    </div>
  );
};

export default ContactUsPopup;
