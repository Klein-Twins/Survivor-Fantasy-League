import { LeagueMember } from '../../../../generated-api';
import ProfileImage from '../../ui/image/ProfileImage';

interface LeagueCardProfileProps {
  leagueMember: LeagueMember;
}

const LeagueCardProfile: React.FC<LeagueCardProfileProps> = ({ leagueMember }) => {
  const userName = leagueMember.profile.userName;
  const firstName = leagueMember.profile.firstName;
  const lastName = leagueMember.profile.lastName;

  return (
    <div className='flex flex-col items-center justify-center' key={leagueMember.profile.profileId}>
      <ProfileImage
        className='mx-auto transform transition-transform duration-300 hover:scale-110'
        profileId={leagueMember.profile.profileId}
        size='small'
        shape='circle'
      />
    </div>
  );
};

export default LeagueCardProfile;
