import React from 'react';
import { Link } from 'react-router-dom';
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
