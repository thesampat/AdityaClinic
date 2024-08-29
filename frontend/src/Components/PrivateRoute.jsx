import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { checkLoggedIn } from '../Redux/AuthReducer/action';

export default function PrivateRoute({ children, allowedRoles }) {
  const dispatch = useDispatch();
  const userLoginSuccess = useSelector((state) => state.AuthReducer.userLoginSuccess);
  const userLoginRole = useSelector((state) => state.AuthReducer.userLoginRole);
  const storedUserData = sessionStorage.getItem('clinic-application-jwt');

  if (storedUserData) {
    const { data, token } = JSON.parse(storedUserData);
    dispatch({
      type: 'USER_LOGIN_SUCCESS',
      payload: {
        data,
        message: '', 
      },
    });
    return children;
  } else {
    if (!window.location.pathname.startsWith('/public')) {
      return <Navigate to="/login" />;
    }

    if (allowedRoles.includes(userLoginRole)) {
      return children;
    }
  }
}
