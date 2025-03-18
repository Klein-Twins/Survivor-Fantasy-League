import React from 'react';
import { Profile } from '../../../../generated-api';

interface WelcomeMessageProps {
  profile: Profile;
  className?: string;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({
  profile,
  className = '',
}) => {
  let name = profile.userName;
  if (profile.firstName) {
    if (profile.lastName) {
      name = `${profile.firstName} ${profile.lastName}`;
    } else {
      name = profile.firstName;
    }
  }
  const welcomeMessage = `Welcome, ${name}!`;
  return <h1 className={`${className}`}>{welcomeMessage}</h1>;
};

export default WelcomeMessage;
