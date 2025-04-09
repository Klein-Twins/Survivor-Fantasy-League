import { useState, useEffect, useCallback } from 'react';
import { ImageServiceApi } from '../../generated-api';
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

const SUPPORTED_FORMATS = ['jpeg', 'webp', 'png', 'jpg'];

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

      for (const format of SUPPORTED_FORMATS) {
        const formattedItemLocation = cacheInfo.itemLocation.replace(
          /\.\w+$/,
          `.${format}`
        );
        const cachedResponse = await cache.match(formattedItemLocation);

        if (cachedResponse) {
          const blob = await cachedResponse.blob();
          const url = URL.createObjectURL(blob);
          setState({
            imageUrl: url,
            isLoading: false,
            error: null,
          });
          return;
        }

        try {
          const response = await getImageFetchFunction(imageType)(
            parameters.id,
            parameters.seasonId,
            {
              withCredentials: true,
              responseType: 'arraybuffer',
              headers: {
                Accept: `image/${format}`,
                'Content-Type': `image/${format}`,
              },
            }
          );

          const arrayBuffer = response.data as ArrayBuffer;
          const blob = new Blob([arrayBuffer], { type: `image/${format}` });
          const url = URL.createObjectURL(blob);

          setState({
            imageUrl: url,
            isLoading: false,
            error: null,
          });

          cache.put(formattedItemLocation, new Response(blob));
          return;
        } catch (error) {
          console.warn(`Failed to fetch image in format ${format}:`, error);
        }
      }

      throw new Error('Image not found in any supported format');
    } catch (error) {
      console.error('Failed to load image:', error);
      setState({
        imageUrl: null,
        isLoading: false,
        error: 'Failed to load image',
      });
    }
  }, [imageType, parameters.id, parameters.seasonId]);

  useEffect(() => {
    fetchImage();
  }, [fetchImage, imageType, parameters.id, parameters.seasonId]);

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
    return api.imageServiceApi.getSurvivorImage.bind(api.imageServiceApi); // Ensure `bind` is used
  } else if (imageType === 'tribe') {
    return api.imageServiceApi.getTribeImage.bind(api.imageServiceApi);
  }

  throw new Error('No fetch function for image type');
}

export default useImage;
