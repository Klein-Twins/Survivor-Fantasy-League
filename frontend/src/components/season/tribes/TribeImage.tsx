import React from 'react';
import useImage from '../../../hooks/useImage';

interface TribeImageProps {
  seasonId: number | string;
  tribeId: string;
  className?: string;
  imageClassName?: string;
}

const TribeImage: React.FC<TribeImageProps> = ({
  seasonId,
  tribeId,
  className = 'w-24 h-24',
  imageClassName = 'object-cover w-full h-full',
}) => {
  const { imageUrl, isLoading, error } = useImage('tribe', {
    id: tribeId,
    seasonId: seasonId.toString(),
  });

  if (isLoading) {
    return <div className={`animate-pulse bg-gray-200 ${className}`} />;
  }

  if (error) {
    return (
      <div className={`w-full ${className}`}>
        <img
          src='/defaultTribeImage.jpeg'
          alt='Default Tribe Image'
          className={`object-cover w-full h-full ${imageClassName}`}
        />
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <img
        src={imageUrl || '/defaultTribeImage.jpeg'}
        alt='Tribe'
        className={`object-cover w-full h-full ${imageClassName}`}
      />
    </div>
  );
};

export default TribeImage;
