import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function DetailsCard({ title, value, icon }) {
  const navigate = useNavigate();
  return (
    <>
      <button
        onClick={(e) => {
          console.log('ey', title);
          let appointment = title;
          if (appointment == "Appointment's") {
          }
        }}
        className="flex justify-between items-center w-[280px] shadow-md bg-white rounded-lg py-6 px-4 hover:bg-blue-300"
      >
        <p>
          <p>{value}</p>
          <strong>{title}</strong>
        </p>

        <button className="bg-primary-500 rounded-full px-3 py-3 ">{icon}</button>
      </button>
    </>
  );
}
