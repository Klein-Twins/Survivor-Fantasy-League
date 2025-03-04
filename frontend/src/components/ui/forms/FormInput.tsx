import React from 'react';
import {
  InputBackgroundColor,
  InputErrorColors,
  TextErrorColor,
  TextSecondaryColor,
} from '../../../styles/CommonColorClassNames';

interface FormInputProps {
  label: string;
  name: string;
  type: string;
  value?: string | File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  className?: FormInputClassName;
}

interface FormInputClassName extends DefaultClassName {
  formInputErrorTextDarkColor?: string;
  formInputTextDarkColor?: string;
  formInputBorderDarkColor?: string;
  formInputErrorBorderDarkColor?: string;
  formInputBackgroundDarkColor?: string;
}

export interface DefaultClassName {
  other?: string;
}

const defaultFormInputClassName: FormInputClassName = {
  formInputErrorTextDarkColor: 'dark:text-red-500',
  formInputTextDarkColor: 'dark:text-primary-a0-dark',
  formInputBorderDarkColor: 'dark:border-surface-a2-dark',
  formInputErrorBorderDarkColor: 'dark:border-red-500',
  formInputBackgroundDarkColor: 'dark:bg-surface-a3-dark',
};

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  className = {},
}) => {
  const mergedClassName = {
    ...defaultFormInputClassName,
    ...className,
  };

  return (
    <div className={`${mergedClassName.other}`}>
      <label
        htmlFor={name}
        className={`block mb-1 ${TextSecondaryColor} ${
          error ? TextErrorColor : ''
        }`}>
        {required ? label + '*' : label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        value={type !== 'file' ? (value as string) : undefined}
        onChange={onChange}
        onBlur={onBlur}
        className={`
          w-full p-2 
          focus:outline-none 
          ${InputBackgroundColor} 
          ${error ? InputErrorColors : InputBackgroundColor} 
          rounded h-10
        `}
        required={required}
      />
      {error && <p className={`${TextErrorColor} text-sm mt-1`}>{error}</p>}
    </div>
  );
};

export default FormInput;
