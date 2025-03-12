import React from 'react';
import { LeagueMember, Profile } from '../../../../../generated-api';
import ProfileImage from '../../../ui/image/ProfileImage';

interface LeagueMemberCardProps {
  leagueMember: LeagueMember;
}

const LeagueMemberCard: React.FC<LeagueMemberCardProps> = ({
  leagueMember,
}) => {
  function getProfileName(profile: Profile): string | null {
    if (profile.firstName) {
      if (profile.lastName) {
        return `${profile.firstName} ${profile.lastName}`;
      } else {
        return profile.firstName;
      }
    }
    return null;
  }

  return (
    <div className='flex flex-col items-center w-full justify-center dark:bg-surface-a2-dark bg-surface-a2-light rounded-md p-2'>
      <div className='flex flex-row w-full h-20 justify-start items-center space-x-2'>
        <ProfileImage
          profileId={leagueMember.profile.profileId}
          size='large'
          shape='square'
        />
        <div className='flex flex-col h-full items-start justify-start'>
          <h1>{leagueMember.profile.userName}</h1>
          <h1>{getProfileName(leagueMember.profile)}</h1>
        </div>
      </div>
    </div>
  );
};

export default LeagueMemberCard;
