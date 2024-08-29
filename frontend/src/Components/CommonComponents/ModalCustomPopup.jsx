import React, { useState, useEffect } from 'react';

const ModalCustom = ({ isShow, setIsShow, content }) => {
  return (
    <>
      {isShow && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
          <div
            className="fixed top-0 left-0 w-full h-full bg-black opacity-50"
            onClick={() => {
              setIsShow(false);
            }}
          ></div>
          <div className="relative z-10 bg-white p-6 rounded-md shadow-md">
            <div className="flex justify-end">
              <button className="text-gray-500 hover:text-gray-700 focus:outline-none" onClick={() => setIsShow(false)} aria-label="Close Modal">
                &times;
              </button>
            </div>
            <div>{content}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalCustom;
