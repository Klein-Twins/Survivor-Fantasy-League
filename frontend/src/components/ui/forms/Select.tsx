import React from "react";

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

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
  return (<div className={`${className} mb-4`}>
      <label htmlFor={name} className="block text-gray-700 mb-1">
        {required ? label + '*' : label}
      </label>
      <Menu as="div" className="relative inline-block w-full">
        <div>
          <MenuButton 
            className={`inline-flex w-full justify-between gap-x-1.5 p-2 h-10 rounded-md bg-white text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500`}
          >
            {options.find(option => option.value === value)?.label || 'Select an option'}
          </MenuButton>
        </div>

        <MenuItems
          className="absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
        >
          <div className="py-1">
            {options.map((option) => (
              <MenuItem key={option.value} onClick={() => onChange({ target: { name, value: option.value } } as React.ChangeEvent<HTMLSelectElement>)}>
                {({ active }: { active: boolean }) => (
                  <button
                    className={`block w-full px-4 py-2 text-sm text-gray-700 ${active ? 'bg-gray-100 text-gray-900' : ''}`}
                  >
                    {option.label}
                  </button>
                )}
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Menu>

      {error && (
        <p className="text-red-500 text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;