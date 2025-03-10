import { useState, useEffect, useCallback } from 'react';
import api from '../services/apiContainer';

interface useImageState {
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

type ImageType = 'survivor' | 'tribe';
type ImageParameters = {
  id: string;
  seasonId: string;
};

const useImage = (imageType: ImageType, parameters: ImageParameters) => {
  const [state, setState] = useState<useImageState>({
    imageUrl: null,
    isLoading: false,
    error: null,
  });

  const fetchImage = useCallback(async () => {
    try {
      setState({
        imageUrl: null,
        isLoading: true,
        error: null,
      });

      const cacheInfo = getCacheInfo(imageType, parameters);
      const cache = await caches.open(cacheInfo.name);
      const cachedResponse = await cache.match(cacheInfo.itemLocation);

      if (cachedResponse) {
        const blob = await cachedResponse.blob();
        const url = URL.createObjectURL(blob);
        setState({
          imageUrl: url,
          isLoading: false,
          error: null,
        });
      } else {
        const response = await getImageFetchFunction(imageType)(
          parameters.id,
          parameters.seasonId,
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
        setState({
          imageUrl: url,
          isLoading: false,
          error: null,
        });
        cache.put(cacheInfo.itemLocation, new Response(blob));
      }
    } catch (error) {
      console.error('Failed to load image:', error);
      setState({
        imageUrl: null,
        isLoading: false,
        error: 'Failed to load image',
      });
    }
  }, [imageType, parameters]);

  useEffect(() => {
    fetchImage();
  }, [fetchImage]);

  return { ...state, fetchImage };
};

function getCacheInfo(imageType: ImageType, parameters: ImageParameters) {
  if (imageType === 'survivor') {
    return {
      name: 'survivor-images',
      itemLocation: `/images/survivors/${parameters.id}.jpeg`,
    };
  } else if (imageType === 'tribe') {
    return {
      name: 'tribe-images',
      itemLocation: `/images/tribes/${parameters.id}.jpeg`,
    };
  }

  throw new Error('No cache for image type');
}

function getImageFetchFunction(imageType: ImageType) {
  if (imageType === 'survivor') {
    return api.ImageServiceApi.getSurvivorImage;
  } else if (imageType === 'tribe') {
    return api.ImageServiceApi.getTribeImage;
  }

  throw new Error('No fetch function for image type');
}

export default useImage;
