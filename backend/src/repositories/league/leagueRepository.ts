import { Transaction } from 'sequelize';
import { LeagueAttributes } from '../../models/league/League';
import { models } from '../../config/db';
import { v4 as uuidv4 } from 'uuid';

const leagueRepository = {
  createLeague,
  getLeague,
};

async function createLeague(
  seasonId: LeagueAttributes['seasonId'],
  name: LeagueAttributes['name'],
  transaction: Transaction
): Promise<LeagueAttributes> {
  const leagueId = uuidv4();
  const leagueAttributes = await models.League.create(
    {
      leagueId,
      seasonId,
      name,
    },
    { transaction }
  );
  return leagueAttributes;
}

async function getLeague(
  leagueId: LeagueAttributes['leagueId']
): Promise<LeagueAttributes | null> {
  return await models.League.findOne({
    where: {
      leagueId,
    },
  });
}

export default leagueRepository;
