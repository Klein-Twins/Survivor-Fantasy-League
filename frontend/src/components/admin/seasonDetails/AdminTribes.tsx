import React from 'react';
import { Tribe } from '../../../../generated-api';
import {
  ButtonPrimaryColors,
  ButtonSubtleColors,
  ElementBackgroundColor,
} from '../../../styles/CommonColorClassNames';
import { Button } from '@headlessui/react';
import Form from '../../ui/forms/Form';
import FormInput from '../../ui/forms/FormInput';
import {
  TribeFormData,
  validateTribeFormData,
} from '../../../utils/admin/TribeFormData';
import useForm from '../../../hooks/useForm';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { useParams } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { openModal } from '../../../store/slices/modalSlice';
import { SketchPicker } from 'react-color';
import tribeService from '../../../services/season/tribe/tribeService';

interface AdminTribesProps {
  tribes: Tribe[];
}

const AdminTribes: React.FC<AdminTribesProps> = ({ tribes }) => {
  const [isCreateTribeFormOpen, setIsCreateTribeFormOpen] =
    React.useState(false);

  return (
    <>
      <h2 className='text-xl text-center font-semibold'>Pre-Merge</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {tribes.map((tribe) => {
          return (
            !tribe.isMergeTribe && <TribeCard key={tribe.id} tribe={tribe} />
          );
        })}
        {tribes.filter((tribe) => !tribe.isMergeTribe).length < 5 && (
          <AddTribeButton isMerge={false} />
        )}
      </div>
      <h2 className='text-xl text-center font-semibold'>Post-Merge</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {tribes.map((tribe) => {
          return (
            tribe.isMergeTribe && <TribeCard key={tribe.id} tribe={tribe} />
          );
        })}
        {tribes.filter((tribe) => tribe.isMergeTribe).length < 1 && (
          <AddTribeButton isMerge={true} />
        )}
      </div>
    </>
  );
};

export default AdminTribes;

interface AddTribeButtonProps {
  isMerge: boolean;
}

const AddTribeButton: React.FC<AddTribeButtonProps> = ({ isMerge }) => {
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(
      openModal({ type: 'createTribe', props: { isMergeTribe: isMerge } })
    );
  };

  return (
    <Button
      onClick={handleClick}
      className={`${ButtonPrimaryColors} w-full text-xl rounded-md flex items-center justify-center`}>
      <FaPlus className='mr-2' />
    </Button>
  );
};

interface TribeCardProps {
  tribe: Tribe;
}

const TribeCard: React.FC<TribeCardProps> = ({ tribe }) => {
  return (
    <>
      <div
        className={`flex justify-between items-center ${ElementBackgroundColor} shadow-md rounded-md w-full p-4`}>
        <h3 className='text-xl text-center font-semibold'>{tribe.name}</h3>
        <Button className={`${ButtonSubtleColors} text-lg rounded-md p-2`}>
          Edit
        </Button>
        {/* Put Survivor Images here. */}
      </div>
    </>
  );
};

interface CreateTribeFormProps {
  isMergeTribe: boolean;
}

export const CreateTribeForm: React.FC<CreateTribeFormProps> = ({
  isMergeTribe,
}) => {
  const { seasonId } = useParams<{ seasonId: string }>();
  const {
    values,
    errors: formValidationError,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitDisabled,
    setFieldValue,
  } = useForm<TribeFormData>({
    initialValues: {
      name: '',
      color: '',
      episodeStarted: 0,
      isMergeTribe: isMergeTribe,
    },
    validate: validateTribeFormData,
    onSubmit: async (values) => {
      try {
        console.log(values);
        await tribeService.createTribe(Number(seasonId), values);
      } catch (error) {
        console.error('Error creating league', error);
      }
    },
    requiredFields: ['name', 'color', 'episodeStarted'],
  });
  return (
    <Form
      onSubmit={handleSubmit}
      isSubmitDisabled={isSubmitDisabled}
      title='Create Tribe'>
      <FormInput
        label='Name'
        name='name'
        type='string'
        value={values.name}
        onChange={handleChange}
        onBlur={() => handleBlur('name')}
        error={formValidationError.name}
      />
      <FormInput
        label='Color'
        name='color'
        type='string'
        value={values.color}
        onChange={handleChange}
        onBlur={() => handleBlur('color')}
        error={formValidationError.color}
      />
      <FormInput
        label='Episode Started'
        name='episodeStarted'
        type='string'
        value={values.episodeStarted.toString()}
        onChange={handleChange}
        onBlur={() => handleBlur('episodeStarted')}
        error={formValidationError.episodeStarted}
      />
      <FormInput
        label='Color'
        name='color'
        type='color'
        value={values.color}
        onChange={handleChange}
        onBlur={() => handleBlur('color')}
        error={formValidationError.color}
        setFieldValue={setFieldValue} // Add this line
        ClassName={'mx-auto'}
      />
      {/* <FormInput
        label='Is Merge Tribe'
        name='isMergeTribe'
        type='checkbox'
        value={values.isMergeTribe.toString()}
        onChange={handleChange}
        onBlur={() => handleBlur('isMergeTribe')}
        error={formValidationError.isMergeTribe}
      /> */}
    </Form>
  );
};
