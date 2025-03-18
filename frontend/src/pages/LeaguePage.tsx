import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { ButtonPrimaryColors } from '../styles/CommonColorClassNames';
import LeagueName from '../components/leagueBackup/leaguePage/LeagueName';
import {
  Account,
  GetLeagueMemberSurveyResponse,
  League,
  LeagueMember,
} from '../../generated-api';
import { FaTrophy } from 'react-icons/fa';
import ProfileImage from '../components/ui/image/ProfileImage';
import { useApi } from '../hooks/useApi';
import surveyService, {
  GetLeagueSurveyRequestParams,
} from '../services/league/survey/surveyService';
import SurveyStatus from '../components/league/survey/SurveyStatus';
import SurveyPanel from '../components/league/survey/SurveyPanel';

const LeaguePage: React.FC = () => {
  const { leagueId } = useParams<{ leagueId: string }>();
  const league = useSelector((state: RootState) =>
    state.league.leagues.find((l) => l.id === leagueId)
  );
  const account = useSelector((state: RootState) => state.auth.account);

  if (!league) {
    return <NotInLeaguePage />;
  }

  return (
    <div className='container mx-auto flex-flex-col space-y-4'>
      <LeaguePageHeader league={league} />
      <LeaguePageMainContent league={league} account={account} />
    </div>
  );
};

interface LeaguePageMainContentProps {
  league: League;
  account: Account;
}

const LeaguePageMainContent: React.FC<LeaguePageMainContentProps> = ({
  league,
  account,
}) => {
  const currentEpisodeId = useSelector(
    (state: RootState) => state.season.activeEpisode.id
  );

  const {
    data: surveyData,
    isLoading: surveyIsLoading,
    error,
    execute,
  } = useApi<void, GetLeagueSurveyRequestParams, GetLeagueMemberSurveyResponse>(
    surveyService.getLeagueSurvey
  );

  useEffect(() => {
    async function fetchSurvey() {
      await execute({
        queryParams: {
          leagueId: league.id,
          profileId: account.profileId,
          episodeId: currentEpisodeId,
        },
      });
    }
    fetchSurvey();
  }, [league.id, account.profileId, currentEpisodeId]);

  return (
    <div className='flex space-x-4'>
      <SurveyPanel leagueId={league.id} profileId={account.profileId} />
    </div>
  );
};

interface LeaguePageHeaderProps {
  league: League;
}

const LeaguePageHeader: React.FC<LeaguePageHeaderProps> = ({ league }) => {
  return (
    <>
      <LeagueName
        leagueName={league.name}
        className='pt-4 text-3xl text-center font-bold'
      />
      <LeagueLeaderboard league={league} />
    </>
  );
};

interface LeagueLeaderboardProps {
  league: League;
}

const LeagueLeaderboard: React.FC<LeagueLeaderboardProps> = ({ league }) => {
  const sortedLeagueMembers = [...league.leagueMembers].sort(
    (a, b) => b.totalPoints - a.totalPoints
  );

  return (
    <div className='flex justify-center space-x-4 items-end'>
      {sortedLeagueMembers.length >= 2 && (
        <LeaderBoardProfile
          leagueMember={sortedLeagueMembers[1]}
          placement={2}
        />
      )}
      {sortedLeagueMembers.length >= 1 && (
        <LeaderBoardProfile
          leagueMember={sortedLeagueMembers[0]}
          placement={1}
        />
      )}
      {sortedLeagueMembers.length >= 3 && (
        <LeaderBoardProfile
          leagueMember={sortedLeagueMembers[2]}
          placement={3}
        />
      )}
    </div>
  );
};

interface LeaderBoardProfileProps {
  leagueMember: LeagueMember;
  placement: 1 | 2 | 3;
}

const LeaderBoardProfile: React.FC<LeaderBoardProfileProps> = ({
  leagueMember,
  placement,
}) => {
  const trophySize =
    placement === 1 ? 'text-6xl' : placement === 2 ? 'text-5xl' : 'text-4xl';
  const trophyColor =
    placement === 1
      ? 'text-yellow-300'
      : placement === 2
      ? 'text-gray-300'
      : 'text-yellow-700';

  return (
    <div className='flex flex-col items-center w-32'>
      <FaTrophy className={`${trophySize} ${trophyColor}`} />
      <p className='text-lg font-bold'>{leagueMember.profile.userName}</p>
      <ProfileImage
        profileId={leagueMember.profile.profileId}
        size='large'
        shape='square'
      />
      <p className='text-lg font-bold'>{leagueMember.totalPoints} points</p>
    </div>
  );
};

export default LeaguePage;

const NotInLeaguePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className='container mx-auto p-4 text-center'>
      <h1 className='text-3xl font-bold mb-4'>
        You are not part of this league
      </h1>
      <button
        onClick={() => navigate('/')}
        className={`${ButtonPrimaryColors} py-4 px-8 rounded-md`}>
        Back To Home
      </button>
    </div>
  );
};
