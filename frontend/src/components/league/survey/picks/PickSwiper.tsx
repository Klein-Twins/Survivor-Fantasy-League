import React, { useRef } from 'react';
import {
  LeagueMemberSurvey,
  SurveyAvailabilityStatus,
  SurveySubmissionStatus,
} from '../../../../../generated-api';
import { SurveyPickChoicesMap } from '../Survey';
import { Swiper, SwiperSlide } from 'swiper/react';
import { PickView } from './Picks';
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaTimesCircle,
} from 'react-icons/fa';

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
  allPicksCompleted?: boolean;
}

const PickSwiper: React.FC<PickSwiperProps> = ({
  survey,
  playerChoices,
  handleOptionClick, // Use handleOptionClick from useSurvey
  allPicksCompleted,
  handleSurveySubmit,
}) => {
  const swiperRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);

  return (
    <div className='relative'>
      <div className='absolute top-4 left-0 w-full flex justify-between items-center px-4'>
        {/* Previous Button */}
        <button
          className={`custom-prev z-10 mr-1 rounded-md dark:bg-primary-a0-dark dark:hover:bg-primary-a1-dark transition-colors text-white px-4 py-2 ${
            activeIndex === 0 ? 'invisible' : ''
          }`}
          onClick={() => swiperRef.current?.slidePrev()}>
          <FaArrowLeft />
        </button>

        {/* Next or Submit Button */}
        <button
          className={`custom-next z-10 ml-1 rounded-md dark:bg-primary-a0-dark dark:hover:bg-primary-a1-dark transition-colors disabled:dark:bg-gray-700 text-white px-4 py-2`}
          disabled={
            activeIndex === survey.picks.length - 1 && !allPicksCompleted
          }
          onClick={() => swiperRef.current?.slideNext()}>
          {activeIndex !== survey.picks.length - 1 ? (
            <FaArrowRight />
          ) : allPicksCompleted ? (
            <FaCheckCircle onClick={handleSurveySubmit} />
          ) : (
            <div className='relative group'>
              <FaTimesCircle />
              {/* Tooltip */}
              <div className='absolute bottom-full left-1/2 transform -translate-x-60 -translate-y-3 mb-2 w-max bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                {survey.surveyAvailabilityStatus ===
                SurveyAvailabilityStatus.Closed
                  ? 'Survey is closed an no longer taking submissions.'
                  : survey.surveyAvailabilityStatus ===
                    SurveyAvailabilityStatus.NotOpenYet
                  ? 'Survey is not yet open for submissions'
                  : survey.submissionStatus === SurveySubmissionStatus.Submitted
                  ? 'Survey has already been submitted'
                  : 'Not all survey picks have been selected'}
              </div>
            </div>
          )}
        </button>
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
              showPickInstructions={
                survey.submissionStatus == SurveySubmissionStatus.NotSubmitted
              }
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
              disabled={
                survey.submissionStatus === SurveySubmissionStatus.Submitted ||
                survey.surveyAvailabilityStatus !==
                  SurveyAvailabilityStatus.Available
              }
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PickSwiper;
