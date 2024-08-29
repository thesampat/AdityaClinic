import React from 'react';
import Select from 'react-select';

const SelectInput = ({ options, value, onChange, placeholder, label, error, name, disabled = false }) => {
  return (
    <>
      <div className="flex flex-col items-start w-full mt-5">
        <label className="text-sm font-medium text-primary-900 mb-1">{label}</label>
        <Select
          name={name}
          isDisabled={disabled}
          options={options}
          value={options.find((option) => option.value === value) || ''} // Find the selected option by value
          onChange={(selectedOption) => onChange({ target: { value: selectedOption.value, name: name } })} // Send the updated value to the parent component
          placeholder={placeholder}
          id={label}
          className="w-full border border-primary-400 text-black sm:text-sm rounded-md  focus:ring-primary-500 focus:border-primary-500"
        />
        <span className="text-xs font-medium text-red-400 ">{error}</span>
      </div>
    </>
  );
};

export default SelectInput;
