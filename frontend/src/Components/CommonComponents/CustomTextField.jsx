import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

export default function CustomInput({ label, placeholder, onChange, value, type, name, error, id }) {
  // define states
  const [showPassword, setShowPassword] = useState(false);

  // toggle password
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col items-start w-full mt-5">
      <label className="text-sm font-medium text-primary-900 mb-1">{label}</label>

      <div className="relative w-full">
        {/* input */}
        <input disabled={label == 'Date' ? true : false} value={value} type={showPassword ? 'text' : type} name={name} id={id} placeholder={placeholder} onChange={onChange} required className="w-full border border-primary-300 text-primary-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 p-2.5 " />

        {/* display only for type == password */}
        {/* hide or show password */}
        {type === 'password' && (
          <button type="button" className="absolute inset-y-0 right-0 flex items-center px-3 bg-transparent" onClick={handleTogglePassword}>
            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </button>
        )}
      </div>
      <span className="text-xs font-medium text-red-400 ">{error}</span>
    </div>
  );
}
