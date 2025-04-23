import { container } from 'tsyringe';
import seasonProcessor from './processing/season/seasonProcessor';
import { SeasonService } from '../services/season/SeasonService';
import sequelize from '../config/db';
import { diff } from 'deep-object-diff';
import { Season, SeasonStorage } from '../domain/season/Season';
import season48Data from './foundation/data/ssn/48/season48';

const seedData = async () => {
  const season = seasonProcessor.processSeasonData(season48Data);

  const seasonService = container.resolve(SeasonService);
  const transaction = await sequelize.transaction();

  try {
    await seasonService.saveSeason(season, transaction);

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    console.error('Error seeding data:', error);
  }
  container.resolve(SeasonStorage).clear();
  const fetchedSeason = await seasonService.fetchSeasonById(48);

  compareSeasonWithFetchedSeason(season, fetchedSeason);
};

function compareSeasonWithFetchedSeason(season: Season, fetchedSeason: Season) {
  const differences = diff(season, fetchedSeason);

  if (Object.keys(differences).length > 0) {
    console.log('Differences found:', differences);
  } else {
    console.log('No differences found.');
  }
}

export default seedData;
