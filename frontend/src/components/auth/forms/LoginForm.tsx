// src/components/auth/forms/LoginForm.tsx
import React from "react";
import FormInput from "../../ui/forms/FormInput";
import useForm from "../../../hooks/useForm";

interface FormData {
    email: string;
    password: string;
}

const LoginForm: React.FC = () => {
    const validate = (values: FormData) => {
        const errors: Partial<Record<keyof FormData, string>> = {};
        if (!/\S+@\S+\.\S+/.test(values.email)) {
            errors.email = "Please enter a valid email address";
        }
        if (values.password.length === 0) {
            errors.password = "Please enter password";
        }
        return errors;
    };

    const onSubmit = (values: FormData) => {
        console.log("Form submitted successfully", values);
        // Handle form submission, e.g., send to API.
    };

    const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitDisabled } = useForm<FormData>({
        initialValues: { email: "", password: "" },
        validate,
        onSubmit,
        requiredFields: ["email", "password"]
    });

    return (
        <form onSubmit={handleSubmit} className="mx-auto p-4 bg-white">
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
            <button
                type="submit"
                disabled={isSubmitDisabled}
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-400 disabled:hover:bg-blue-500 disabled:opacity-20"
            >
                Log In
            </button>
        </form>
    );
};

export default LoginForm;