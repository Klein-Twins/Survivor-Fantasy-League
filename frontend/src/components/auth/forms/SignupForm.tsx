// src/components/auth/forms/SignupForm.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

import FormInput from '../../ui/forms/FormInput';
import useForm from '../../../hooks/useForm';
import { signupUser } from '../../../store/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { closeModal } from '../../../store/slices/modalSlice';
import {
  SignUpFormData,
  validateSignUp,
} from '../../../utils/auth/formValidation';
import Form from '../../ui/forms/Form';
import { SignupUserRequestBody } from '../../../../generated-api';
import { ApiRequestParams } from '../../../hooks/useApi';

const SignupForm: React.FC = () => {
  const responseError = useSelector(
    (state: RootState) => state.auth.error
  )?.message;
  const loading = useSelector((state: RootState) => state.auth.loading);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const onSubmit = async (values: SignUpFormData) => {
    const signupUserRequestData: ApiRequestParams<SignupUserRequestBody, void> =
      {
        body: {
          username: values.username,
          email: values.email,
          password: values.password,
          firstName: values.firstName,
          lastName: values.lastName,
        },
      };
    const resultAction = await dispatch(signupUser(signupUserRequestData));
    if (signupUser.fulfilled.match(resultAction)) {
      dispatch(closeModal());
      navigate('/');
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
  } = useForm<SignUpFormData>({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
    },
    validate: validateSignUp,
    onSubmit,
    requiredFields: ['username', 'email', 'password', 'confirmPassword'],
  });

  return (
    <Form
      title='Signup'
      onSubmit={handleSubmit}
      isSubmitDisabled={isSubmitDisabled}
      isLoading={loading}
      submitError={responseError}>
      <FormInput
        label='Username'
        name='username'
        type='text'
        value={values.username}
        onChange={handleChange}
        onBlur={() => handleBlur('username')}
        error={errors.username}
        required
      />
      <FormInput
        label='Email'
        name='email'
        type='email'
        value={values.email}
        onChange={handleChange}
        onBlur={() => handleBlur('email')}
        error={errors.email}
        required
      />
      <FormInput
        label='Password'
        name='password'
        type='password'
        value={values.password}
        onChange={handleChange}
        onBlur={() => handleBlur('password')}
        error={errors.password}
        required
      />
      <FormInput
        label='Confirm Password'
        name='confirmPassword'
        type='password'
        value={values.confirmPassword}
        onChange={handleChange}
        onBlur={() => handleBlur('confirmPassword')}
        error={errors.confirmPassword}
        required
      />
      <FormInput
        label='First Name'
        name='firstName'
        type='text'
        value={values.firstName}
        onChange={handleChange}
        onBlur={() => handleBlur('firstName')}
        error={errors.firstName}
      />
      <FormInput
        label='Last Name'
        name='lastName'
        type='text'
        value={values.lastName}
        onChange={handleChange}
        onBlur={() => handleBlur('lastName')}
        error={errors.lastName}
      />
    </Form>
  );
};

export default SignupForm;
