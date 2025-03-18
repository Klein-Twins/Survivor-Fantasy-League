import { LeagueInvite } from '../../../../generated-api';
import LeagueInviteRow from './LeagueInviteRow';

interface LeagueInviteRowsProps {
  leagueInvites: LeagueInvite[];
}

const LeagueInviteRows: React.FC<LeagueInviteRowsProps> = ({
  leagueInvites,
}) => {
  return (
    <div className={`w-full rounded-md flex flex-col`}>
      {leagueInvites.map((leagueInvite) => (
        <LeagueInviteRow leagueInvite={leagueInvite} />
      ))}
    </div>
  );
};

export default LeagueInviteRows;
