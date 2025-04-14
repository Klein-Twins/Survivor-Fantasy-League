import React, { useRef, useState } from 'react';
import { Episode, LeagueMemberSurvey } from '../../../../generated-api';

import { Swiper, SwiperSlide } from 'swiper/react';
// @ts-expect-error
import 'swiper/css';
import EpisodeSurveySlide from './EpisodeSurveySlide';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store/store';

interface EpisodeSwiperProps {
  episodes: Episode[];
  surveys: LeagueMemberSurvey[];
  selectedEpisode: Episode;
  onSelect: (episode: Episode) => void;
}

const EpisodeSwiper: React.FC<EpisodeSwiperProps> = ({
  episodes,
  selectedEpisode,
  surveys,
  onSelect,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const swiperRef = useRef<any>(null); // Reference to the Swiper instance
  const [activeIndex, setActiveIndex] = useState(
    episodes.findIndex((episode) => episode.id === selectedEpisode.id) || 0
  );

  const handleNext = () => {
    if (activeIndex < episodes.length - 1) {
      const newIndex = activeIndex + 1;
      setActiveIndex(newIndex);
      onSelect(episodes[newIndex]); // Update the selected episode
      swiperRef.current?.slideTo(newIndex); // Move the Swiper to the new index
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      const newIndex = activeIndex - 1;
      setActiveIndex(newIndex);
      onSelect(episodes[newIndex]); // Update the selected episode
      swiperRef.current?.slideTo(newIndex); // Move the Swiper to the new index
    }
  };

  const handleSlideChange = (swiper: any) => {
    const newIndex = swiper.activeIndex; // Get the new active index
    setActiveIndex(newIndex); // Update the active index state
    onSelect(episodes[newIndex]); // Call onSelect with the currently visible episode
  };

  const handleSlideClick = (index: number) => {
    setActiveIndex(index); // Update the active index
    onSelect(episodes[index]); // Update the selected episode
    swiperRef.current?.slideTo(index); // Move the Swiper to the clicked slide
  };

  return (
    <div className='relative py-2 flex items-center'>
      {/* Custom Navigation Buttons */}
      <button
        className='custom-prev z-10 text-white hover:text-gray-500 transition-colors px-4 py-4 rounded disabled:bg-gray-400 disabled:cursor-not-allowed'
        style={{ marginRight: '10px' }} // Add spacing between the button and the Swiper
        onClick={handlePrev}
        disabled={activeIndex === 0} // Disable if on the first slide
      >
        <FaArrowLeft />
      </button>

      {/* Swiper Component */}
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        initialSlide={activeIndex} // Set the initial slide to the active index
        onSwiper={(swiper) => (swiperRef.current = swiper)} // Attach Swiper instance to ref
        onSlideChange={handleSlideChange} // Call handleSlideChange on slide change
        style={{ width: '95%' }} // Reduce the width of the Swiper
        allowTouchMove={false} // Disable touch move to prevent swiping
        breakpoints={{
          // When the screen width is >= 640px
          640: {
            slidesPerView: 1, // Show 1 slide
          },
          // When the screen width is >= 768px
          768: {
            slidesPerView: 4, // Show 3 slides
          },
          // When the screen width is >= 1024px
          1024: {
            slidesPerView: 6, // Show 3 slides
          },
        }}>
        {episodes.map((episode, index) => (
          <SwiperSlide
            key={episode.id}
            onClick={() => handleSlideClick(index)} // Handle slide click
          >
            <EpisodeSurveySlide
              episode={episode}
              survey={surveys.find((survey) => survey.episodeId === episode.id)}
              isSelected={episode.id === selectedEpisode.id} // Pass isSelected prop
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        className='custom-prev z-10 text-white hover:text-gray-500 transition-colors px-4 py-4 rounded disabled:bg-gray-400 disabled:cursor-not-allowed'
        style={{ marginLeft: '10px' }} // Add spacing between the button and the Swiper
        onClick={handleNext}
        disabled={activeIndex === episodes.length - 1} // Disable if on the last slide
      >
        <FaArrowRight />
      </button>
    </div>
  );
};

export default EpisodeSwiper;
