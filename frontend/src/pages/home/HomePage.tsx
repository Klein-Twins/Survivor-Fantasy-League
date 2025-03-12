import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import LoggedInHomePage from './LoggedInHomePage';
import NotLoggedInHomePage from './NotLoggedInHomePage';

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

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
