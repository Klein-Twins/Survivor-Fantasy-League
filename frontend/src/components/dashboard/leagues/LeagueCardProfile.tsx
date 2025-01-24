import { LeagueMember } from '../../../../generated-api';

interface LeagueCardProfileProps {
  leagueMember: LeagueMember;
}

const LeagueCardProfile: React.FC<LeagueCardProfileProps> = ({ leagueMember }) => {
  return (
    <div className='flex-col items-center' key={leagueMember.profile.profileId}>
      <div className='w-12 h-12 rounded-full overflow-hidden mx-auto'>
        <img
          src='/leagueImage.jpg'
          alt={`${leagueMember.profile.userName}'s avatar`}
          className='w-full h-full object-cover'
        />
      </div>
      <p className='text-center'>{leagueMember.profile.userName}</p>
    </div>
  );
};

export default LeagueCardProfile;
