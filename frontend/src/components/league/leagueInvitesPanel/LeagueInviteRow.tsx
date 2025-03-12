import { useDispatch, useSelector } from 'react-redux';
import {
  LeagueInvite,
  RespondToLeagueInviteRequestBodyInviteResponseEnum,
} from '../../../../generated-api';
import {
  ButtonPrimaryColors,
  ButtonSubtleColors,
} from '../../../styles/CommonColorClassNames';
import LeagueImage from '../../ui/image/LeagueImage';
import { AppDispatch, RootState } from '../../../store/store';
import { respondToLeagueInvite } from '../../../store/slices/leagueInviteSlice';

interface LeagueInviteRowProps {
  leagueInvite: LeagueInvite;
}

const LeagueInviteRow: React.FC<LeagueInviteRowProps> = ({ leagueInvite }) => {
  const profileId = useSelector(
    (state: RootState) => state.auth.account.profileId
  );
  const dispatch = useDispatch<AppDispatch>();

  function onAcceptClick() {
    dispatch(
      respondToLeagueInvite({
        body: {
          leagueId: leagueInvite.league.leagueId,
          profileId: profileId,
          inviteResponse:
            RespondToLeagueInviteRequestBodyInviteResponseEnum.ACCEPT,
        },
      })
    );
  }

  function onDeclineClick() {
    dispatch(
      respondToLeagueInvite({
        body: {
          leagueId: leagueInvite.league.leagueId,
          profileId: profileId,
          inviteResponse:
            RespondToLeagueInviteRequestBodyInviteResponseEnum.DECLINE,
        },
      })
    );
  }

  return (
    <div className='flex items-center justify-between p-4 bg-surface-a2-light dark:bg-surface-a2-dark shadow-md'>
      <div className='flex items-center'>
        <LeagueImage
          leagueId={leagueInvite.league.leagueId}
          className='w-16 h-16 object-cover rounded-md mr-4'
        />
        <div>
          <h2 className='text-xl font-semibold text-primary-a0-light dark:text-primary-a0-dark'>
            {leagueInvite.league.name}
          </h2>
        </div>
      </div>
      <div className='flex flex-col space-y-1'>
        <button
          onClick={onAcceptClick}
          className={`px-4 py-2 ${ButtonPrimaryColors} rounded-md transition-colors`}>
          Accept
        </button>
        <button
          onClick={onDeclineClick}
          className={`px-4 py-2 ${ButtonSubtleColors} rounded-md transition-colors`}>
          Decline
        </button>
      </div>
    </div>
  );
};

export default LeagueInviteRow;
