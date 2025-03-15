import React, { useEffect, useState } from 'react';
import api from '../../../servicesBackup/apiContainer';

interface ImageProps {
  src: string;
  alt?: string;
}

const Image: React.FC<ImageProps> = (props) => {
  const [imageUrl, setImageUrl] = useState<string>();

  useEffect(() => {
    async function loadImage() {
      try {
        const response = await api.ImageServiceApi.getProfileImage('');
        // Cast response to Blob since we know the API returns image data
        const blob = new Blob([response as any], { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
      } catch (error) {
        console.error('Failed to load image:', error);
      }
    }

    loadImage();
  }, []);

  return <div>{imageUrl && <img src={props.src} alt='S3 Image' />}</div>;
};

export default Image;
