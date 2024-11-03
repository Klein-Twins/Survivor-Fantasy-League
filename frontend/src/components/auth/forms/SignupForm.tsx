// src/components/auth/forms/SignupForm.tsx
import React from "react";
import FormInput from "../../ui/forms/FormInput";
import useForm from "../../../hooks/useForm";

interface FormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
}

const SignupForm: React.FC = () => {
    const validate = (values: FormData) => {
        const errors: Partial<Record<keyof FormData, string>> = {};

        if (values.username.length < 8) {
            errors.username = "Username must be at least 8 characters long";
        }
        if (!/\S+@\S+\.\S+/.test(values.email)) {
            errors.email = "Please enter a valid email address";
        }
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{9,}$/.test(values.password)) {
            errors.password = "Password must be at least 9 characters long, include at least 1 uppercase letter, 1 lowercase letter, and 1 number";
        }
        if (values.password !== values.confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
        }
        if (!/^[A-Za-z]*$/.test(values.firstName)) {
            errors.firstName = "First Name can only contain letters";
        }
        if (!/^[A-Za-z]*$/.test(values.lastName)) {
            errors.lastName = "Last Name can only contain letters";
        }

        return errors;
    };

    const onSubmit = (values: FormData) => {
        console.log("Form submitted successfully", values);
        // Handle form submission, e.g., send to API.
    };

    const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitDisabled } = useForm<FormData>({
        initialValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            firstName: "",
            lastName: ""
        },
        validate,
        onSubmit,
    });

    return (
        <form onSubmit={handleSubmit} className="mx-auto p-4 bg-white">
            <FormInput
                label="Username"
                name="username"
                type="text"
                value={values.username}
                onChange={handleChange}
                onBlur={() => handleBlur("username")}
                error={errors.username}
                required
            />
            <FormInput
                label="Email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={() => handleBlur("email")}
                error={errors.email}
                required
            />
            <FormInput
                label="Password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={() => handleBlur("password")}
                error={errors.password}
                required
            />
            <FormInput
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={() => handleBlur("confirmPassword")}
                error={errors.confirmPassword}
                required
            />
            <FormInput
                label="First Name"
                name="firstName"
                type="text"
                value={values.firstName}
                onChange={handleChange}
                onBlur={() => handleBlur("firstName")}
                error={errors.firstName}
            />
            <FormInput
                label="Last Name"
                name="lastName"
                type="text"
                value={values.lastName}
                onChange={handleChange}
                onBlur={() => handleBlur("lastName")}
                error={errors.lastName}
            />
            <button
                type="submit"
                disabled={isSubmitDisabled}
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-400 disabled:hover:bg-blue-500 disabled:opacity-20"
            >
                Sign Up
            </button>
        </form>
    );
};

export default SignupForm;