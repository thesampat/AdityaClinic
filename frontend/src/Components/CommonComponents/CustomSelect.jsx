// CustomSelect.jsx
import React, { useState } from 'react';

const CustomSelect = ({ disabled, label, options, onChange, value, name, placeholder, error, id, style, required=false}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (event) => {
    const optionValue = event.target.value; // Extract the value from event.target
    onChange({ target: { name, value: optionValue, id: id } }); // Send the updated value to the parent component
    setIsOpen(false);
  };

  return (
    <div className="mt-0 md:mt-5">
      <label className="text-xs md:text-sm font-medium text-primary-900 mb-1">{label}</label>
      <select required={required} style={style} disabled={disabled} id={id} value={value} name={name} onChange={handleOptionClick} className="w-full border border-primary-300 text-primary-900 text-xs md:text-sm rounded-sm md:rounded-md md:rounded-lg focus:ring-primary-500 focus:border-primary-500 p-0.5 md:p-2.5">
        <option value="" disabled>
          {placeholder}
        </option>
        {options?.map((item, index) => (
          <option id={id} key={index} value={item} className="text-primary-400">
            {item}
          </option>
        ))}
      </select>
      <span className="text-xs font-medium text-red-400">{error}</span>
    </div>
  );
};

export default CustomSelect;
