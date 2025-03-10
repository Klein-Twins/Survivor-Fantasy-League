import React from 'react';
import { Tribe } from '../../../../generated-api';
import TribeImage from './TribeImage';

interface TribeViewProps {
  tribe: Tribe;
  className?: string;
}

function TribeView({ tribe, className }: TribeViewProps) {
  if (!className) {
    className = 'w-full flex flex-col space-y-0 shadow-none rounded-sm';
  }
  return (
    <div
      className={`${className}`}
      style={{ backgroundColor: tribe.color.hex, opacity: 0.7 }}>
      <div className='p-2 rounded-md'>
        <TribeImage seasonId={tribe.seasonId} tribeId={tribe.id} />
      </div>
      <h2 className='text-center text-black text-2xl font-bold pt-2 pb-4'>
        {tribe.name}
      </h2>
    </div>
  );
}

export default TribeView;
