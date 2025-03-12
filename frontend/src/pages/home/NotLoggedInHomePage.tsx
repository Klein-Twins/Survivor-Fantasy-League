import React from 'react';
import HeroSection from '../../components/home/NotLoggedIn/HeroSection';
import FeaturesSection from '../../components/home/NotLoggedIn/FeaturesSection';
import CallToAction from '../../components/home/NotLoggedIn/CallToAction';

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
