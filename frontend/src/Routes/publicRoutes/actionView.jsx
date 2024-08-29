// YourMainComponent.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AfterActionComponent = ({ content }) => {

  const navi = useNavigate()

  useEffect(()=>{
    setTimeout(() => {
      navi('/')
    }, 2000);
  }, [])

  return (
    <div className="flex items-center justify-center mt-10">
      <div className="flex  items-center space-x-2 p-4 bg-green-500 text-white rounded-full">
        <span>{content}</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-[20vh] w-[10vw]">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h5 className="text-4xl ml-2 font-black">Done !!</h5>
    </div>
  );
};

export default AfterActionComponent;
