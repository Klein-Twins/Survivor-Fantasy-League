import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';
import leagueSurveyService, {
  GetCurrentEpisodeSurveysParams,
} from '../../../../services/league/leagueSurveyService';
import {
  GetCurrentEpisodSurveysResponse,
  League,
  SurveySubmissionStatus,
} from '../../../../../generated-api';
import { useApi } from '../../../../hooks/useApi';
import Panel from '../../../ui/panels/Panel';
import { HorizontalLinePrimaryColors } from '../../../../styles/CommonColorClassNames';

const AlertPanel: React.FC = () => {
  const leagueState = useSelector((state: RootState) => state.league);
  const authState = useSelector((state: RootState) => state.auth);

  const {
    data: nextEpisodeLeagueSurveys,
    isLoading: nextEpisodeLeagueSurveysIsLoading,
    error: nextEpisodeLeagueSurveysError,
    execute: getNextEpisodeLeagueSurveys,
  } = useApi<
    void,
    GetCurrentEpisodeSurveysParams,
    GetCurrentEpisodSurveysResponse
  >(leagueSurveyService.getCurrentEpisodeLeagueSurveys);

  useEffect(() => {
    async function fetchNextEpisodeLeagueSurveys() {
      if (leagueState.leagues.length === 0 || !authState.account?.profileId) {
        return;
      }
      await getNextEpisodeLeagueSurveys({
        queryParams: {
          profileId: authState.account?.profileId,
          leagueIds: leagueState.leagues.map(
            (league: League) => league.leagueId
          ),
        },
      });
    }
    fetchNextEpisodeLeagueSurveys();
  }, [leagueState.leagues, authState.account.profileId]);

  if (nextEpisodeLeagueSurveysIsLoading || nextEpisodeLeagueSurveysError) {
    return null;
  }
  if (!nextEpisodeLeagueSurveys || !nextEpisodeLeagueSurveys.responseData) {
    return null;
  }

  const pendingSurveyAlerts =
    nextEpisodeLeagueSurveys.responseData.leagueSurveys.map((leagueSurvey) => {
      if (leagueSurvey.submissionStatus === SurveySubmissionStatus.NotStarted) {
        const league = leagueState.leagues.find(
          (league) => league.leagueId === leagueSurvey.leagueId
        );
        const leagueName = league.name;
        const episodeNumber = leagueSurvey.episode.episodeNumber;
        const episodeAirDate = leagueSurvey.episode.episodeAirDate;

        return (
          <PendingSurveyAlert
            leagueName={leagueName}
            episodeNumber={episodeNumber}
            episodeAirDate={episodeAirDate}
          />
        );
      }
    });

  return (
    <Panel
      header='Alerts'
      actions={
        <FaTimes className='text-3xl text-primary-a1-light dark:text-primary-a1-dark hover:text-primary-a3-light hover:dark:text-primary-a4-dark cursor-pointer' />
      }>
      {pendingSurveyAlerts.length === 0 ? (
        <div className='text-center'>No alerts available</div>
      ) : (
        pendingSurveyAlerts.map((alert) => (
          <div key={Math.random()}>{alert}</div>
        ))
      )}
    </Panel>
  );
};

export default AlertPanel;

interface PendingSurveyAlertProps {
  leagueName: string;
  episodeNumber: string | number;
  episodeAirDate: string | Date;
}

const PendingSurveyAlert: React.FC<PendingSurveyAlertProps> = ({
  episodeAirDate,
  episodeNumber,
  leagueName,
}) => {
  const formattedDate = episodeAirDate.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  return (
    <div className='w-full py-2 dark:bg-surface-a1-dark bg-surface-a1-light rounded-md relative'>
      <FaTimes className='absolute top-4 right-4 dark:text-amber-400 dark:hover:text-amber-600 text-orange-700 hover:text-orange-900 text-2xl' />
      <div className='flex flex-col space-y-2 items-center'>
        <div className='flex flex-row space-x-4 justify-center items-center'>
          <FaExclamationTriangle className='dark:text-amber-400 text-orange-700 text-4xl' />
          <div className='flex flex-col space-y-1'>
            <h1 className='text-center text-xl dark:text-amber-400 text-orange-700'>
              {leagueName}: Episode {episodeNumber} Survey has not been
              completed.
            </h1>
            <h1>Due: {formattedDate}</h1>
          </div>
        </div>
        <button
          className={`py-2 px-4 dark:text-black dark:bg-amber-400 dark:hover:bg-amber-600 bg-orange-700 hover:bg-orange-900 text-white rounded-md`}>
          Go to Survey
        </button>
      </div>
    </div>
  );
};

/*

import React from 'react';
import { FaExclamationTriangle, FaTimes, FaXing } from 'react-icons/fa';

interface SurveyStatusMessage {}

const SurveyStatusMessage: React.FC = ({}) => {
  const [showMessage, setShowMessage] = React.useState<boolean>(true);

  const handleXClick = () => {
    setShowMessage(false);
  };

  if (!showMessage) {
    return null;
  }
  return (
    <div className='w-full py-2 dark:bg-surface-a1-dark bg-surface-a1-light rounded-md relative'>
      <FaTimes
        onClick={handleXClick}
        className='absolute top-4 right-4 dark:text-amber-400 dark:hover:text-amber-600 text-orange-700 hover:text-orange-900 text-2xl'
      />
      <div className='flex flex-col space-y-2 items-center'>
        <div className='flex flex-row space-x-4 justify-center items-center'>
          <FaExclamationTriangle className='dark:text-amber-400 text-orange-700 text-4xl' />
          <h1 className='text-center text-xl dark:text-amber-400 text-orange-700'>
            Fill out the Episode 4 Survey before 7pm 3/19/2024
          </h1>
        </div>
        <button
          className={`py-2 px-4 dark:text-black dark:bg-amber-400 dark:hover:bg-amber-600 bg-orange-700 hover:bg-orange-900 text-white rounded-md`}>
          Go to Survey
        </button>
      </div>
    </div>
  );
};

export default SurveyStatusMessage;

*/

const AlertPanelHeader: React.FC = () => {
  return (
    <>
      <div className='flex items-center justify-center relative py-4'>
        <h1 className='text-4xl font-bold'>Alerts</h1>
        <button className='absolute right-4'>
          <FaTimes
            className={`text-3xl text-primary-a1-light dark:text-primary-a1-dark hover:text-primary-a3-light hover:dark:text-primary-a4-dark`}
          />
        </button>
      </div>
      <hr className={`w-full ${HorizontalLinePrimaryColors}`} />
    </>
  );
};
