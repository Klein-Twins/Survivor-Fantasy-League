import React from 'react';
import HeroSection from '../../components/pageComponents/home/NotLoggedIn/HeroSection';
import FeaturesSection from '../../components/pageComponents/home/NotLoggedIn/FeaturesSection';
import CallToAction from '../../components/pageComponents/home/NotLoggedIn/CallToAction';

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
