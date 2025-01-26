import React from 'react';

interface SubmitButtonProps {
  loading?: boolean;
  disabled?: boolean;
  label: string;
  className?: FormSubmitButtonClassName;
}

export interface FormSubmitButtonClassName {
  backgroundDarkColor?: string;
  hoverBackgroundDarkColor?: string;
  textDarkColor?: string;
}

// const defaultFormSubmitButtonClassName: FormSubmitButtonClassName = {
//   backgroundDarkColor: 'primary-a0-dark',
//   hoverBackgroundDarkColor: 'primary-a1-dark',
//   textDarkColor: 'surface-a1-dark',
// };

const SubmitButton: React.FC<SubmitButtonProps> = ({
  loading,
  disabled,
  label,
  className = {
    backgroundDarkColor: 'dark:bg-primary-a0-dark',
    hoverBackgroundDarkColor: 'dark:hover:bg-primary-a2-dark',
    textDarkColor: 'dark:text-white',
  },
}) => {
  const defaultFormSubmitButtonClassName: FormSubmitButtonClassName = {
    backgroundDarkColor: 'dark:bg-primary-a0-dark',
    hoverBackgroundDarkColor: 'dark:hover:bg-primary-a2-dark',
    textDarkColor: 'dark:text-primary-a5-dark',
  };

  const mergedClassName: FormSubmitButtonClassName = {
    ...defaultFormSubmitButtonClassName,
    ...className,
  };

  return (
    <button
      type='submit'
      disabled={disabled || loading}
      className={`w-full ${mergedClassName.backgroundDarkColor} ${mergedClassName.hoverBackgroundDarkColor} ${mergedClassName.textDarkColor} font-bold p-2 rounded disabled:opacity-20`}>
      {loading ? 'Please Wait...' : label}
    </button>
  );
};

export default SubmitButton;
