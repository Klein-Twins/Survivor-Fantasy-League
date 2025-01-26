import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { AppDispatch, RootState } from '../store/store';
import Navbar from '../components/navbar/Navbar';
import Modal from '../components/ui/Modal';
import ExtendSessionToast from '../components/auth/ExtendSessionToast';
// import { checkAuthentication } from "../store/slices/authSlice";

const RootLayout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const isOpen = useSelector((state: RootState) => state.modal.isOpen);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    // dispatch(checkAuthentication());
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <main className='min-h-screen dark:bg-surface-a0-dark dark:text-primary-a5-dark'>
        <Outlet />
      </main>
      {isOpen && <Modal isOpen={isOpen} />}
      {isAuthenticated && <ExtendSessionToast />}
    </>
  );
};

export default RootLayout;
