import React, { useState } from 'react';
import FormInput from '../../ui/forms/FormInput';

interface FormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
}

const SignupForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: ''
    });

    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
    const [touchedFields, setTouchedFields] = useState<Partial<Record<keyof FormData, boolean>>>({});

    const validateFormData = (data: FormData): Partial<Record<keyof FormData, string>> => {
        const newErrors: Partial<Record<keyof FormData, string>> = {};

        if (data.username.length < 8) {
            newErrors.username = 'Username must be at least 8 characters long';
        }

        if (!/\S+@\S+\.\S+/.test(data.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{9,}$/.test(data.password)) {
            newErrors.password = 'Password must be at least 9 characters long, include at least 1 uppercase letter, 1 lowercase letter, and 1 number';
        }

        if (data.password !== data.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!/^[A-Za-z]*$/.test(data.firstName)) {
            newErrors.firstName = 'First Name can only contain letters';
        }

        if (!/^[A-Za-z]*$/.test(data.lastName)) {
            newErrors.lastName = 'Last Name can only contain letters';
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

            // If the password field is changed and confirmPassword has been touched, validate confirmPassword
            if (name === 'password' && touchedFields.confirmPassword) {
                const confirmPasswordErrors = validateFormData(updatedData);
                setErrors((prev) => ({
                    ...prev,
                    confirmPassword: confirmPasswordErrors.confirmPassword,
                }));
            }
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
        const validationErrors = validateFormData(formData); // Validate all fields on submit
        if (Object.keys(validationErrors).length === 0) {
            console.log("Form submitted successfully", formData);
            // Handle form submission here. Send to API.
        } else {
            setErrors(validationErrors);
            console.log("Form not submitted...", validationErrors);
        }
    };

    const isSubmitDisabled = 
        Object.values(errors).some(error => error !== undefined)  ||
        !formData.username ||
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword;

    return (
        <form onSubmit={handleSubmit} className="mx-auto p-4 bg-white">
            <FormInput
                label="Username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                onBlur={() => handleBlur('username')}
                error={errors.username}
                required
            />
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
            <FormInput
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={() => handleBlur('confirmPassword')}
                error={errors.confirmPassword}
                required
            />
            <FormInput
                label="First Name"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={() => handleBlur('firstName')}
                error={errors.firstName}
            />
            <FormInput
                label="Last Name"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={() => handleBlur('lastName')}
                error={errors.lastName}
            />
            <button type="submit" disabled={isSubmitDisabled} className='w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-400 disabled:hover:bg-blue-500 disabled:opacity-20'>
                Sign Up
            </button>
        </form>
    );
}

export default SignupForm;