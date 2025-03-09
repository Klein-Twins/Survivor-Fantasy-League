import React, { useState } from 'react';
import {
  ButtonPrimaryColors,
  InputBackgroundColor,
  InputErrorColors,
  TextErrorColor,
  TextSecondaryColor,
} from '../../../styles/CommonColorClassNames';
import { SketchPicker } from 'react-color';
import FormInputLabel from './FormInputLabel';

interface FormInputProps<T> {
  label: string;
  showLabel?: boolean;
  name: string;
  type: string;
  value?: string | File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  className?: FormInputClassName;
  ClassName?: string;
  setFieldValue?: (field: keyof T, value: any) => void;
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

const FormInput = <T,>({
  label,
  name,
  showLabel = true,
  type,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  className = {},
  ClassName = '',
  setFieldValue,
}: FormInputProps<T>) => {
  const [fileUploaded, setFileUploaded] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    setFileUploaded(true);
  };

  const mergedClassName = {
    ...defaultFormInputClassName,
    ...className,
  };

  return (
    <div className={`${mergedClassName.other} ${ClassName}`}>
      {showLabel && <FormInputLabel name={name} labelText='Title' />}
      {error && <p className={`${TextErrorColor} text-sm mt-1`}>{error}</p>}
      {type === 'color' && setFieldValue ? (
        <div className='flex justify-center'>
          <SketchPicker
            color={value as string}
            onChangeComplete={(color) =>
              setFieldValue(name as keyof T, color.hex)
            }
          />
        </div>
      ) : type === 'file' ? (
        <div className='flex items-center'>
          <input
            type={type}
            name={name}
            id={name}
            onChange={handleFileChange}
            onBlur={onBlur}
            className='hidden'
            required={required}
          />
          <label
            htmlFor={name}
            className={`${ButtonPrimaryColors} text-sm w-full text-center cursor-pointer text-white py-2 px-4 rounded-md`}>
            {fileUploaded ? 'Uploaded' : 'Choose File'}
          </label>
        </div>
      ) : (
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
            rounded h-10 ${ClassName}
          `}
          required={required}
        />
      )}
    </div>
  );
};

export default FormInput;
