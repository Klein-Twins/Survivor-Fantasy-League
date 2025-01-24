import React from 'react';
import { LeagueInvite, RespondToLeagueInviteRequestBodyInviteResponseEnum } from '../../../../generated-api';
import LeagueCardProfile from './LeagueCardProfile';
import { Button } from '@headlessui/react';
import BasicLeagueCard from './BasicLeagueCard';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { removeLeagueInvite, respondToLeagueInvite } from '../../../store/slices/leagueInviteSlice';
import { addLeague } from '../../../store/slices/leagueSlice';

interface LeagueInviteCardProps {
  leagueInvite: LeagueInvite;
}

const LeagueInviteCard: React.FC<LeagueInviteCardProps> = ({ leagueInvite }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [message, setMessage] = React.useState(leagueInvite.message);
  const account = useSelector((state: RootState) => state.auth.account);
  const [isLoading, setIsLoading] = React.useState(false);
  const [canDelete, setCanDelete] = React.useState(false);

  function acceptInvite() {
    if (account?.profileId) {
      dispatch(
        respondToLeagueInvite({
          body: {
            leagueId: leagueInvite.league.leagueId,
            profileId: account?.profileId,
            inviteResponse: RespondToLeagueInviteRequestBodyInviteResponseEnum.ACCEPT,
          },
        })
      ).then((response) => {
        if (response.meta.requestStatus === 'fulfilled') {
          dispatch(addLeague(leagueInvite.league));
          setMessage('Welcome to the league! See you at the next tribal council.');
          setCanDelete(true);
        } else if (response.meta.requestStatus === 'rejected') {
          setMessage(response.payload?.error || 'Failed to accept invite. Try again later.');
        }
      });
    }
  }

  function declineInvite() {
    console.log('Declining invite');
    if (account?.profileId) {
      dispatch(
        respondToLeagueInvite({
          body: {
            leagueId: leagueInvite.league.leagueId,
            profileId: account?.profileId,
            inviteResponse: RespondToLeagueInviteRequestBodyInviteResponseEnum.DECLINE,
          },
        })
      ).then((response) => {
        if (response.meta.requestStatus === 'fulfilled') {
          setMessage('You have rejected your torch.');
          setCanDelete(true);
        } else if (response.meta.requestStatus === 'rejected') {
          setMessage(response.payload?.error || 'Failed to decline invite. Try again later.');
        }
      });
    } else {
      console.warn('No profile ID - Not responding to leagueInvite');
    }
  }

  function removeInvite() {
    console.log('Removing invite');
    dispatch(removeLeagueInvite(leagueInvite));
  }

  return (
    <div className='w-full bg-background-dp03 flex justify-between relative'>
      {canDelete && (
        <button
          className='absolute top-2 right-2 w-10 h-10 flex items-center justify-center 
                rounded-full bg-button-secondary-base hover:bg-button-secondary-hover
                text-text-primary transition-colors text-2xl'
          onClick={removeInvite}>
          ×
        </button>
      )}
      <div>
        <BasicLeagueCard league={leagueInvite.league} message={message} />
      </div>
      {!canDelete && (
        <div className='flex flex-col space-y-2 p-2 w-1/6 mx-auto'>
          <button
            onClick={acceptInvite}
            disabled={isLoading}
            className={`w-full h-1/2 bg-button-primary-base hover:bg-button-primary-hover rounded-xl ${
              isLoading ? 'disabled opacity-50' : ''
            }`}>
            {isLoading ? 'Please wait...' : 'Accept'}
          </button>
          <button
            onClick={declineInvite}
            disabled={isLoading}
            className={`w-full h-1/2 bg-button-secondary-base hover:bg-button-secondary-hover rounded-xl ${
              isLoading ? 'disabled opacity-50' : ''
            }`}>
            {isLoading ? 'Please wait...' : 'Decline'}
          </button>
        </div>
      )}
    </div>
  );
};

export default LeagueInviteCard;
