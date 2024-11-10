import React from 'react';
import { SurvivorDetails } from '../../types/survivorTypes';

const SurvivorCard: React.FC<{ survivor: SurvivorDetails }> = ({ survivor }) => {
    return (
      <div className="max-w-xs w-11/12 mx-auto bg-white rounded-lg shadow-lg overflow-hidden mb-6">
        <img
          className="w-full h-56 object-cover"
          src={`http://localhost:3000/${survivor.imageUrl}`}
          alt={`${survivor.firstName} ${survivor.lastName}`}
        />
        <div className="p-4">
          <h3 className="text-xl font-semibold">{`${survivor.firstName} ${survivor.lastName}`}</h3>
          <p className="text-gray-600">{survivor.job}</p>
          <p className="text-gray-500 text-sm mt-1">
            {survivor.age} years old
          </p>
          <p className="text-gray-500 text-sm mt-1">
            {survivor.fromCity ? `${survivor.fromCity}, ` : ''}
            {survivor.fromState}, {survivor.fromCountry}
          </p>
        </div>
      </div>
    );
  };

export default SurvivorCard;