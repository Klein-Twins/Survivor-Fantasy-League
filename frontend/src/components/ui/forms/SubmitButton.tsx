import React from 'react';
import { ButtonPrimaryColors } from '../../../styles/CommonColorClassNames';

interface SubmitButtonText {
  toSubmitText?: string;
  loadingText?: string;
  errorText?: string;
}

interface SubmitButtonProps {
  loading?: boolean;
  disabled?: boolean;
  label: string;
  className?: string;
  onClick?: () => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  loading,
  disabled,
  label,
  className = 'w-full font-bold p-2 rounded',
  onClick,
}) => {
  return (
    <button
      type='submit'
      disabled={disabled || loading}
      className={`${ButtonPrimaryColors} ${className}`}
      onClick={onClick}>
      {loading ? 'Please Wait...' : label}
    </button>
  );
};

export default SubmitButton;
