// src/components/auth/forms/SignupForm.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import FormInput from "../../ui/forms/FormInput";
import useForm from "../../../hooks/useForm";
import { signupUser } from "../../../store/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { closeModal } from "../../../store/slices/modalSlice";
import SubmitButton from "../../ui/forms/SubmitButton";
import { SignUpFormData, validateSignUp } from "../../../utils/auth/formValidation";

const SignupForm: React.FC = () => {
    const [responseError, setResponseError] = useState<{ message: string; status: number } | null>(null);
    const loading = useSelector((state: RootState) => state.auth.loading);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const onSubmit = async (values: SignUpFormData) => {
        console.log("Form submitted successfully", values);
        try {
            const resultAction = await dispatch(signupUser(values));
            if(signupUser.fulfilled.match(resultAction)) {
                console.log('Signup successful', resultAction.payload);
                dispatch(closeModal());
                navigate("/");
            } else {
                console.error(resultAction.payload);
                setResponseError(resultAction.payload as {message: string; status: number})
            }
        } catch (error) {
            console.error("An unexpected error occurred");
        }
    };

    const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitDisabled } = useForm<SignUpFormData>({
        initialValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            firstName: "",
            lastName: ""
        },
        validate: validateSignUp,
        onSubmit,
        requiredFields: ["username", "email", "password", "confirmPassword"]
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
            {responseError && <p className="text-red-500 text-center py-2">{responseError.message}</p>}
            <SubmitButton loading={loading} disabled={isSubmitDisabled} label="Sign Up" />
        </form>
    );
};

export default SignupForm;