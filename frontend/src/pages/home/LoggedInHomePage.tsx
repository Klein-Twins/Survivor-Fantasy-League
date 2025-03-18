import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { getLeagues } from '../../store/slices/leagueSlice';
import { getLeagueInvites } from '../../store/slices/leagueInviteSlice';
import LeaguesPanel from '../../components/pageComponents/home/LoggedIn/LeaguesPanel';
import LeagueInvitesPanel from '../../components/pageComponents/home/LoggedIn/LeagueInvitesPanel';
import SeasonBanner from '../../components/dashboard/SeasonBanner';

function LoggedInHomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const selectedSeason = useSelector(
    (state: RootState) => state.season.selectedSeason
  );
  const account = useSelector((state: RootState) => state.auth.account);

  useEffect(() => {
    if (account?.profileId) {
      dispatch(
        getLeagues({
          queryParams: {
            seasonId: selectedSeason.id,
            profileId: account.profileId,
          },
        })
      );
      dispatch(
        getLeagueInvites({
          queryParams: {
            seasonId: selectedSeason.id,
            profileId: account.profileId,
          },
        })
      );
    }
  }, [dispatch, account?.profileId]); // Only depend on dispatch and profileId
  return (
    <>
      <SeasonBanner />
      <div className='pt-2'>{/* <AlertPanel /> */}</div>
      <div className='flex flex-col space-y-2 py-2 md:flex-row md:space-x-2 md:space-y-0 mx-auto'>
        <LeaguesPanel />
        <LeagueInvitesPanel />
      </div>
    </>
  );
}

export default LoggedInHomePage;
