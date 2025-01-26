import React from 'react';

interface FormInputProps {
  label: string;
  name: string;
  type: string;
  value: string;
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
//ark:border-surface-a2-dark dark:bg-surface-a3-dark dark:text-primary-a0-dark

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
        className={`block mb-1 ${mergedClassName.formInputTextDarkColor} ${
          error ? mergedClassName.formInputErrorTextDarkColor : ''
        }`}>
        {required ? label + '*' : label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full p-2  focus:outline-none ${mergedClassName.formInputBackgroundDarkColor} ${
          error ? mergedClassName.formInputErrorBorderDarkColor : mergedClassName.formInputBorderDarkColor
        } rounded h-10`}
        required={required}
      />
      {error && <p className={`${mergedClassName.formInputErrorTextDarkColor} text-sm mt-1`}>{error}</p>}
    </div>
  );
};

export default FormInput;
