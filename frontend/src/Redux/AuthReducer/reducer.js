import * as types from "./actionTypes";

const initialState = {

  mainDoctorSignupProcess: false,
  mainDoctorSignupSuccess: false,
  mainDoctorSignupFail: false,
  mainDoctorSignupdata: {},
  mainDoctorSignupMessage: "",

  userLoginProcess: false,
  userLoginSuccess: false,
  userLoginFail: false,
  userLogindata: {},
  userLoginRole: "",
  userLoginMessage: "",
};

export const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case types.USER_LOGIN_PROCESS:
      return {
        ...state,
        userLoginProcess: true,
        userLoginSuccess: false,
        userLoginFail: false,
        userLogindata: {},
        userLoginMessage: "",
        userLoginRole: ""
      };
    case types.USER_LOGIN_SUCCESS:
      return {
        ...state,
        userLoginProcess: false,
        userLoginSuccess: true,
        userLoginFail: false,
        userLogindata: payload,
        userLoginMessage: payload.message,
        userLoginRole: payload.data.role,
      };
    case types.USER_LOGIN_FAILURE:
      return {
        ...state,
        userLoginProcess: false,
        userLoginSuccess: false,
        userLoginFail: true,
        userLogindata: {},
        userLoginMessage: payload,
        userLoginRole: ""
      };
    case types.MAIN_DOCTOR_SIGNUP_PROCESS:
      return {
        ...state,
        mainDoctorSignupProcess: true,
        mainDoctorSignupSuccess: false,
        mainDoctorSignupFail: false,
        mainDoctorSignupdata: {},
        mainDoctorSignupMessage: "",
      };
    case types.MAIN_DOCTOR_SIGNUP_SUCCESS:
      return {
        ...state,
        mainDoctorSignupProcess: false,
        mainDoctorSignupSuccess: true,
        mainDoctorSignupFail: false,
        mainDoctorSignupdata: {},
        mainDoctorSignupMessage: payload.msg,
      };
    case types.MAIN_DOCTOR_SIGNUP_FAILURE:
      return {
        ...state,
        mainDoctorSignupProcess: false,
        mainDoctorSignupSuccess: false,
        mainDoctorSignupFail: true,
        mainDoctorSignupdata: {},
        mainDoctorSignupMessage: payload,
      };
    default:
      return state;
  }
};
