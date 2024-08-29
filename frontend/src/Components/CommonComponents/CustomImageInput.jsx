import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { END_POINT } from '../../Redux/AdminReducer/action';

export default function CustomImageInput({ label, placeholder, onChange, name, res, exist_profile }) {
  return (
    <div className="flex flex-col items-start w-full mt-5">
      <label className="w-32 text-sm font-medium text-primary-900 mb-1">
        {label} <span className="text-green-700">{res}</span>
        {exist_profile && (
          <span>
            <a className="text-blue-600" target="_blank" href={`${END_POINT}/prescription/get/image/${exist_profile}`}>
              View
            </a>
          </span>
        )}
      </label>

      {/* input */}
      <input type={'file'} id={name} accept="image/*" placeholder={placeholder} onChange={onChange} required className="w-full border bg-white border-primary-300 text-primary-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 p-2.5 " />
    </div>
  );
}
