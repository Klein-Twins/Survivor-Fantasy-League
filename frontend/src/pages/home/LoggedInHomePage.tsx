import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { getLeagues } from '../../store/slices/leagueSlice';
import { getLeagueInvites } from '../../store/slices/leagueInviteSlice';
import LeaguesPanel from '../../components/home/LoggedIn/LeaguesPanel';
import LeagueInvitesPanel from '../../components/home/LoggedIn/LeagueInvitesPanel';
import AlertPanel from '../../components/home/LoggedIn/AlertPanel';

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
    <>
      <div className='pt-2'>
        <AlertPanel />
      </div>
      <div className='flex flex-col space-y-2 py-2 md:flex-row md:space-x-2 md:space-y-0 mx-auto'>
        <LeaguesPanel />
        <LeagueInvitesPanel />
      </div>
    </>
  );
}

export default LoggedInHomePage;
