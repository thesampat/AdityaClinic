import React, { useState, useRef, useEffect } from 'react';

const CustomNameSuggestion = ({ label, options = [], onChange, value, name, placeholder, error, id }) => {
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    onChange?.(event);
    openDropdown();
  };

  const handleOptionClick = (optionValue) => {
    setInputValue(optionValue);
    onChange?.({ target: { name, value: optionValue } });
    closeDropdown();
  };

  const openDropdown = () => {
    setIsOpen(true);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  return (
    <div className="mt-5">
      <label className="text-sm font-medium text-primary-900 mb-1">{label}</label>
      <div className="relative" ref={dropdownRef}>
        <input id={id} type="text" value={inputValue} name={name} onChange={handleInputChange} onFocus={openDropdown} placeholder={placeholder} className="w-full border border-primary-300 text-primary-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 p-2.5" />
        {isOpen && (
          <div className="absolute top-full left-0 w-full bg-white border border-primary-300 rounded-b-lg mt-1 overflow-hidden z-10">
            {options?.map?.((item, index) => (
              <div key={index} className="p-2.5 cursor-pointer hover:bg-primary-100" onClick={() => handleOptionClick(item)}>
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
      <span className="text-xs font-medium text-red-400">{error}</span>
    </div>
  );
};

export default CustomNameSuggestion;
