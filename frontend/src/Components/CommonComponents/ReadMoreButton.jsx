import React from 'react';
import { RiArrowRightSLine } from "react-icons/ri";

export default function ReadMoreButton({ label, onClick }) {
  return (
    <div className="text-center">
      <a className="inline-flex justify-center items-center gap-x-3 text-center bg-gradient-to-tl from-primary-100 to-primary-200 hover:from-primary-200 hover:to-primary-300 shadow-lg shadow-transparent  border border-transparent text-white text-sm font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-primary-200 focus:ring-offset-2 focus:ring-offset-white py-3 px-6 " href="#">
        {label}
        <RiArrowRightSLine />
      </a>
    </div>
  );
}