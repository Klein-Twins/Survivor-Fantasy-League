import { LeagueAttributes } from '../../../models/league/League';
import { testLeagueIds } from '../devIds';

const testLeagueData: LeagueAttributes[] = [
  {
    leagueId: testLeagueIds.league1,
    seasonId: 47,
    name: 'The Chicken Race on the island',
    createdAt: new Date('2025-01-15T16:16:28.942-06:00'),
  },
  {
    leagueId: testLeagueIds.league2,
    seasonId: 47,
    name: 'Avengers Assemble Fantasy League',
    createdAt: new Date('2025-01-15T16:16:28.942-06:00'),
  },
  {
    leagueId: testLeagueIds.league3,
    seasonId: 47,
    name: 'Shield Agents League',
    createdAt: new Date('2025-01-15T16:16:28.942-06:00'),
  },
  {
    leagueId: testLeagueIds.league4,
    seasonId: 47,
    name: 'Wakanda Forever League',
    createdAt: new Date('2025-01-15T16:16:28.942-06:00'),
  },
  {
    leagueId: testLeagueIds.league5,
    seasonId: 47,
    name: 'Guardians of the Galaxy League',
    createdAt: new Date('2025-01-15T16:16:28.942-06:00'),
  },
];

export default testLeagueData;
