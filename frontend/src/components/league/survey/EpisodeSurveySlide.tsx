import React from 'react';
import {
  Episode,
  LeagueMemberSurvey,
  SurveyAvailabilityStatus,
  SurveySubmissionStatus,
} from '../../../../generated-api';
import {
  FaCheckCircle,
  FaCircle,
  FaClock,
  FaExclamationCircle,
  FaTimesCircle,
} from 'react-icons/fa';
interface EpisodeSurveySlideProps {
  episode: Episode;
  survey: LeagueMemberSurvey;
  isSelected: boolean; // Add isSelected prop
}

const EpisodeSurveySlide: React.FC<EpisodeSurveySlideProps> = ({
  episode,
  survey,
  isSelected,
}) => {
  const surveyAvailabilityStatus = survey.surveyAvailabilityStatus;
  const surveySubmissionStatus = survey.submissionStatus;

  let reactFaIcon = <FaCircle />;
  let reactFaIconColor = 'text-red-500';
  let reactFaIconText = 'Not Open Yet';

  if (surveyAvailabilityStatus === SurveyAvailabilityStatus.Available) {
    if (surveySubmissionStatus === SurveySubmissionStatus.NotSubmitted) {
      reactFaIcon = <FaExclamationCircle />;
      reactFaIconColor = 'text-yellow-500';
      reactFaIconText = 'Survey Open - Not Submitted';
    } else if (surveySubmissionStatus === SurveySubmissionStatus.Submitted) {
      reactFaIcon = <FaCheckCircle />;
      reactFaIconColor = 'text-green-500';
      reactFaIconText = 'Survey Open - Submitted';
    }
  } else if (surveyAvailabilityStatus === SurveyAvailabilityStatus.Closed) {
    if (surveySubmissionStatus === SurveySubmissionStatus.NotSubmitted) {
      reactFaIcon = <FaTimesCircle />;
      reactFaIconColor = 'text-red-500';
      reactFaIconText = 'Survey Closed - Not Submitted';
    } else if (surveySubmissionStatus === SurveySubmissionStatus.Submitted) {
      reactFaIcon = <FaCheckCircle />;
      reactFaIconColor = 'text-green-500';
      reactFaIconText = 'Survey Closed - Submitted';
    }
  } else if (surveyAvailabilityStatus === SurveyAvailabilityStatus.NotOpenYet) {
    reactFaIcon = <FaCircle />;
    reactFaIconColor = 'text-gray-500';
    reactFaIconText = 'Survey Not Open Yet';
  }

  // Dynamically set the background color based on selection
  const backgroundColor = isSelected
    ? 'bg-blue-500 text-white' // Highlighted background for selected slide
    : 'dark:bg-surface-a4-dark bg-surface-a4-light text-black';

  return (
    <div
      className={`py-4 px-4 text-center rounded-md flex flex-row justify-center space-x-4 items-center ${backgroundColor}`}>
      <h2 className='text-lg font-bold'>Episode {episode.number} Survey </h2>
      <div className={`text-2xl ${reactFaIconColor}`}>{reactFaIcon}</div>
      {/* <p className='text-sm'>{reactFaIconText}</p> */}
    </div>
  );
};

export default EpisodeSurveySlide;
