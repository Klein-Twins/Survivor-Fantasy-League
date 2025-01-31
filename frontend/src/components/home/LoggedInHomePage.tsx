import React, { useEffect } from 'react';
import { LeaguesPanel } from '../dashboard/leagues/LeaguePanel';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { getLeagues } from '../../store/slices/leagueSlice';
import { getLeagueInvites } from '../../store/slices/leagueInviteSlice';

function LoggedInHomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const account = useSelector((state: RootState) => state.auth.account);

  useEffect(() => {
    if (account?.profileId) {
      dispatch(
        getLeagues({
          queryParams: {
            profileId: account.profileId,
          },
        })
      );
      dispatch(
        getLeagueInvites({
          queryParams: {
            profileId: account.profileId,
          },
        })
      );
    }
  }, [dispatch, account?.profileId]); // Only depend on dispatch and profileId
  return (
    <div className='pt-2 container mx-auto'>
      <LeaguesPanel />
    </div>
  );
}

export default LoggedInHomePage;
