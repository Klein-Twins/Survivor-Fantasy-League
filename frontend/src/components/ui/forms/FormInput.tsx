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
    className?: string
}

const FormInput: React.FC<FormInputProps> = ({
    label, name, type, value, onChange, onBlur, error, required = false,
}) => {
        return (
        <div className="mb-4">
            <label htmlFor={name} className='block text-gray-700 mb-1'>{required ? label + '*' : label}</label>
            <input
                type={type}
                name={name}
                id={name}
                value={value}
                onChange={onChange}
                onBlur = {onBlur}
                className={`w-full p-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded`}
                required={required}
            />
            {error && <p className='text-red-500 text-sm mt-1'>{error}</p>}
        </div>
    );
}

export default FormInput;