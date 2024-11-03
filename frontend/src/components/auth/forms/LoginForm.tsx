import React, { useState } from 'react';
import FormInput from '../../ui/forms/FormInput';

interface FormData {
    email: string;
    password: string;
}


const LoginForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: ''
    })

    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
    const [touchedFields, setTouchedFields] = useState<Partial<Record<keyof FormData, boolean>>>({});

    const validateFormData = (data: FormData): Partial<Record<keyof FormData, string>> => {
        const newErrors: Partial<Record<keyof FormData, string>> = {};

        if (!/\S+@\S+\.\S+/.test(data.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (data.password.length === 0) {
            newErrors.password = 'Please enter password';
        }

        return newErrors;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updatedData = { ...formData, [name]: value };
        setFormData(updatedData);
    
        // Only validate the field that is being changed
        if (touchedFields[name as keyof FormData]) {
            const fieldErrors = validateFormData(updatedData);
            setErrors((prev) => ({
                ...prev,
                [name as keyof FormData]: fieldErrors[name as keyof FormData], // Update the error for the current field
                // Optionally reset errors for other fields if they become valid
                ...(!fieldErrors[name as keyof FormData] ? Object.keys(prev).reduce((acc, key) => {
                    const typedKey = key as keyof FormData;
                    if (prev[typedKey] && !fieldErrors[typedKey]) {
                        acc[typedKey] = undefined; // Clear any existing errors if valid
                    }
                    return acc;
                }, {} as Partial<Record<keyof FormData, string>>) : {})
            }));
        }
    };

    const handleBlur = (name: keyof FormData) => {
        setTouchedFields((prev) => ({ ...prev, [name]: true })); // Mark field as touched
        // Validate only the specific field that was blurred
        const fieldErrors = validateFormData({ ...formData, [name]: formData[name] });
        setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] })); // Set the error for the specific field
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validateFormData(formData);
        if (Object.keys(validationErrors).length === 0) {
            console.log("Form submitted successfully", formData);
            //Handle form submission here. Send to API.
        } else {
            setErrors(validationErrors);
            console.log("Form not submitted...", validationErrors);
        }
    }

    const isSubmitDisabled = 
    Object.values(errors).some(error => error !== undefined)  ||
        !formData.email ||
        !formData.password;

    return (
        <form onSubmit={handleSubmit} className="mx-auto p-4 bg-white">
            <FormInput
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                error={errors.email}
                required
            />
            <FormInput
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={() => handleBlur('password')}
                error={errors.password}
                required
            />
            <button type="submit" disabled={isSubmitDisabled} className='w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-400 disabled:hover:bg-blue-500 disabled:opacity-20'>
                Sign Up
            </button>
        </form>
    )
}

export default LoginForm;