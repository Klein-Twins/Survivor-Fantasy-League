import React, { useState } from 'react';
import { LeagueInvite, RespondToLeagueInviteRequestBodyInviteResponseEnum } from '../../../../generated-api';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { removeLeagueInvite, respondToLeagueInvite } from '../../../store/slices/leagueInviteSlice';
import { addLeague } from '../../../store/slices/leagueSlice';
import { LeagueDisplay } from './LeagueDisplay';

interface LeagueInviteCardProps {
  leagueInvite: LeagueInvite;
  className?: string;
}

export const LeagueInviteCard: React.FC<LeagueInviteCardProps> = ({ leagueInvite, className }) => {
  const dispatch = useDispatch<AppDispatch>();
  const account = useSelector((state: RootState) => state.auth.account);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(leagueInvite.message || '');
  const [canDelete, setCanDelete] = useState(false);

  const handleResponse = async (response: RespondToLeagueInviteRequestBodyInviteResponseEnum) => {
    if (!account?.profileId) return;

    setIsLoading(true);
    const result = await dispatch(
      respondToLeagueInvite({
        body: {
          leagueId: leagueInvite.league.leagueId,
          profileId: account.profileId,
          inviteResponse: response,
        },
      })
    );

    if (result.meta.requestStatus === 'fulfilled') {
      if (response === RespondToLeagueInviteRequestBodyInviteResponseEnum.ACCEPT) {
        dispatch(addLeague(leagueInvite.league));
        setMessage('Welcome to the league! See you at the next tribal council.');
      } else {
        setMessage('You have rejected your torch.');
      }
      setCanDelete(true);
    }
    setIsLoading(false);
  };

  const handleRemove = () => dispatch(removeLeagueInvite(leagueInvite));

  return (
    <div className={`w-full flex relative ${className}`}>
      {canDelete && (
        <button
          onClick={handleRemove}
          className='absolute top-2 right-2 w-12 h-12 flex items-center justify-center 
                    rounded-full bg-button-secondary-base hover:bg-button-secondary-hover
                    text-text-primary transition-colors text-2xl'>
          ×
        </button>
      )}
      <LeagueDisplay league={leagueInvite.league} message={message} />
      {!canDelete && (
        <div className='flex flex-col space-y-2 p-2 w-1/6 mx-auto'>
          <button
            onClick={() => handleResponse(RespondToLeagueInviteRequestBodyInviteResponseEnum.ACCEPT)}
            disabled={isLoading}
            className={`w-full h-1/2 bg-button-primary-base hover:bg-button-primary-hover rounded-xl ${
              isLoading ? 'disabled opacity-50' : ''
            }`}>
            {isLoading ? 'Please wait...' : 'Accept'}
          </button>
          <button
            onClick={() => handleResponse(RespondToLeagueInviteRequestBodyInviteResponseEnum.DECLINE)}
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
