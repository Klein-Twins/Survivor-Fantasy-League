import React, { useState } from 'react';
import {
  LeagueInvite,
  RespondToLeagueInviteRequestBodyInviteResponseEnum,
} from '../../../../generated-api';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import {
  removeLeagueInvite,
  respondToLeagueInvite,
} from '../../../store/slices/leagueInviteSlice';
import { addLeague } from '../../../store/slices/leagueSlice';
import { LeagueDisplay } from './LeagueDisplay';
import {
  ButtonCheckColors,
  ButtonPrimaryBgColor,
  ButtonPrimaryColors,
  ButtonSubtleColors,
  ButtonXColors,
  ElementBackgroundColor,
} from '../../../styles/CommonColorClassNames';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

interface LeagueInviteCardProps {
  leagueInvite: LeagueInvite;
  className?: string;
}

export const LeagueInviteCard: React.FC<LeagueInviteCardProps> = ({
  leagueInvite,
  className,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const account = useSelector((state: RootState) => state.auth.account);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(leagueInvite.message || '');
  const [canDelete, setCanDelete] = useState(false);

  const handleResponse = async (
    response: RespondToLeagueInviteRequestBodyInviteResponseEnum
  ) => {
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
      if (
        response === RespondToLeagueInviteRequestBodyInviteResponseEnum.ACCEPT
      ) {
        dispatch(addLeague(leagueInvite.league));
        setMessage(
          'Welcome to the league! See you at the next tribal council.'
        );
      } else {
        setMessage('You have rejected your torch.');
      }
      setCanDelete(true);
    }
    setIsLoading(false);
  };

  const handleRemove = () => dispatch(removeLeagueInvite(leagueInvite));

  return (
    <div className={`w-full flex relative ${ElementBackgroundColor}`}>
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
        <div className='absolute bottom-2 right-2 flex items-center space-x-2'>
          <button
            onClick={() =>
              handleResponse(
                RespondToLeagueInviteRequestBodyInviteResponseEnum.ACCEPT
              )
            }
            disabled={isLoading}
            className={`${ButtonCheckColors}`}>
            <FaCheckCircle size={36} />
          </button>
          <button
            onClick={() =>
              handleResponse(
                RespondToLeagueInviteRequestBodyInviteResponseEnum.DECLINE
              )
            }
            disabled={isLoading}
            className={`${ButtonXColors}`}>
            <FaTimesCircle size={36} />
          </button>
        </div>
      )}
    </div>
  );
};
