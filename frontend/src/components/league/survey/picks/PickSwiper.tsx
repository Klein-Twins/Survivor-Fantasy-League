import React, { useRef } from 'react';
import {
  LeagueMemberSurvey,
  SurveySubmissionStatus,
} from '../../../../../generated-api';
import { SurveyPickChoicesMap } from '../Survey';
import { Swiper, SwiperSlide } from 'swiper/react';
import { PickView } from './Picks';
import usePickOptions from '../../../../hooks/survey/usePickOptions';

interface PickSwiperProps {
  survey: LeagueMemberSurvey;
  playerChoices: Map<string, any[]>;
  handleOptionClick: (
    pickId: string,
    item: any,
    getId: (item: any) => string,
    maxNumSelections: number
  ) => void;
  setPlayerChoices: React.Dispatch<React.SetStateAction<SurveyPickChoicesMap>>;
  handleSurveySubmit: () => void;
  surveySubmitted: boolean;
  allPicksCompleted?: boolean;
}

const PickSwiper: React.FC<PickSwiperProps> = ({
  survey,
  playerChoices,
  handleOptionClick, // Use handleOptionClick from useSurvey
  handleSurveySubmit,
  surveySubmitted,
  allPicksCompleted,
}) => {
  const swiperRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);

  return (
    <div className='relative pt-12'>
      {/* Navigation Buttons */}
      <div className='absolute top-0 left-0 w-full flex'>
        <button
          className='custom-prev w-1/2 z-10 mr-1 rounded-md bg-blue-500 text-white py-2 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed'
          onClick={() => swiperRef.current?.slidePrev()}
          disabled={activeIndex === 0}>
          Prev
        </button>
        {activeIndex === survey.picks.length - 1 ? (
          <button
            className='custom-submit w-1/2 ml-1 z-10 rounded-md bg-green-500 text-white py-2 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed'
            onClick={handleSurveySubmit}
            disabled={surveySubmitted || !allPicksCompleted}>
            {surveySubmitted ? 'Survey has been submitted' : 'Submit Survey'}
          </button>
        ) : (
          <button
            className='custom-next w-1/2 ml-1 z-10 rounded-md bg-blue-500 text-white py-2 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed'
            onClick={() => swiperRef.current?.slideNext()}>
            Next
          </button>
        )}
      </div>

      {/* Swiper Component */}
      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        className='h-full'
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}>
        {survey.picks.map((pick) => (
          <SwiperSlide key={pick.id}>
            <PickView
              showPickInstructions={!surveySubmitted}
              pick={pick}
              pickSelection={{
                selectedItems: playerChoices.get(pick.id) || [],
                handleOptionClick: (item, getId) =>
                  handleOptionClick(
                    pick.id,
                    item,
                    getId,
                    pick.options.maxNumSelections
                  ),
                isCompleted:
                  (playerChoices.get(pick.id)?.length || 0) >=
                    pick.options.minNumSelections &&
                  (playerChoices.get(pick.id)?.length || 0) <=
                    pick.options.maxNumSelections,
              }}
              disabled={surveySubmitted}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PickSwiper;
