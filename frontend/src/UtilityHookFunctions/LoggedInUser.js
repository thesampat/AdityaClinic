import { useSelector } from 'react-redux';

const useGetLoggedInUser = () => {
  const user = useSelector((state) => state.AuthReducer.userLogindata?.data);
  return user;
};

const useCheckRole = () => {
  const user = useSelector((state) => state.AuthReducer.userLogindata?.data);
  const checkRole=(irole)=>{
    switch(irole){
      case 'maindoctor':
        return (user?.role === 'MainDoctor')
      case 'consultant':
        return (user?.role === 'Consultant')
    }
  }
  
  return checkRole
};

export {useGetLoggedInUser, useCheckRole}