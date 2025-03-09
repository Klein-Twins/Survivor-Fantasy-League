import { Button } from '@headlessui/react';
import { Episode } from '../../../../generated-api';
import useForm from '../../../hooks/useForm';
import EpisodeImage from '../../ui/image/EpisodeImage';
import { ButtonPrimaryColors } from '../../../styles/CommonColorClassNames';
import Form from '../../ui/forms/Form';
import FormInputLabel from '../../ui/forms/FormInputLabel';
import FormTextInput from '../../ui/forms/formInputs/formTextInput';
import FormTextAreaInput from '../../ui/forms/formInputs/formTextAreaInput';
import FormTextDateInput from '../../ui/forms/formInputs/FormTextDateInput';
import { format } from 'date-fns';
import { useState } from 'react';
interface EpisodeDisplayProps {
  episode: Episode;
}

const EpisodeDisplay: React.FC<EpisodeDisplayProps> = ({ episode }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEpisode, setEditedEpisode] = useState<Episode | undefined>(
    episode
  );

  const {
    values,
    errors: editEpisodeValidationErrors,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitDisabled,
  } = useForm<EpisodeEditFormData>({
    initialValues: {
      name: episode?.episodeTitle || '',
      description: episode?.episodeDescription || '',
      airDate: new Date(episode.episodeAirDate),
      episode: episode,
    },
    validate: validateEpisodeEdit,
    onSubmit: async (values) => {
      try {
        // Save the updated episode details
        setIsEditing(false);
      } catch (error) {
        console.error('Error updating episode', error);
      }
    },
    requiredFields: [],
  });

  return (
    <div className='flex flex-row space-x-4 justify-start items-start'>
      {/* Episode Image */}
      <div className='flex flex-col w-1/3'>
        <EpisodeImage episodeId={episode.id} className={''} />
      </div>
      {/* Episode Info */}
      <Form onSubmit={handleSubmit}>
        <div className='flex flex-col space-y-4 w-full'>
          {/* Episode Title */}
          <div className='flex flex-row space-x-4 items-end'>
            <FormInputLabel
              labelText='Title'
              name='episodeTitle'
              className='text-xl font-semibold'
            />
            {!isEditing ? (
              <h1 className='text-lg'>
                {episode.episodeTitle && episode.episodeTitle.trim() !== ''
                  ? episode.episodeTitle
                  : 'No Title Provided'}
              </h1>
            ) : (
              <FormTextInput
                name='episodeTitle'
                value={editedEpisode?.episodeTitle || ''}
                onChange={handleChange}
                onBlur={() => handleBlur('name')}
                error={editEpisodeValidationErrors.name}
              />
            )}
          </div>
          {/* Episode Description */}
          <div className='flex flex-row space-x-4 items-end'>
            <FormInputLabel
              labelText='Description'
              name='episodeDescription'
              className='text-xl font-semibold'
            />
            {!isEditing ? (
              <h1 className='text-lg'>
                {episode.episodeDescription
                  ? episode.episodeDescription
                  : 'No Description Provided'}
              </h1>
            ) : (
              <FormTextAreaInput
                name='episodeDescription'
                value={editedEpisode?.episodeDescription || ''}
                onChange={handleChange}
                onBlur={() => handleBlur('description')}
                error={editEpisodeValidationErrors.description}
              />
            )}
          </div>
          {/* Episode Air Date */}
          <div className='flex flex-row space-x-4 w-full items-end whitespace-nowrap'>
            <div className='flex flex-row space-x-4 w-full items-center'>
              <FormInputLabel
                labelText='Air Date'
                name='episodeAirDate'
                className='text-lg font-semibold'
              />
              {!isEditing ? (
                <h1 className='text-lg'>
                  {episode.episodeAirDate
                    ? format(new Date(episode.episodeAirDate), 'MMM dd, yyyy')
                    : 'No Air Date Provided'}
                </h1>
              ) : (
                <FormTextDateInput
                  name='episodeAirDate'
                  value={editedEpisode?.episodeAirDate || ''}
                  onChange={handleChange}
                  onBlur={() => handleBlur('airDate')}
                  error={editEpisodeValidationErrors.airDate}
                />
              )}
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

interface EpisodeEditFormData {
  name?: string;
  description?: string;
  airDate?: Date;
  episode: Episode;
}

const validateEpisodeEdit = (
  values: EpisodeEditFormData
): Partial<Record<keyof EpisodeEditFormData, string>> => {
  const validationErrors: Partial<Record<keyof EpisodeEditFormData, string>> =
    {};

  if (values.name) {
    // Is Episode title alphanumeric and contains space
    const nameRegex = /^[a-zA-Z0-9 ]*$/;
    if (!nameRegex.test(values.name)) {
      validationErrors.name = 'Invalid Episode Title';
    }
  }

  if (values.description) {
    // Is Episode description alphanumeric and contains space
    const descriptionRegex = /^[a-zA-Z0-9 ]*$/;
    if (!descriptionRegex.test(values.description)) {
      validationErrors.description = 'Invalid Episode Description';
    }
  }

  if (values.airDate) {
    // Is Episode Air Date a valid date
    const airDate = new Date(values.airDate);
    if (isNaN(airDate.getTime())) {
      validationErrors.airDate = 'Invalid Air Date';
    }
  }

  return validationErrors;
};

export default EpisodeDisplay;
