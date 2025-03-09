import React from 'react';
import {
  TextErrorColor,
  TextSecondaryColor,
} from '../../../styles/CommonColorClassNames';

interface FormInputLabelProps {
  error?: string;
  name: string;
  textLabelColor?: string;
  textErrorColor?: string;
  required?: boolean;
  labelText: string;
  className?: string;
}

const FormInputLabel: React.FC<FormInputLabelProps> = ({
  error,
  textLabelColor = `${TextSecondaryColor}`,
  textErrorColor = `${TextErrorColor}`,
  required = false,
  labelText,
  name,
  className = '',
}) => {
  return (
    <label
      htmlFor={name}
      className={`block ml-1 mb-1 ${className} ${textLabelColor} ${
        error ? textErrorColor : ''
      }`}>
      {required ? labelText + '*' : labelText}
    </label>
  );
};

export default FormInputLabel;
