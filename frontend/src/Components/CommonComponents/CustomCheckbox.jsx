import React from 'react';

export default function CustomCheckbox({ label, checked, onChange, name }) {
  return (
      <label className="flex items-center">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 text-primary-500 border-primary-300 rounded focus:ring-primary-500"
        />
        <span className="ml-1 text-sm text-primary-900 ">{label}</span>
      </label>
  );
}
