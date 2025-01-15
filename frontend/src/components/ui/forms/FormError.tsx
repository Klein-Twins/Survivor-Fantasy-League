import React from "react";

interface FormErrorProps {
    error?: string | null
}

const FormError : React.FC<FormErrorProps> = ({ error }) => {
    if(!error) return null;

    return (
        <p className="text-red-500 text-center py-2 px-4 border border-red-500 rounded-md bg-red-100 w-full">{error}</p>
    );
}

export default FormError;