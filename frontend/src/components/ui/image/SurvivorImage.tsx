import React, { useEffect, useState } from 'react';
import api from '../../../services/apiContainer';

interface SurvivorImageProps {
  seasonId: number;
  survivorName: string;
  survivorId: string;
  className?: string;
}

const SurvivorImage: React.FC<SurvivorImageProps> = ({
  seasonId,
  survivorName,
  survivorId,
  className,
}) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadImage() {
      try {
        setIsLoading(true);
        setError(false);

        const cacheName = 'survivor-images';
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(
          `/images/survivors/${survivorId}.jpeg`
        );

        if (cachedResponse) {
          const blob = await cachedResponse.blob();
          const url = URL.createObjectURL(blob);
          setImageUrl(url);
          setIsLoading(false);
        } else {
          const response = await api.ImageServiceApi.getSurvivorImage(
            survivorId,
            seasonId.toString(),
            {
              withCredentials: true,
              responseType: 'arraybuffer', // Enable this
              headers: {
                Accept: 'image/jpeg',
                'Content-Type': 'image/jpeg',
              },
            }
          );
          const arrayBuffer = response.data as ArrayBuffer;
          const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
          const url = URL.createObjectURL(blob);
          setImageUrl(url);
          cache.put(`/images/survivors/${survivorId}.jpeg`, new Response(blob));
        }
      } catch (error) {
        console.error('Failed to load image:', error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadImage();

    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [seasonId, survivorId]);

  if (isLoading) {
    return <div className={`animate-pulse bg-gray-200 ${className}`} />;
  }

  if (error) {
    return (
      <div className={`w-24 h-24 ${className}`}>
        <img
          src='/defaultEpisodeImage.jpeg'
          alt='Default Survivor Image'
          className='object-cover w-full h-full'
        />
      </div>
    );
  }

  return (
    <div className={`w-24 h-24 ${className}`}>
      <img
        src={imageUrl}
        alt={survivorName}
        className='object-cover w-full h-full'
      />
    </div>
  );
};

export default SurvivorImage;
