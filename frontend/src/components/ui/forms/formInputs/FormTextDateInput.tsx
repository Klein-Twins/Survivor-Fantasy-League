import React from 'react';
import {
  InputBackgroundColor,
  InputErrorColors,
} from '../../../../styles/CommonColorClassNames';

interface FormTextDateInputProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  inputBackgroundColor?: string;
  inputErrorColors?: string;
  className?: string;
  error?: string;
  required?: boolean;
}

const FormTextDateInput: React.FC<FormTextDateInputProps> = ({
  name,
  value,
  onChange,
  onBlur,
  inputBackgroundColor = InputBackgroundColor,
  inputErrorColors = InputErrorColors,
  error,
  className = '',
  required = false,
}) => {
  return (
    <input
      type='date'
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className={`
      w-full p-2 
      focus:outline-none 
      ${inputBackgroundColor} 
      ${error ? inputErrorColors : inputBackgroundColor} 
      rounded h-10 ${className}
    `}
      required={required}
    />
  );
};

export default FormTextDateInput;
