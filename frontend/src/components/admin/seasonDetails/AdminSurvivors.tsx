import React from 'react';
import { Survivor } from '../../../../generated-api';
import { Button } from '@headlessui/react';
import { ButtonPrimaryColors } from '../../../styles/CommonColorClassNames';

interface AdminSurvivorsProps {
  survivors: Survivor[];
}

const AdminSurvivors: React.FC<AdminSurvivorsProps> = ({ survivors }) => {
  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-auto'>
        {survivors.length < 18 && (
          <Button
            className={`${ButtonPrimaryColors} text-white text-xl rounded-md w-full col-span-1 md:col-span-2 lg:col-span-3 py-2 `}>
            Create Survivor
          </Button>
        )}
        {survivors.map((survivor) => (
          <SurvivorCard key={survivor.survivorId} survivor={survivor} />
        ))}
      </div>
    </>
  );
};

export default AdminSurvivors;

interface SurvivorCardProps {
  survivor: Survivor;
}

const SurvivorCard: React.FC<SurvivorCardProps> = ({ survivor }) => {
  return (
    <div className='bg-white shadow-md rounded-lg p-4'>
      <h3 className='text-xl font-semibold mb-2'>
        {survivor.firstName} {survivor.lastName}
      </h3>
      <p>
        <span className='font-bold'>Age:</span> {survivor.age}
      </p>
      <p>
        <span className='font-bold'>Nickname:</span> {survivor.nickName}
      </p>
      <p>
        <span className='font-bold'>Job:</span> {survivor.job}
      </p>
      <p>
        <span className='font-bold'>Description:</span> {survivor.description}
      </p>
      <p>
        <span className='font-bold'>From:</span> {survivor.fromCity},{' '}
        {survivor.fromState}, {survivor.fromCountry}
      </p>
    </div>
  );
};
