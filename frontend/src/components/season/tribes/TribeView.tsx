import React from 'react';
import { Tribe } from '../../../../generated-api';

interface TribeViewProps {
  tribe: Tribe;
  className?: string;
}

function TribeView({ tribe, className }: TribeViewProps) {
  if (!className) {
    className = 'w-full';
  }
  return (
    <div className={className} style={{ backgroundColor: tribe.color.hex }}>
      <h2 className='text-2xl font-bold mb-2'>{tribe.name}</h2>
      <p className='text-lg mb-4'>{tribe.color.color}</p>
      <div className='w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center'>
        <img
          src={tribe.imageUrl}
          alt={`${tribe.name} Tribe`}
          className='w-full h-full object-cover rounded-full'
        />
      </div>
    </div>
  );
}

export default TribeView;
