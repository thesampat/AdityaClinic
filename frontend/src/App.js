import './App.css';
import AllRoutes from './Routes/AllRoutes';
import { useEffect } from 'react';
import AOS from "aos";
import "aos/dist/aos.css";
import { useSelector } from 'react-redux';
import SidePanel from './Components/CommonComponents/SidePanel';
import { ToastContainer, toast } from 'react-toastify';

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
     {window.location.pathname !== '/' &&
      <div className='w-full text-center px-4 mx-2'>
        <p className='text-black font-semibold text-sm'>
          &copy; 2024 Shiven Consultancy Services. All rights reserved.
        </p>
        <p className='text-black font-semibold text-sm'>
          Software designed, developed & maintained by{' '}
          <a className='text-blue-800' href='http://www.shiveninfotech.com' target='_blank' rel='noopener noreferrer'>
            shiveninfotech.com
          </a>
        </p>

      </div>}

      <div className={`Main ${userLoginSuccess ? 'flex' : ''}`}>

        <div className=''>
          {userLoginSuccess && <SidePanel />}
        </div>
        <AllRoutes />
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
