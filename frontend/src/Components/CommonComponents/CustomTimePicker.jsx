import React from 'react';

export default function CustomTimePicker({ label, onChange, value, name }) {
  return (
    <div className=" 2">
      <label className=" text-sm font-medium text-primary-900 ">{label}</label>

        {/* input */}
        <input
          value={value}
          type="time"
          name={name}
          id={name}
          onChange={onChange}
          required
          className="w-full border border-primary-300 text-primary-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 p-2.5 "
        />
    </div>
  );
}
