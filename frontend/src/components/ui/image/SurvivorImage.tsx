import React from 'react';
import useImage from '../../../hooks/useImage';

interface SurvivorImageProps {
  seasonId: number;
  survivorName: string;
  survivorId: string;
  className?: string;
  imageClassName?: string;
}

const SurvivorImage: React.FC<SurvivorImageProps> = ({
  seasonId,
  survivorName,
  survivorId,
  className = 'w-24 h-24',
  imageClassName = '',
}) => {
  const { imageUrl, isLoading, error } = useImage('survivor', {
    id: survivorId,
    seasonId: seasonId.toString(),
  });

  if (isLoading) {
    return <div className={`animate-pulse bg-gray-200 ${className}`} />;
  }

  if (error) {
    return (
      <div className={`${className}`}>
        <img
          src='/defaultSurvivorImage.jpeg'
          alt='Default Survivor Image'
          className={`object-cover object-top w-full h-full ${imageClassName}`}
        />
      </div>
    );
  }

  return (
    <div className={`${className} relative overflow-hidden`}>
      <img
        src={imageUrl || '/defaultEpisodeImage.jpeg'}
        alt={survivorName}
        className={`object-cover object-top w-full h-full ${imageClassName}`}
        style={{
          aspectRatio: '1 / 1', // Ensures the image is a square
        }}
      />
    </div>
  );
};

export default SurvivorImage;
