import { LeagueMember } from '../../../../../generated-api';
import { HorizontalLinePrimaryColors } from '../../../../styles/CommonColorClassNames';
import LeagueMemberCard from './LeagueMemberCard';

interface LeagueMemberPanelProps {
  leagueMembers: LeagueMember[];
}

const LeagueMemberPanel: React.FC<LeagueMemberPanelProps> = ({
  leagueMembers,
}) => {
  return (
    <div className='flex flex-col space-y-2 bg-surface-a1-light dark:bg-surface-a1-dark rounded-md py-2 px-2'>
      <h2 className='text-2xl font-semibold text-center'>League Members</h2>
      <hr className={`border-1 mt-2 ${HorizontalLinePrimaryColors}`} />
      <div className='flex flex-row space-x-2 w-full overflow-x-auto justify-between items-center'>
        {leagueMembers.map((leagueMember) => (
          <LeagueMemberCard key={Math.random()} leagueMember={leagueMember} />
        ))}
      </div>
    </div>
  );
};

export default LeagueMemberPanel;
