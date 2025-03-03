import React, { useState } from 'react';
import Form from '../../ui/forms/Form';
import useForm from '../../../hooks/useForm';
import {
  SurvivorFormData,
  validateSurvivorFormData,
} from '../../../utils/admin/SurvivorFormData';
import FormInput from '../../ui/forms/FormInput';

const SurvivorForm: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImageFile(event.target.files[0]);
    }
  };

  const {
    values,
    errors: formValidationError,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitDisabled,
  } = useForm<SurvivorFormData>({
    initialValues: {
      firstName: '',
      lastName: '',
      fromCity: '',
      fromState: '',
      fromCountry: '',
      nickName: '',
      age: 0,
      description: '',
      job: '',
      image: null,
    },
    validate: validateSurvivorFormData,
    onSubmit: (values) => {
      try {
        if (!imageFile) {
          throw new Error('Season logo image is required');
        }
        // seasonService.createSeason({
        //   body: {
        //     seasonNumber: values.seasonNumber,
        //     theme: values.theme,
        //     name: values.seasonName,
        //     location: values.location,
        //     numberOfContestants: values.numberCastaways,
        //     startDate: values.startDate.toString(),
        //     endDate: values.endDate.toString(),
        //     isActive: values.isActive,
        //     seasonLogo: imageFile,
        //   },
        // });
      } catch (error) {
        console.error('Error creating league', error);
      }
    },
    requiredFields: [
      'firstName',
      'lastName',
      'fromState',
      'fromCountry',
      'age',
      'description',
      'job',
      'image',
    ],
  });

  return (
    <Form
      title='Create/Edit Survivor'
      onSubmit={handleSubmit}
      isSubmitDisabled={isSubmitDisabled}>
      <FormInput
        label='First Name'
        name='firstName'
        type='string'
        value={values.firstName}
        onChange={handleChange}
        onBlur={() => handleBlur('firstName')}
        error={formValidationError.firstName}
        required
      />
      <FormInput
        label='Last Name'
        name='lastName'
        type='string'
        value={values.lastName}
        onChange={handleChange}
        onBlur={() => handleBlur('lastName')}
        error={formValidationError.lastName}
        required
      />
      <FormInput
        label='From City'
        name='fromCity'
        type='string'
        value={values.fromCity}
        onChange={handleChange}
        onBlur={() => handleBlur('fromCity')}
        error={formValidationError.fromCity}
      />
      <FormInput
        label='From State'
        name='fromState'
        type='string'
        value={values.fromState}
        onChange={handleChange}
        onBlur={() => handleBlur('fromState')}
        error={formValidationError.fromState}
        required
      />
      <FormInput
        label='From Country'
        name='fromCountry'
        type='string'
        value={values.fromCountry}
        onChange={handleChange}
        onBlur={() => handleBlur('fromCountry')}
        error={formValidationError.fromCountry}
        required
      />
      <FormInput
        label='Nick Name'
        name='nickName'
        type='string'
        value={values.nickName}
        onChange={handleChange}
        onBlur={() => handleBlur('nickName')}
        error={formValidationError.nickName}
      />
      <FormInput
        label='Age'
        name='age'
        type='number'
        value={values.age.toString()}
        onChange={handleChange}
        onBlur={() => handleBlur('age')}
        error={formValidationError.age}
        required
      />
      <FormInput
        label='Description'
        name='description'
        type='string'
        value={values.description}
        onChange={handleChange}
        onBlur={() => handleBlur('description')}
        error={formValidationError.description}
        required
      />
    </Form>
  );
};

export default SurvivorForm;
