import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import NotLoggedInHomePage from '../components/home/NotLoggedInHomePage';
import LoggedInHomePage from '../components/home/LoggedInHomePage';

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const account = useSelector((state: RootState) => state.auth.account);
  return (
    <div>
      {account?.userName ? <LoggedInHomePage /> : <NotLoggedInHomePage />}
    </div>
  );
};

export default HomePage;
