import React, { useState } from 'react';
import { Survivor } from '../../../generated-api';
import { PanelBackgroundColor, TextSecondaryColor, TextTertiaryColor } from '../../styles/CommonColorClassNames';

interface SurvivorCardListProps {
  survivors: Survivor[];
}

const SurvivorCardList: React.FC<SurvivorCardListProps> = ({ survivors }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getCardStyle = (index: number) => {
    if (hoveredIndex === null) {
      return {
        marginLeft: index === 0 ? '0' : '-5%', // Reduced from -10% to -5%
        transform: 'scale(1)',
        zIndex: index,
      };
    }

    if (index === hoveredIndex) {
      return {
        marginLeft: index === 0 ? '0' : '-5%',
        transform: 'scale(1.1) translateY(-1rem)',
        zIndex: survivors.length + 1,
      };
    }

    if (index < hoveredIndex) {
      return {
        marginLeft: index === 0 ? '0' : '-5%',
        transform: 'translateX(-4rem)', // Increased from -2rem to -4rem
        zIndex: index,
      };
    }

    return {
      marginLeft: index === 0 ? '0' : '-5%',
      transform: 'translateX(4rem)', // Increased from 2rem to 4rem
      zIndex: index,
    };
  };

  return (
    <div className='mini-card-grid relative w-full overflow-x-auto pt-10 px-8'>
      <div className='flex'>
        {survivors.map((survivor, index) => {
          const location: string = `${survivor.fromCity ? survivor.fromCity + ', ' : ''}${survivor.fromState}, ${
            survivor.fromCountry
          }`;
          return (
            <div
              key={survivor.survivorId}
              className='mini-card flex-none w-[250px] transition-all duration-300'
              style={getCardStyle(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}>
              <div
                className={`${PanelBackgroundColor} rounded-lg overflow-hidden
              shadow-[0_8px_15px_rgba(0,0,0,0.85)]
              hover:shadow-[0_12px_20px_rgba(0,0,0,0.9)]
              transition-all duration-300`}>
                <img
                  src={`http://localhost:3000/${survivor.imageUrl}`}
                  alt={`${survivor.firstName} ${survivor.lastName}`}
                  className='w-full h-48 object-cover'
                />
                <div className='p-6 space-y-3'>
                  <h3 className={`text-xl font-bold ${TextSecondaryColor} `}>
                    {survivor.firstName} {survivor.lastName}
                  </h3>
                  <div className={`flex items-center text-sm ${TextTertiaryColor}`}>
                    <span>{survivor.age}</span>
                    <span className='mx-2'>•</span>
                    <span>{survivor.job}</span>
                  </div>
                  <p className={`text-sm ${TextTertiaryColor}`}>{location}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SurvivorCardList;
