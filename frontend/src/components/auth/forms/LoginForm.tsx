import React from "react";
import FormInput from "../../ui/forms/FormInput";
import useForm from "../../../hooks/useForm";
import { AppDispatch, RootState } from "../../../store/store";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../store/slices/authSlice";
import { closeModal } from "../../../store/slices/modalSlice";
import { LogInFormData, validateLogin } from "../../../utils/auth/formValidation";
import Form from "../../ui/forms/Form";
import { LoginUserRequestBody } from "../../../../generated-api";
import { ApiRequestParams } from "../../../hooks/useApi";

const LoginForm: React.FC = () => {
  const responseError = useSelector((state: RootState) => state.auth.error)?.message;
  const loading = useSelector((state: RootState) => state.auth.loading);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const onSubmit = async (values: LogInFormData) => {

    const loginUserRequestData: ApiRequestParams<LoginUserRequestBody, void> = {
      body: {
        email: values.email,
        password: values.password,
      }
    }



    const resultAction = await dispatch(loginUser(loginUserRequestData));
    if (loginUser.fulfilled.match(resultAction)) {
      dispatch(closeModal());
      navigate("/");
    }
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitDisabled,
  } = useForm<LogInFormData>({
    initialValues: { email: "", password: "" },
    validate: validateLogin,
    onSubmit,
    requiredFields: ["email", "password"],
  });

  return (
    <Form
      title="Log In"
      onSubmit={handleSubmit}
      isSubmitDisabled={isSubmitDisabled}
      submitError={responseError}
      isLoading={loading}
    >
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
    </Form>
  );
};

export default LoginForm;