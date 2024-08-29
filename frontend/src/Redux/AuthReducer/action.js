import axios from "axios";
import * as types from "./actionTypes";
import { END_POINT } from "../AdminReducer/action";
import { toast } from "react-toastify";

// if (process.env.NODE_ENV === 'development') {
//   END_POINT = "https://free-lance-clinic-git-master-sampats-projects-106053d7.vercel.app"

// } else {
//   END_POINT = "https://api.adityahomoeopathicclinic.com"

// }

// signup function
const mainDoctorSignup = (userInput) => async (dispatch) => {
  dispatch({ type: types.MAIN_DOCTOR_SIGNUP_PROCESS });

  try {
    const res = await axios.post(`${END_POINT}/mainDoctor`, userInput);
    dispatch({ type: types.MAIN_DOCTOR_SIGNUP_SUCCESS, payload: res.data });
  } catch (err) {
    toast.error(err?.response?.data?.error || 'Something went wrong');
    // console.log(err)
    dispatch({ type: types.MAIN_DOCTOR_SIGNUP_FAILURE, payload: err.response.data.msg });
  }
};


// login function
const mainDoctorLogin = (userInput) => async (dispatch) => {
  dispatch({ type: types.USER_LOGIN_PROCESS });

  try {
    const res = await axios.post(`${END_POINT}/mainDoctor/login`, userInput);
    dispatch({ type: types.USER_LOGIN_SUCCESS, payload: res.data });
    sessionStorage.setItem("clinic-application-jwt", JSON.stringify({ data: res.data.data, token: res.data.token }))

  } catch (err) {
    toast.error(err?.response?.data?.error || 'Something went wrong');
    dispatch({
      type: types.USER_LOGIN_FAILURE,
      payload: err.response.data.error,
    });
  }
};


const assistantDoctorLogin = (userInput) => async (dispatch) => {
  dispatch({ type: types.USER_LOGIN_PROCESS });

  try {
    const res = await axios.post(`${END_POINT}/assistantDoctor/login`, userInput);
    // console.log("ok ", res)
    dispatch({ type: types.USER_LOGIN_SUCCESS, payload: res.data });
    sessionStorage.setItem("clinic-application-jwt", JSON.stringify({ data: res.data.data, token: res.data.token }))

  } catch (err) {
    toast.error(err?.response?.data?.error || 'Something went wrong');
    // console.log("ok ", err)
    dispatch({
      type: types.USER_LOGIN_FAILURE,
      payload: err.response.data.error,
    });
  }
};

//  doctor login
const doctorLogin = (userInput) => async (dispatch) => {
  dispatch({ type: types.USER_LOGIN_PROCESS });

  try {
    const res = await axios.post(`${END_POINT}/doctor/login`, userInput);

    dispatch({ type: types.USER_LOGIN_SUCCESS, payload: res.data });
    sessionStorage.setItem("clinic-application-jwt", JSON.stringify({ data: res.data.data, token: res.data.token }))
  } catch (err) {
    toast.error(err?.response?.data?.error || 'Something went wrong');

    dispatch({
      type: types.USER_LOGIN_FAILURE,
      payload: err.response.data.error,
    });
  }
}


// receptionist login
const receptionistLogin = (userInput) => async (dispatch) => {
  dispatch({ type: types.USER_LOGIN_PROCESS });

  try {
    const res = await axios.post(`${END_POINT}/receptionist/login`, userInput);

    dispatch({ type: types.USER_LOGIN_SUCCESS, payload: res.data });
    sessionStorage.setItem("clinic-application-jwt", JSON.stringify({ data: res.data.data, token: res.data.token }))
  } catch (err) {
    toast.error(err?.response?.data?.error || 'Something went wrong');

    dispatch({
      type: types.USER_LOGIN_FAILURE,
      payload: err.response.data.error,
    });
  }
}

// consultant login
const consultantLogin = (userInput) => async (dispatch) => {
  dispatch({ type: types.USER_LOGIN_PROCESS });

  try {
    const res = await axios.post(`${END_POINT}/consultant/login`, userInput);

    dispatch({ type: types.USER_LOGIN_SUCCESS, payload: res.data });
    sessionStorage.setItem("clinic-application-jwt", JSON.stringify({ data: res.data.data, token: res.data.token }))
  } catch (err) {
    toast.error(err?.response?.data?.error || 'Something went wrong');
    dispatch({
      type: types.USER_LOGIN_FAILURE,
      payload: err.response.data.error,
    });
  }
}


// Check if the user is already logged in
const checkLoggedIn = () => async (dispatch) => {
  const storedUserData = sessionStorage.getItem("clinic-application-jwt");

  if (storedUserData) {
    const { data, token } = JSON.parse(storedUserData);
    dispatch({
      type: types.USER_LOGIN_SUCCESS,
      payload: {
        data,
        message: "", // Empty string for successful message
      },
    });
  }
};


export { mainDoctorLogin, mainDoctorSignup, doctorLogin, receptionistLogin, consultantLogin, checkLoggedIn, assistantDoctorLogin };
