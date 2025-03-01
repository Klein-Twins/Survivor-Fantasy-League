import React, { useState } from 'react';
import Form from '../ui/forms/Form';
import useForm from '../../hooks/useForm';
import { CreateSeasonFormData } from '../../utils/admin/CreateSeasonFormData';
import validateCreateSeasonForm from '../../utils/league/validateCreateSeasonForm';
import FormInput from '../ui/forms/FormInput';
import seasonService from '../../services/season/seasonService';

const CreateSeasonForm: React.FC = () => {
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
  } = useForm<CreateSeasonFormData>({
    initialValues: {
      seasonNumber: 48,
      theme: '',
      seasonName: '',
      location: 'Mamanuca Islands, Fiji',
      numberCastaways: 18,
      startDate: new Date(),
      endDate: new Date(),
      isActive: false,
      seasonLogo: null,
    },
    validate: validateCreateSeasonForm,
    onSubmit: (values) => {
      try {
        if (!imageFile) {
          throw new Error('Season logo image is required');
        }
        seasonService.createSeason({
          body: {
            seasonNumber: values.seasonNumber,
            theme: values.theme,
            name: values.seasonName,
            location: values.location,
            numberOfContestants: values.numberCastaways,
            startDate: values.startDate.toString(),
            endDate: values.endDate.toString(),
            isActive: values.isActive,
            seasonLogo: imageFile,
          },
        });
      } catch (error) {
        console.error('Error creating league', error);
      }
    },
    requiredFields: [
      'seasonNumber',
      'startDate',
      'endDate',
      'location',
      'numberCastaways',
    ],
  });
  return (
    <Form
      title='Create a new season'
      onSubmit={handleSubmit}
      isSubmitDisabled={isSubmitDisabled}>
      <FormInput
        label='Season Number'
        name='seasonNumber'
        type='number'
        value={values.seasonNumber.toString()}
        onChange={handleChange}
        onBlur={() => handleBlur('seasonNumber')}
        error={formValidationError.seasonNumber}
        required
      />

      <FormInput
        label='Season Name'
        name='seasonName'
        type='string'
        value={values.seasonName || ''}
        onChange={handleChange}
        onBlur={() => handleBlur('seasonName')}
        error={formValidationError.seasonName}
        required
      />

      <FormInput
        label='Premier Date'
        name='startDate'
        type='date'
        value={values.startDate.toString()}
        onChange={handleChange}
        onBlur={() => handleBlur('startDate')}
        error={formValidationError.startDate}
        required
      />

      <FormInput
        label='Finale Date'
        name='endDate'
        type='date'
        value={values.endDate.toString()}
        onChange={handleChange}
        onBlur={() => handleBlur('endDate')}
        error={formValidationError.endDate}
        required
      />

      <FormInput
        label='Location'
        name='location'
        type='string'
        value={values.location}
        onChange={handleChange}
        onBlur={() => handleBlur('location')}
        error={formValidationError.location}
        required
      />

      <FormInput
        label='Number of Castaways'
        name='numberCastaways'
        type='number'
        value={values.numberCastaways.toString()}
        onChange={handleChange}
        onBlur={() => handleBlur('numberCastaways')}
        error={formValidationError.numberCastaways}
        required
      />

      <FormInput
        label='Theme'
        name='theme'
        type='string'
        value={values.theme || ''}
        onChange={handleChange}
        onBlur={() => handleBlur('theme')}
        error={formValidationError.theme}
        required
      />

      <FormInput
        label='Active'
        name='isActive'
        type='checkbox'
        value={values.isActive.toString()}
        onChange={handleChange}
        onBlur={() => handleBlur('isActive')}
        error={formValidationError.isActive}
        required
      />
      <FormInput
        label='Season Logo'
        name='seasonLogo'
        type='file'
        onChange={handleImageChange}
        onBlur={() => handleBlur('seasonLogo')}
        error={imageFile ? '' : 'Season logo image is required'}
        required
      />
    </Form>
  );
};

export default CreateSeasonForm;
