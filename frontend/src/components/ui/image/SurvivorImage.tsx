import React, { useEffect, useState } from "react";

type ImageSize = 'small' | 'medium' | 'large';
type ImageShape = 'circle' | 'square';

interface ProfileImageProps {
  survivorId: string;
  survivorName: string;
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


const SurvivorImage: React.FC<ProfileImageProps> = ({
    survivorId,
    survivorName,
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
              const response = await api.ImageServiceApi.getProfileImage(profileId, {
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

    }, [])

    const imageClasses = `object-cover ${sizeClasses[size]} ${shapeClasses[shape]} ${className}`;

    return <img src={imageUrl} alt={survivorName} className={imageClasses}
  }

  export default SurvivorImage;