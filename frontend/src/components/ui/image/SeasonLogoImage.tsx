import React, { useEffect, useState } from 'react';
import api from '../../../services/apiContainer';

interface SeasonLogoImageProps {
  seasonId: number;
  className?: string;
}

const SeasonLogoImage: React.FC<SeasonLogoImageProps> = ({
  seasonId,
  className,
}) => {
  const [imageUrl, setImageUrl] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadImage() {
      try {
        setIsLoading(true);
        setError(false);
        const response = await api.ImageServiceApi.getSeasonLogoImage(
          seasonId.toString(),
          {
            withCredentials: true,
            responseType: 'arraybuffer',
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
  }, [seasonId]);

  return (
    <div className={`relative ${className}`}>
      {isLoading && <p>Loading...</p>}
      {error && <p>Failed to load image</p>}
      {imageUrl && (
        <img
          src={imageUrl}
          alt={`Season ${seasonId} Logo`}
          className='object-contain w-full h-full'
        />
      )}
    </div>
  );
};

export default SeasonLogoImage;
