import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { getLeagues } from '../store/slices/leagueSlice';
import { getLeagueInvites } from '../store/slices/leagueInviteSlice';
import { LeaguesPanel } from '../components/dashboard/leagues/LeaguePanel';
import Image from '../components/ui/image/Image';
import NotLoggedInHomePage from '../components/home/NotLoggedInHomePage';
import LoggedInHomePage from '../components/home/LoggedInHomePage';

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const account = useSelector((state: RootState) => state.auth.account);
  const leagueInvites = useSelector((state: RootState) => state.leagueInvite.leagueInvites);
  const leagues = useSelector((state: RootState) => state.league.leagues);

  // useEffect(() => {
  //   if (account?.profileId) {
  //     dispatch(
  //       getLeagues({
  //         queryParams: {
  //           profileId: account.profileId,
  //         },
  //       })
  //     );
  //     dispatch(
  //       getLeagueInvites({
  //         queryParams: {
  //           profileId: account.profileId,
  //         },
  //       })
  //     );
  //   }
  // }, [dispatch, account?.profileId]); // Only depend on dispatch and profileId

  //   return <div className='bg-background-base min-h-screen text-gray-300'>TEst</div>;
  return (
    // <div className='flex min-h-screen w-full text-text-primary'>
    //   <div className='w-1/12 bg-gradient-to-l from-background-dp01 to-background-base'></div>
    //   <div className='w-10/12 pt-4 bg-background-dp01 mx-auto text-text-primary'>
    //     <LeaguesPanel />
    //   </div>
    //   <div className='w-1/12 bg-gradient-to-r from-background-dp01 to-background-base'></div>
    // </div>
    <div className='dark:bg-surface-a0-dark'>{account?.userName ? <LoggedInHomePage /> : <NotLoggedInHomePage />}</div>

    // <div className='bg-background-base min-h-screen w-full p-2 text-text-primary'>
    //   <LeagueInvitesSection account={account} />
    // </div>
  );
};

export default HomePage;
