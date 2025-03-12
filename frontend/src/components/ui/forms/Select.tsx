import React from 'react';
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

const Select: React.FC<SelectProps> = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  options,
  error,
  required = false,
  className = '',
}) => {
  return (
    <div className={`${className} mb-4`}>
      <label htmlFor={name} className='block mb-1'>
        {required ? label + '*' : label}
      </label>
      <Menu as='div' className='relative inline-block w-full'>
        <div>
          <MenuButton
            className={`inline-flex w-full justify-between gap-x-1.5 p-2 h-10 rounded dark:border-surface-a2-dark dark:bg-surface-a3-dark dark:text-primary-a0-dark focus:outline-none`}>
            {options.find((option) => option.value === value)?.label ||
              'Select an option'}
          </MenuButton>
        </div>

        <MenuItems className='absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md dark:bg-surface-a3-dark dark:text-primary-a1-dark'>
          <div className='py-1'>
            {options.map((option) => (
              <MenuItem
                key={option.value}
                as='button'
                onClick={() =>
                  onChange({
                    target: { name, value: option.value },
                  } as React.ChangeEvent<HTMLSelectElement>)
                }>
                {({ active }: { active: boolean }) => (
                  <span
                    className={`block w-full px-4 py-2 ${
                      active
                        ? 'dark:bg-surface-a4-dark text-primary-a0-dark'
                        : ''
                    }`}>
                    {option.label}
                  </span>
                )}
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Menu>

      {error && <p className='text-red-500 text-sm mt-1'>{error}</p>}
    </div>
  );
};

export default Select;
