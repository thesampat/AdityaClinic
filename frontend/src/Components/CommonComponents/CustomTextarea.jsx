import React from 'react';

export default function CustomTextarea({disabled, label, placeholder, onChange, value, name, error, id = '' }) {
  return (
    <div className="flex flex-col items-start w-full mt-5">
      <label className="text-sm font-medium text-primary-900 mb-1">{label}</label>

      <div className="relative w-full">
        {/* textarea */}
        <textarea
          disabled={disabled}
          value={value}
          name={name}
          id={id}
          placeholder={placeholder}
          onChange={onChange}
          required
          className="w-full border border-primary-300 text-primary-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 p-2.5 resize-vertical" // Add resize-vertical here
          rows="4"
        />
      </div>
      <span className="text-xs font-medium text-red-400 ">{error}</span>
    </div>
  );
}
