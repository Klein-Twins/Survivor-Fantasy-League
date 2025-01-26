import React, { useEffect, useState } from 'react';
import { getImageFromS3 } from '../../../utils/aws/s3';

interface ImageProps {
  src: string;
  alt?: string;
}

const Image: React.FC<ImageProps> = (props) => {
  const [imageUrl, setImageUrl] = useState<string>();

  useEffect(() => {
    async function loadImage() {
      try {
        const imageBlob = await getImageFromS3(props.src);
        const url = URL.createObjectURL(imageBlob);
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
