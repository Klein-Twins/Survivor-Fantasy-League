import React from 'react';
import { Pick } from '../../../../generated-api';
import PickOptions from './PickOptions';

interface PickItemProps {
  pick: Pick;
}

const PickItem: React.FC<PickItemProps> = ({ pick }) => {
  return (
    <>
      <div className='flex flex-col w-3/4 items-center mx-auto justify-center dark:bg-surface-a2-dark'>
        <h1 className='font-bold text-2xl'>{pick.description}</h1>
        <hr className='w-full dark:border-primary-a1-dark' />
        <PickOptions pickOptions={pick.pickOptions} pickOptionType={pick.pickOptionType} />
      </div>
    </>
  );
};

export default PickItem;
