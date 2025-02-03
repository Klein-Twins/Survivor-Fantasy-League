import React from 'react';
import { ButtonPrimaryBgColor, ButtonPrimaryColors } from '../../../styles/CommonColorClassNames';

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
  // className = {
  //   backgroundDarkColor: 'dark:bg-primary-a0-dark',
  //   hoverBackgroundDarkColor: 'dark:hover:bg-primary-a2-dark',
  //   textDarkColor: 'dark:text-white',
  // },
}) => {
  // const defaultFormSubmitButtonClassName: FormSubmitButtonClassName = {
  //   backgroundDarkColor: 'dark:bg-primary-a0-dark',
  //   hoverBackgroundDarkColor: 'dark:hover:bg-primary-a2-dark',
  //   textDarkColor: 'dark:text-primary-a5-dark',
  // };

  // const mergedClassName: FormSubmitButtonClassName = {
  //   ...defaultFormSubmitButtonClassName,
  //   ...className,
  // };

  return (
    <button
      type='submit'
      disabled={disabled || loading}
      className={`${ButtonPrimaryColors} w-full font-bold p-2 rounded`}>
      {loading ? 'Please Wait...' : label}
    </button>
  );
};

export default SubmitButton;
