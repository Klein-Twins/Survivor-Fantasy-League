import React, { useRef, useState } from 'react';
import { Episode } from '../../../../generated-api';

import { Swiper, SwiperSlide } from 'swiper/react';
// @ts-expect-error
import 'swiper/css';

interface EpisodeSwiperProps {
  episodes: Episode[];
  selectedEpisode: Episode;
  onSelect: (episode: Episode) => void;
}

const EpisodeSwiper: React.FC<EpisodeSwiperProps> = ({
  episodes,
  selectedEpisode,
  onSelect,
}) => {
  const swiperRef = useRef<any>(null); // Reference to the Swiper instance
  const [activeIndex, setActiveIndex] = useState(0); // Track the active slide index

  const selectedEpisodeIndex = episodes.findIndex(
    (episode) => episode.id === selectedEpisode.id
  );
  const initialIndex =
    selectedEpisodeIndex !== -1 ? selectedEpisodeIndex : episodes.length - 1;

  const handleSlideChange = (swiper: any) => {
    const newIndex = swiper.activeIndex; // Get the new active index
    setActiveIndex(newIndex); // Update the active index state
    onSelect(episodes[newIndex]); // Call onSelect with the currently visible episode
  };

  return (
    <div className='relative py-2 flex items-center'>
      {/* Custom Navigation Buttons */}
      <button
        className='custom-prev z-10 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed'
        style={{ marginRight: '10px' }} // Add spacing between the button and the Swiper
        onClick={() => swiperRef.current?.slidePrev()}
        disabled={activeIndex === 0} // Disable if on the first slide
      >
        Prev
      </button>

      {/* Swiper Component */}
      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        initialSlide={initialIndex} // Set the initial slide to the last one
        onSwiper={(swiper) => (swiperRef.current = swiper)} // Attach Swiper instance to ref
        onSlideChange={handleSlideChange} // Call handleSlideChange on slide change
        style={{ width: '80%' }} // Reduce the width of the Swiper
      >
        {episodes.map((episode) => (
          <SwiperSlide key={episode.id}>
            <h1 className='text-center dark:bg-surface-a0-dark rounded-md py-2'>
              Episode {episode.number}
            </h1>
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        className='custom-next z-10 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed'
        style={{ marginLeft: '10px' }} // Add spacing between the button and the Swiper
        onClick={() => swiperRef.current?.slideNext()}
        disabled={activeIndex === episodes.length - 1} // Disable if on the last slide
      >
        Next
      </button>
    </div>
  );
};

export default EpisodeSwiper;
