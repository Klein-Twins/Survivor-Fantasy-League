import React, { useEffect, useState } from 'react';
import api from '../../../services/apiContainer';

interface LeagueImageProps {
  leagueId: string;
  className?: string;
}

const LeagueImage: React.FC<LeagueImageProps> = ({ leagueId, className }) => {
  const [imageUrl, setImageUrl] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadImage() {
      try {
        setIsLoading(true);
        setError(false);
        const response = await api.imageServiceApi.getLeagueImage(leagueId, {
          withCredentials: true,
          responseType: 'arraybuffer',
          headers: {
            Accept: 'image/jpeg',
            'Content-Type': 'image/jpeg',
          },
        });
        const arrayBuffer = response.data as ArrayBuffer;
        const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
      } catch (error) {
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
  }, [leagueId]);

  const imageClasses = `object-cover ${className}`;

  if (isLoading) {
    return <div className={`animate-pulse bg-gray-200 ${imageClasses}`} />;
  }

  if (error) {
    return (
      <div className={imageClasses}>
        <img
          src='/defaultLeagueImage.jpeg'
          alt='Default League Image'
          className={imageClasses}
        />
      </div>
    );
  }

  return (
    <img src={imageUrl} alt={`Profile ${leagueId}`} className={imageClasses} />
  );
};

export default LeagueImage;
