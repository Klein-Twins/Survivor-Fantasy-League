// src/components/auth/forms/LoginForm.tsx
import React, {useState} from "react";
import FormInput from "../../ui/forms/FormInput";
import useForm from "../../../hooks/useForm";
import { AppDispatch, RootState } from "../../../store/store";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../store/slices/authSlice";
import { closeModal } from "../../../store/slices/modalSlice";

export interface LogInFormData {
    email: string;
    password: string;
}

const LoginForm: React.FC = () => {

    const [responseError, setResponseError] = useState<{message: String; status: number} | null>(null);
    const loading = useSelector((state: RootState) => state.auth.loading);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const validate = (values: LogInFormData) => {
        const errors: Partial<Record<keyof LogInFormData, string>> = {};
        if (!/\S+@\S+\.\S+/.test(values.email)) {
            errors.email = "Please enter a valid email address";
        }
        if (values.password.length === 0) {
            errors.password = "Please enter password";
        }
        return errors;
    };

    const onSubmit = async (values: LogInFormData) => {
        console.log("Form submitted successfully", values);
        try {
            const resultAction = await dispatch(loginUser(values));
            if(loginUser.fulfilled.match(resultAction)) {
                console.log('Signin successful', resultAction.payload);
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

    const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitDisabled } = useForm<LogInFormData>({
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
            {responseError && <p className="text-red-500 text-center py-2">{responseError.message}</p>}
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