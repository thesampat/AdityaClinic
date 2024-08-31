import './App.css';
import AllRoutes from './Routes/AllRoutes';
import { useEffect } from 'react';
import AOS from "aos";
import "aos/dist/aos.css";
import { useDispatch, useSelector } from 'react-redux';
import SidePanel from './Components/CommonComponents/SidePanel';
import { ToastContainer, toast } from 'react-toastify';
import { setClinicProfile } from './Redux/AdminReducer/action';

function App() {

  const userLoginSuccess = useSelector((state) => state.AuthReducer.userLoginSuccess)
  const userLoginRole = useSelector((state) => state.AuthReducer.userLoginRole)

  useEffect(() => {
    toast.clearWaitingQueue();
    toast.dismiss();
    AOS.init();
  }, [])

  return (
    <div className='bg-white flex flex-col'>
      <div className={`Main ${userLoginSuccess ? 'flex' : ''}`}>
        <div className=''>
          {userLoginSuccess && <SidePanel />}
        </div>
        <AllRoutes />
        {window.location.pathname !== '/' &&
      <div className='text-blue-400 opacity-1' style={{position:'fixed', bottom:'10px', right:'10px'}}>
        <p className='font-semibold text-sm'>
          &copy; 2024 Shiven Consultancy Services. All rights reserved.
        </p>
        <p className='font-semibold text-sm'>
          Software designed, developed & maintained by{' '}
          <a className='text-blue-800' href='http://www.shiveninfotech.com' target='_blank' rel='noopener noreferrer'>
            shiveninfotech.com
          </a>
        </p>
      </div>
      }
      </div>
      
      <ToastContainer />
    </div>
  );
}

export default App;
