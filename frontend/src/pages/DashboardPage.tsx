import React, { useEffect } from 'react';
import { RootState } from '../store/store';
import { useSelector } from 'react-redux';
import profileService from '../services/profile/profileService';
import leagueService from '../services/league/leagueService';
import { useApi } from '../hooks/useApi';

const DashboardPage: React.FC = () => {
  const account = useSelector((state: RootState) => state.auth.account);
  const profileId = account?.profileId;

  if (!account) {
    return <div>Please log in</div>;
  }

  return (
    <div className='max-w-8xl py-6 mx-auto px-8 bg-black'>
      <h3 className='text-3xl text-center font-semibold  mb-6'>
        Hello {account.userName}, welcome to your dashboard!
      </h3>
      <div></div>
    </div>
  );
};

export default DashboardPage;
