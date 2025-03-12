import React from 'react';

interface LeagueNameProps {
  leagueName: string;
  className?: string;
}

const LeagueName: React.FC<LeagueNameProps> = ({
  leagueName,
  className = '',
}) => {
  return <h1 className={`${className}`}>{leagueName}</h1>;
};

export default LeagueName;
