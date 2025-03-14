import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { RootState } from '../store/store';
import Navbar from '../components/navbar/Navbar';
import Modal from '../components/ui/Modal';
import ExtendSessionToast from '../components/auth/ExtendSessionToast';
import Footer from '../components/footer/Footer';
import {
  MainBackgroundColor,
  TextPrimaryColor,
} from '../styles/CommonColorClassNames';

const RootLayout: React.FC = () => {
  const isOpen = useSelector((state: RootState) => state.modal.isOpen);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  return (
    <>
      <Navbar />
      <main
        className={`min-h-screen ${MainBackgroundColor} ${TextPrimaryColor}`}>
        <Outlet />
      </main>
      {isOpen && <Modal isOpen={isOpen} />}
      {isAuthenticated && <ExtendSessionToast />}
      <footer>
        <Footer />
      </footer>
    </>
  );
};

export default RootLayout;
