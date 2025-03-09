import React from 'react';
import SubmitButton from './SubmitButton';
import { DefaultClassName } from './FormInput';
import { TextErrorColor } from '../../../styles/CommonColorClassNames';

interface FormProps {
  title?: string;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitDisabled?: boolean;
  isLoading?: boolean;
  submitError?: string | null;
  children: React.ReactNode;
  className?: FormClassName;
}

export interface FormClassName extends DefaultClassName {
  formBackgroundDarkColor?: string;
  formErrorTextDarkColor?: string;
  formTextDarkColor?: string;
  formSubmitButtonClassName?: FormSubmitButtonClassName;
}

const defaultFormClassName: FormClassName = {
  formBackgroundDarkColor: 'dark:bg-surface-a1-dark',
  formErrorTextDarkColor: 'dark:text-red-500',
  formTextDarkColor: 'dark:text-primary-a0-dark',
  formSubmitButtonClassName: undefined,
};

interface SubmitButtonText {
  submitButtonSubmitText?: string;
  submitButtonLoadingText?: string;
  submitButtonErrorText?: string;
  submitButton;
}

const Form: React.FC<FormProps> = ({
  title,
  onSubmit,
  isSubmitDisabled = false,
  isLoading = false,
  submitError = undefined,
  children,
  className = {},
}) => {
  const mergedClassName: FormClassName = {
    ...defaultFormClassName,
    ...className,
  };

  return (
    <form
      onSubmit={onSubmit}
      className={`mx-auto p-4 rounded space-y-4 w-full `}>
      {title && (
        <>
          <h2 className='text-xl font-semibold text-center'>{title}</h2>
          <hr className='w-1/4 mx-auto' />
        </>
      )}
      <div className='space-y-2'>{children}</div>
      <div className='flex flex-col justify-center items-center space-y-2'>
        {submitError && (
          <h2 className={`text-center ${TextErrorColor}`}>{submitError}</h2>
        )}
        <SubmitButton
          className={mergedClassName.formSubmitButtonClassName}
          loading={isLoading}
          disabled={isSubmitDisabled}
          label={isLoading ? 'Submitting...' : 'Submit'}
        />
      </div>
    </form>
  );
};

export default Form;
