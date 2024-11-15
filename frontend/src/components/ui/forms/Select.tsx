import React from "react";

interface Option {
  label: string;
  value: string | number;
}

interface SelectProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: () => void;
  options: Option[];
  error?: string;
  required?: boolean;
  className?: string;
}
// border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
const Select: React.FC<SelectProps> = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  options,
  error,
  required = false,
  className = ''
}) => {
  return (
    <div className={`${className}`}>
      <label htmlFor={name} className="block text-gray-700 mb-1">{required ? label + '*' : label}</label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full p-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-10`}
        required={required}
      >
        <option value="" disabled>
          Select an option
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-red-500 text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;