import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import LoggedInHomePage from './LoggedInHomePage';
import NotLoggedInHomePage from './NotLoggedInHomePage';

const HomePage: React.FC = () => {
  const account = useSelector((state: RootState) => state.auth.account);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  return (
    <div>
      {account?.userName && isAuthenticated ? (
        <LoggedInHomePage />
      ) : (
        <NotLoggedInHomePage />
      )}
    </div>
  );
};

export default HomePage;
