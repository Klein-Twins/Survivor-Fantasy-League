import React from 'react';
import HeroSection from './NotLoggedIn/HeroSection';
import FeaturesSection from './NotLoggedIn/FeaturesSection';
import CallToAction from './NotLoggedIn/CallToAction';

const NotLoggedInHomePage: React.FC = () => {
  return (
    <>
      <img src='HeroPageMain.jpeg' />
      <HeroSection />
      <FeaturesSection />
      <CallToAction />
    </>
  );
};

export default NotLoggedInHomePage;
