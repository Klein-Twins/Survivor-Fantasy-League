import { useDispatch, useSelector } from 'react-redux';
import { CreateLeagueRequestBody } from '../../../../generated-api';
import { ApiRequestParams } from '../../../hooks/useApi';
import useForm from '../../../hooks/useForm';
import {
  CreateLeagueFormData,
  validateCreateLeague,
} from '../../../utils/league/formValidation';
import { AppDispatch, RootState } from '../../../store/store';
import { createLeague } from '../../../store/slices/leagueSlice';
import Form, { FormClassName } from '../../ui/forms/Form';
import FormInput from '../../ui/forms/FormInput';
import Select from '../../ui/forms/Select';
import { closeModal } from '../../../store/slices/modalSlice';
import { CreateLeagueRequestParams } from '../../../services/league/leagueService';

const seasonOptions = [
  { label: 'Season 47', value: '47' },
  { label: 'Season 48', value: '48' },
  { label: 'Season 49', value: '49' },
];

interface CreateLeagueFormProps {
  className?: FormClassName;
}

const CreateLeagueForm: React.FC<CreateLeagueFormProps> = ({ className }) => {
  const dispatch = useDispatch<AppDispatch>();
  const profileId = useSelector(
    (state: RootState) => state.auth.account.profileId
  );
  const selectedSeason = useSelector(
    (state: RootState) => state.season.selectedSeason
  );
  const createLeagueLoading = useSelector(
    (state: RootState) => state.league.loading
  );
  const createLeagueError = useSelector(
    (state: RootState) => state.league.error
  );
  const {
    values,
    errors: formValidationError,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitDisabled,
  } = useForm<CreateLeagueFormData>({
    initialValues: { name: '', seasonId: 47 },
    validate: validateCreateLeague,
    onSubmit: (values) => {
      try {
        const requestData: ApiRequestParams<
          CreateLeagueRequestBody,
          CreateLeagueRequestParams
        > = {
          body: {
            name: values.name,
          },
          queryParams: {
            seasonId: selectedSeason.id,
            profileId: profileId,
          },
        };
        dispatch(createLeague(requestData));
        dispatch(closeModal());
      } catch (error) {
        console.error('Error creating league', error);
      }
    },
    requiredFields: ['name', 'seasonId'],
  });

  return (
    <div className='relative'>
      {/* Form with Input Fields */}
      <Form
        title='Create a new league'
        onSubmit={handleSubmit}
        isSubmitDisabled={isSubmitDisabled || createLeagueLoading}
        submitError={createLeagueError?.error} // Use hook's error state
        isLoading={createLeagueLoading} // Use hook's loading state
        // className={{
        //   formBackgroundColor: 'dark:bg-surface-a4-dark',
        //   formErrorTextColor: 'dark:text-red-500',
        //   formTextColor: 'dark:text-primary-a0-dark,',
        //   formSubmitButtonBackgroundColor: 'dark:bg-primary-a0-dark',
        //   formSubmitButtonHoverBackgroundColor: 'dark:hover:bg-primary-a1-dark',
        //   formSubmitButtonTextColor: 'dark:text-primary-a0-dark',
        // }}>\
      >
        <div className='flex flex-col items-center space-y-2 md:flex-row md:items-start md:space-y-0 md:space-x-2 w-full'>
          <FormInput
            label='Name'
            name='name'
            type='text'
            value={values.name}
            onChange={handleChange}
            onBlur={() => handleBlur('name')}
            error={formValidationError.name}
            required
            className={{
              other: 'w-full md:w-3/4',
            }}
          />
          <Select
            label='Season'
            name='seasonId'
            value={values.seasonId}
            onChange={handleChange}
            options={seasonOptions}
            onBlur={() => handleBlur('seasonId')}
            error={formValidationError.seasonId}
            required
            className='w-full md:w-1/4'
          />
        </div>
      </Form>
    </div>
  );
};

export default CreateLeagueForm;
