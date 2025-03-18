import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../../../services/apiContainer';

type ImageSize = 'small' | 'medium' | 'large';
type ImageShape = 'circle' | 'square';

interface ProfileImageProps {
  profileId: string;
  size?: ImageSize;
  shape?: ImageShape;
  className?: string;
}

const sizeClasses: Record<ImageSize, string> = {
  small: 'w-16 h-16',
  medium: 'w-12 h-12',
  large: 'w-20 h-20',
};

const shapeClasses: Record<ImageShape, string> = {
  circle: 'rounded-full',
  square: 'rounded-md',
};

const ProfileImage: React.FC<ProfileImageProps> = ({
  profileId,
  size = 'medium',
  shape = 'circle',
  className = '',
}) => {
  const [imageUrl, setImageUrl] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadImage() {
      try {
        setIsLoading(true);
        setError(false);

        console.log('Fetching image for profileId:', profileId);
        //Debug response
        const response = await api.imageServiceApi.getProfileImage(profileId, {
          withCredentials: true,
          responseType: 'arraybuffer', // Enable this
          headers: {
            Accept: 'image/jpeg',
            'Content-Type': 'image/jpeg',
          },
        });
        // const response = await axios.get(`http://localhost:3000/api/image/profile/${profileId}`, {
        //   withCredentials: true,
        //   responseType: 'arraybuffer', // Enable this
        //   headers: {
        //     Accept: 'image/jpeg',
        //     'Content-Type': 'image/jpeg',
        //   },
        // });

        // Cast response.data as ArrayBuffer
        const arrayBuffer = response.data as ArrayBuffer;
        const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        console.debug('Created URL:', url);
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
  }, [profileId]);

  const imageClasses = `object-cover ${sizeClasses[size]} ${shapeClasses[shape]} ${className}`;

  if (isLoading) {
    return <div className={`animate-pulse bg-gray-200 ${imageClasses}`} />;
  }

  if (error) {
    return (
      <div className={imageClasses}>
        <img
          src='/default-avatar.png'
          alt='Default Profile'
          className={imageClasses}
        />
      </div>
    );
  }

  return (
    <img src={imageUrl} alt={`Profile ${profileId}`} className={imageClasses} />
  );
};

export default ProfileImage;
