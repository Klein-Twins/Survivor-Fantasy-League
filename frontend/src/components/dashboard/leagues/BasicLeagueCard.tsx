import React, { useState } from 'react';
import { League, LeagueInvite, RespondToLeagueInviteRequestBodyInviteResponseEnum } from '../../../../generated-api';
import LeagueCardProfile from './LeagueCardProfile';
import { AppDispatch, RootState } from '../../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { removeLeagueInvite, respondToLeagueInvite } from '../../../store/slices/leagueInviteSlice';
import { addLeague } from '../../../store/slices/leagueSlice';

type LeagueCardType = 'league' | 'leagueInvite';

type BasicLeagueCardProps =
  | { league: League; leagueInvite?: never }
  | { league?: never; leagueInvite: LeagueInvite }
  | { league: League; leagueInvite: LeagueInvite };

function getLeagueFromProps(props: BasicLeagueCardProps): League {
  if (props.league) {
    return props.league;
  }
  if (props.leagueInvite?.league) {
    return props.leagueInvite.league;
  }
  throw new Error('League must be provided either directly or through leagueInvite');
}

const BasicLeagueCard: React.FC<BasicLeagueCardProps> = (props) => {
  const dispatch = useDispatch<AppDispatch>();
  const [message, setMessage] = useState(props.leagueInvite?.message || '');
  const account = useSelector((state: RootState) => state.auth.account);
  const [isLoading, setIsLoading] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  if (!props.league && !props.leagueInvite?.league) {
    throw new Error('League must be provided either directly or through leagueInvite');
  }

  const league: League = getLeagueFromProps(props);
  const leagueInvite: LeagueInvite | undefined = props.leagueInvite;
  const leagueCardType: LeagueCardType = props.leagueInvite ? 'leagueInvite' : 'league';

  function acceptInvite() {
    if (account?.profileId) {
      dispatch(
        respondToLeagueInvite({
          body: {
            leagueId: league?.leagueId,
            profileId: account?.profileId,
            inviteResponse: RespondToLeagueInviteRequestBodyInviteResponseEnum.ACCEPT,
          },
        })
      ).then((response) => {
        if (response.meta.requestStatus === 'fulfilled') {
          dispatch(addLeague(league));
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
    if (account?.profileId && leagueCardType === 'leagueInvite') {
      dispatch(
        respondToLeagueInvite({
          body: {
            leagueId: league?.leagueId,
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
    dispatch(removeLeagueInvite(leagueInvite!));
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
        <div key={league.leagueId} className='w-full bg-background-dp03 rounded-xl p-4 flex justify-start space-x-4'>
          <div className='w-1/5 aspect-square rounded-lg overflow-hidden'>
            <img src='/leagueImage.jpg' alt='League Banner' className='w-full h-full object-cover' />
          </div>
          <div id='leagueInfo' className='flex flex-col justify-between'>
            <div className='flex flex-col space-y-2 mb-4'>
              <div className='text-title font-semibold'>{league.name}</div>
              <div className='text-subtitle'>Season: {league.season.id}</div>
              {message && <div className='text-text-primary text-subtitle'>{message}</div>}
            </div>

            <div id='leagueMembers' className='flex justify-start items-center space-x-4'>
              {league.leagueMembers.map((leagueMember) => {
                return <LeagueCardProfile leagueMember={leagueMember} />;
              })}
            </div>
          </div>
        </div>
      </div>
      {!canDelete && leagueCardType === 'leagueInvite' && (
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

export default BasicLeagueCard;
