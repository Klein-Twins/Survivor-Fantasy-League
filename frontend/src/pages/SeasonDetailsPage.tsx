import { useLocation, useParams } from 'react-router-dom';

const SeasonDetailsPage: React.FC = () => {
  const location = useLocation();
  const { seasonId } = useParams<{ seasonId: string }>();

  return (
    <>
      <h1> Season Details for season {seasonId}! </h1>
    </>
  );
};

export default SeasonDetailsPage;
