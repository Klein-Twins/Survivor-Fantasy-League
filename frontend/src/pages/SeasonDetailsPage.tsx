import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { TextPrimaryColor } from '../styles/CommonColorClassNames';
import Drawer from '../components/about/Drawer';
import AdminSurvivors from '../components/admin/seasonDetails/AdminSurvivors';
import AdminTribes from '../components/admin/seasonDetails/AdminTribes';
import AdminEpisodes from '../components/admin/seasonDetails/AdminEpisodes';

const SeasonDetailsPage: React.FC = () => {
  const { seasonId } = useParams<{ seasonId: string }>();
  const season = useSelector((state: RootState) =>
    state.season.seasons.find((s) => s.id.toString() === seasonId)
  );

  if (!season) {
    return <h1> Season not found! </h1>;
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className={`text-2xl font-bold text-center ${TextPrimaryColor}`}>
        Season {season.id}: {season.name}
      </h1>

      <Drawer title='Tribes' defaultOpen={false}>
        <AdminTribes tribes={season.tribes} />
      </Drawer>
      <Drawer title='Survivors' defaultOpen={false}>
        <AdminSurvivors survivors={season.survivors} />
      </Drawer>
      <Drawer title='Episodes' defaultOpen={false}>
        <AdminEpisodes episodes={season.episodes} />
      </Drawer>
    </div>
  );
};

export default SeasonDetailsPage;
