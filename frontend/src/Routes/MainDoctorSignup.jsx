import React, { useEffect, useState } from 'react';
import { IoPersonOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import CustomInput from '../Components/CommonComponents/CustomInput';
import CustomButton from '../Components/CommonComponents/CustomButton';
import { mainDoctorSignup } from '../Redux/AuthReducer/action';

export default function MainDoctorSignup() {
  // define states
  const mainDoctorSignupMessage = useSelector((state) => state.AuthReducer.mainDoctorSignupMessage);
  const mainDoctorSignupFail = useSelector((state) => state.AuthReducer.mainDoctorSignupFail);
  const mainDoctorSignupSuccess = useSelector((state) => state.AuthReducer.mainDoctorSignupSuccess);
  const mainDoctorSignupProcess = useSelector((state) => state.AuthReducer.mainDoctorSignupProcess);
  const [userInput, setUserInput] = useState({ email: '', name: '', password: '' });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // handel custom input change
  const handelCustomInputChange = (e) => {
    setUserInput({ ...userInput, [e.target.name]: e.target.value });
  };

  // handel Custom Button Click
  const handelCustomButtonClick = () => {
    // trim user input
    const data = {
      name: userInput.name.trim(),
      email: userInput.email.trim(),
      password: userInput.password.trim(),
    };

    console.log(!data.name || !data.password || data.email);

    if (!data.name || !data.email || !data.password) {
      toast.error('Please fill all the fields.', { position: toast.POSITION.TOP_RIGHT });
      return;
    }

    // check for valid email
    if (!/\S+@\S+\.\S+/.test(data.email)) {
      toast.error('Please enter a valid email address.', { position: toast.POSITION.TOP_RIGHT });
      return;
    }

    // must must have atleastt 8 characters
    if (data.password.length < 8) {
      toast.error('Password must have at least 8 characters.', { position: toast.POSITION.TOP_RIGHT });
      return;
    }

    // dispatch signup function
    dispatch(mainDoctorSignup(userInput));
  };

  // useEffect
  useEffect(() => {
    // signup success
    if (!mainDoctorSignupProcess && mainDoctorSignupSuccess) {
      toast.success(mainDoctorSignupMessage + ' Please Login!', { position: toast.POSITION.TOP_RIGHT });

      // reset user input
      setUserInput({ name: '', email: '', password: '' });
    }

    // signup fail
    else if (!mainDoctorSignupProcess && mainDoctorSignupFail) {
      toast.error(mainDoctorSignupMessage, { position: toast.POSITION.TOP_RIGHT });
    }
  }, [mainDoctorSignupProcess, mainDoctorSignupSuccess, mainDoctorSignupFail]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        {/* heading */}
        <p className="text-center mb-4 text-2xl font-bold ">Main Doctor Signup!</p>

        {/* name input */}
        <CustomInput required="true" type={'text'} name="name" label={'First Name'} value={userInput.name} onChange={handelCustomInputChange} placeholder={'First Name!'} />

        {/* email input */}
        <CustomInput type={'text'} name="email" label={'Email'} value={userInput.email} onChange={handelCustomInputChange} placeholder={'email@gmail.com'} />

        {/* password input */}
        <CustomInput type={'password'} name="password" label={'Password'} value={userInput.password} onChange={handelCustomInputChange} placeholder={'********'} icon={<IoPersonOutline />} />

        {/* signup button */}
        <CustomButton onClick={handelCustomButtonClick} isProcessing={mainDoctorSignupProcess} label="Signup" />

        {/* redirect to login page */}
        <p className="mt-4">
          {' '}
          Already Have Account,{' '}
          <span
            onClick={() => {
              navigate('/login');
            }}
            className="font-bold text-primary-200 cursor-pointer "
          >
            Login
          </span>{' '}
        </p>
      </div>

      <ToastContainer />
    </div>
  );
}
