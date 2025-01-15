import React from "react";
import SubmitButton from "./SubmitButton";

interface FormProps {
  title: string;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitDisabled?: boolean;
  isLoading?: boolean;
  submitError?: string | null
  children: React.ReactNode;
}

const Form: React.FC<FormProps> = ({ 
  title, 
  onSubmit, 
  isSubmitDisabled = false, 
  isLoading = false,
  submitError = undefined,
  children 
}) => {
  return (
    <form 
      onSubmit={onSubmit} 
      className="mx-auto p-4 bg-white rounded space-y-4 w-full"
    >
      <h2 className="text-xl font-semibold text-center">{title}</h2>
      <div className="space-y-2">{children}</div>
      <div className="flex flex-col justify-center items-center space-y-2">
        {submitError && <h2 className="text-center text-red-500">{submitError}</h2>}
        <SubmitButton 
          loading={isLoading} 
          disabled={isSubmitDisabled} 
          label={isLoading ? "Submitting..." : "Submit"} 
        />
      </div>
    </form>
  );
};

export default Form;