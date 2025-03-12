import { League } from '../../../../generated-api';
import LeagueRow from './LeagueRow';

interface LeagueRowsProps {
  leagues: League[];
}

const LeagueRows: React.FC<LeagueRowsProps> = ({ leagues }) => {
  return (
    <div className={`w-full rounded-md flex flex-col`}>
      {leagues.map((league) => (
        <LeagueRow league={league} />
      ))}
    </div>
  );
};

export default LeagueRows;
