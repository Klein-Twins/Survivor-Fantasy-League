import React from 'react';
import { Link } from 'react-router-dom';
import HeroSection from './NotLoggedIn/HeroSection';
import FeaturesSection from './NotLoggedIn/FeaturesSection';

const NotLoggedInHomePage: React.FC = () => {
  return (
    <>
      <img src='HeroPageMain.jpeg' />
      <HeroSection />
      <FeaturesSection />
    </>
  );
};

export default NotLoggedInHomePage;
