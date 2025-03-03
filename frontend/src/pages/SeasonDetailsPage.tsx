import { useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import SurvivorListForSeason from '../components/admin/survivor/SurvivorListForSeason';

const SeasonDetailsPage: React.FC = () => {
  const { seasonId } = useParams<{ seasonId: string }>();
  const season = useSelector((state: RootState) =>
    state.season.seasons.find((s) => s.id.toString() === seasonId)
  );

  if (!season) {
    return <h1> Season not found! </h1>;
  }

  return (
    <>
      <h1> Season Details for season {seasonId}! </h1>
      <SurvivorListForSeason season={season} />
    </>
  );
};

export default SeasonDetailsPage;
