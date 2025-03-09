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
  className?: '';
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  loading,
  disabled,
  label,
}) => {
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
