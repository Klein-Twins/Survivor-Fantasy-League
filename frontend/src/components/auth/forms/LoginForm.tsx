// src/components/auth/forms/LoginForm.tsx
import React from "react";
import FormInput from "../../ui/forms/FormInput";
import useForm from "../../../hooks/useForm";
import { AppDispatch, RootState } from "../../../store/store.ts";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../store/slices/authSlice.ts";
import { closeModal } from "../../../store/slices/modalSlice.ts";
import { LogInFormData, validateLogin } from "../../../utils/auth/formValidation.ts";
import SubmitButton from "../../ui/forms/SubmitButton.tsx";
import { ResponseError } from "../../../types/auth.ts";


const LoginForm: React.FC = () => {

    const responseError = useSelector((state: RootState) => state.auth.error);
    const loading = useSelector((state: RootState) => state.auth.loading);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const onSubmit = async (values: LogInFormData) => {
        const resultAction = await dispatch(loginUser(values));
        if(loginUser.fulfilled.match(resultAction)) {
            dispatch(closeModal());
            navigate("/");
        }
    };

    const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitDisabled } = useForm<LogInFormData>({
        initialValues: { email: "", password: "" },
        validate : validateLogin,
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
            <SubmitButton loading={loading} disabled={isSubmitDisabled} label="Log In" />
        </form>
    );
};

export default LoginForm;