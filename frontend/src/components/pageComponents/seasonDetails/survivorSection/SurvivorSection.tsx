import { Season, Survivor } from '../../../../../generated-api';
import Drawer from '../../../ui/Drawer';
import SurvivorList from './SurvivorList';

interface SurvivorSectionProps {
  survivors: Survivor[];
  seasonId: Season['id'];
}

const SurvivorSection: React.FC<SurvivorSectionProps> = ({
  seasonId,
  survivors,
}) => {
  return (
    <Drawer title='Survivors'>
      <SurvivorList seasonId={seasonId} survivors={survivors} />
    </Drawer>
  );
};

export default SurvivorSection;
