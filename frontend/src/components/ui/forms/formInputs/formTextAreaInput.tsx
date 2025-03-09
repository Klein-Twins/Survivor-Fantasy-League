import React from 'react';
import {
  InputBackgroundColor,
  InputErrorColors,
} from '../../../../styles/CommonColorClassNames';

interface FormTextAreaInputProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  inputBackgroundColor?: string;
  inputErrorColors?: string;
  className?: string;
  error?: string;
  required?: boolean;
}

const FormTextAreaInput: React.FC<FormTextAreaInputProps> = ({
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
    <textarea
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

export default FormTextAreaInput;
