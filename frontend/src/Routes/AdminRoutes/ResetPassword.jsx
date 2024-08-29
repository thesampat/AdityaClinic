import React, { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { END_POINT, getJwtToken } from '../../Redux/AdminReducer/action';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { useSelector } from 'react-redux';
import CustomButton from '../../Components/CommonComponents/CustomButton';
import CustomSelect from '../../Components/CommonComponents/CustomSelect';

const resetPassword = async (data, path, setIsPorcessing, closeModal) => {
  try {
    toast.loading('reseting....');
    const result = await axios.post(`${END_POINT}/resetPassword/${path}`, data, {
      headers: {
        Authorization: getJwtToken(),
      },
    });
    let { data: id } = result?.data;
    toast.dismiss();
    setIsPorcessing(false);
    toast.success('Password Changed Successfully');
    setTimeout(() => {
      closeModal(false);
    }, 1000);
  } catch (error) {
    toast.dismiss();
    toast.error(error?.response?.data || 'Something went wrong');
    setIsPorcessing(false);
  }
};

const forgotPassword = async (data, path, setIsPorcessing, closeModal) => {
  try {
    toast.loading('reseting....');
    const result = await axios.post(`${END_POINT}/resetPassword/forgotPassword/${path}`, data, {
      headers: {
        Authorization: getJwtToken(),
      },
    });
    toast.dismiss();
    setIsPorcessing(false);
    toast.success('Password mailed successfully ');
    setTimeout(() => {
      closeModal(false);
    }, 1000);
  } catch (error) {
    toast.dismiss();
    toast.error(error?.response?.data || 'Something went wrong');
    setIsPorcessing(false);
  }
};

const getUsers = async (querry) => {
  try {
    const result = await axios.get(`${END_POINT}/configAccess/users/getUsers/?${querry}`, {
      headers: {
        Authorization: getJwtToken(),
      },
    });
    let data = result;
    return data;
  } catch (error) {
    toast.error(error?.response?.data || 'Something went wrong');
    toast.error('failed to fetch users');
  }
};

const ResetPasswordPopup = ({ isOpen, onClose }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [processing, setIsProcessing] = useState(false);
  let loggedInUser = useSelector((state) => state.AuthReducer.userLogindata.data);
  const [logusers, setlogUsers] = useState(null);
  const [alllogusrs, setalllogusers] = useState(null);
  const [iloguser, setselecetdiloseruser] = useState({});
  const [passwordView, setPasswordView] = useState('self');

  useEffect(() => {
    toast.dismiss();
    if (loggedInUser?.role === 'MainDoctor') {
      getUsers('uid=all').then((e) => {
        if (e?.data?.length > 0) {
          setalllogusers(e?.data);
        }
      });
    }

    getUsers(`uid=${loggedInUser?._id}`).then((e) => {
      if (e?.data?.length > 0) {
        setselecetdiloseruser(e?.data?.[0]);
      }
    });
  }, []);

  const handleSubmit = () => {
    if (iloguser?.user_id === undefined) {
      toast.error('Please select valid user');
      return false;
    }
    loggedInUser?.role === 'MainDoctor' ? forgotPassword({}, `${iloguser?.user_id}/${iloguser?.role}`, setIsProcessing, onClose) : resetPassword({ newPassword: confirmPassword }, `${iloguser?.user_id}/${iloguser?.role}`, setIsProcessing, onClose);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className={`absolute inset-0 flex items-center justify-center ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-white p-8 w-full max-w-md relative z-50">
        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
        {loggedInUser?.role !== 'MainDoctor' ? (
          <>
            <div className="relative mb-4">
              <input type={showPassword ? 'text' : 'password'} placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="p-2 mb-4 border border-gray-300 rounded-md w-full" />
              <span onClick={togglePasswordVisibility} className="absolute right-3 top-2 cursor-pointer">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className="relative mb-4">
              <input type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="p-2 mb-4 border border-gray-300 rounded-md w-full" />
              <span onClick={toggleConfirmPasswordVisibility} className="absolute right-3 top-2 cursor-pointer">
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </>
        ) : (
          <>
            <CustomSelect
              onChange={(e) => {
                let selectedUser = alllogusrs?.filter((l) => l.username === e.target.value)?.[0];
                setselecetdiloseruser(selectedUser);
              }}
              options={alllogusrs?.map((e) => e?.username)}
              label="Select User"
              value={iloguser?.usernames}
              placeholder="-- Select Userr --"
            />
          </>
        )}

        <div className="flex justify-between gap-5">
          <CustomButton onClick={handleSubmit} isProcessing={processing} label="Submit" color={'primary-200'} width={32} />

          <CustomButton
            onClick={(e) => {
              setselecetdiloseruser({});
              setNewPassword('');
              setConfirmPassword('');
              onClose();
            }}
            isProcessing={processing}
            label="Close"
            color={'red-500'}
            width={32}
          />
        </div>
      </div>

      <ToastContainer />
      <div className={`absolute inset-0 bg-black opacity-50 transition-opacity z-40 ${isOpen ? '' : 'hidden'}`}></div>
    </div>
  );
};

export default ResetPasswordPopup;
