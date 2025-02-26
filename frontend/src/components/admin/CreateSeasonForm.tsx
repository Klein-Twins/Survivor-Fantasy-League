import React from 'react';
import Form from '../ui/forms/Form';
import useForm from '../../hooks/useForm';
import { CreateSeasonFormData } from '../../utils/admin/CreateSeasonFormData';
import validateCreateSeasonForm from '../../utils/league/validateCreateSeasonForm';
import FormInput from '../ui/forms/FormInput';

const CreateSeasonForm: React.FC = () => {
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
    },
    validate: validateCreateSeasonForm,
    onSubmit: (values) => {
      try {
        // const requestData: ApiRequestParams<
        //   CreateLeagueRequestBody,
        //   undefined
        // > = {
        //   body: {
        //     name: values.name,
        //     seasonId: values.seasonId,
        //     profileId: account!.profileId || '',
        //   },
        //   queryParams: undefined,
        // };
        // dispatch(createLeague(requestData));
        console.log('TODO: Implement a create season API call here');
        console.log(values);
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
      />

      <FormInput
        label='Premier Date'
        name='startDate'
        type='date'
        value={values.startDate.toISOString()}
        onChange={handleChange}
        onBlur={() => handleBlur('startDate')}
        error={formValidationError.startDate}
        required
      />

      <FormInput
        label='Finale Date'
        name='endDate'
        type='date'
        value={values.startDate.toISOString()}
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
      />
    </Form>
  );
};

export default CreateSeasonForm;
