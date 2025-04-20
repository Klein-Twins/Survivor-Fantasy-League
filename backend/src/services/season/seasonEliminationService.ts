// import { UUID } from 'crypto';
// import { EpisodeAttributes } from '../../models/season/Episodes';
// import { SeasonEliminationAttributes } from '../../models/season/SeasonEliminations';
// import { SeasonsAttributes } from '../../models/season/Seasons';
// import { SurvivorsAttributes } from '../../models/survivors/Survivors';
// import seasonEliminationRepository from '../../repositories/season/seasonEliminationRepository';
// import survivorService from './survivorService';
// import { EliminationStatus, SurvivorElimination } from '../../generated-api';
// import { ConflictError, ForbiddenError } from '../../utils/errors/errors';
// import sequelize from '../../config/db';
// import survivorRepository from '../../repositories/season/survivorRepository';
// import episodeService from './episodeService';

// const seasonEliminationService = {
//   getSurvivorEliminationStatusAtStartOfEpisode,
//   getSurvivorEliminationInfo,
//   getAllSurvivorsEliminationStatusAtStartOfEpisode,
//   eliminateSurvivors,
// };

// async function eliminateSurvivors(
//   survivorEliminations: SurvivorElimination[],
//   episodeId: UUID
// ): Promise<Map<SurvivorsAttributes['id'], EliminationStatus>> {
//   const episode = await episodeService.getEpisode('episodeId', episodeId);

//   //Check to make sure none of the eliminated survivors are eliminated yet, exist and are on the season.
//   for (const survivorElimination of survivorEliminations) {
//     const survivorBasic = await survivorService.getBasicSurvivorDetails(
//       survivorElimination.survivorId as UUID
//     );

//     const isSurvivorOnSeason = await survivorRepository.isSurvivorOnSeason(
//       survivorElimination.survivorId as UUID,
//       episode.seasonId
//     );
//     if (!isSurvivorOnSeason) {
//       throw new ForbiddenError(
//         `${survivorBasic.name} is not on season ${episode.seasonId}`
//       );
//     }

//     const eliminationStatus = await getSurvivorEliminationInfo(
//       survivorElimination.survivorId as UUID,
//       episode.seasonId
//     );
//     if (eliminationStatus.isEliminated) {
//       throw new ConflictError(
//         `${survivorElimination.survivorId} is already eliminated in episode ${eliminationStatus.episodeEliminated} on Day ${eliminationStatus.dayEliminated}`
//       );
//     }
//   }

//   const transaction = await sequelize.transaction();
//   const eliminationsRecorded = new Map<
//     SurvivorsAttributes['id'],
//     EliminationStatus
//   >();

//   for (const survivorElimination of survivorEliminations) {
//     const seasonEliminationAttributes =
//       await seasonEliminationRepository.eliminateSurvivor(
//         survivorElimination.survivorId as UUID,
//         episode.seasonId,
//         episodeId,
//         survivorElimination.day,
//         survivorElimination.rank,
//         transaction
//       );
//     eliminationsRecorded.set(
//       survivorElimination.survivorId as UUID,
//       buildSurvivorEliminationInfo(seasonEliminationAttributes)
//     );
//   }
//   await transaction.commit();

//   return eliminationsRecorded;
// }

// async function getSurvivorEliminationStatusAtStartOfEpisode(
//   survivorId: SurvivorsAttributes['id'],
//   episodeId: EpisodeAttributes['id']
// ): Promise<EliminationStatus> {
//   const survivorEliminationAttributes =
//     await seasonEliminationRepository.getEliminationStatus(
//       survivorId,
//       episodeId
//     );
//   return {
//     isEliminated: !!survivorEliminationAttributes,
//     dayEliminated: survivorEliminationAttributes?.day || null,
//     placement: survivorEliminationAttributes?.placement || null,
//     episodeEliminated: survivorEliminationAttributes?.episodeId || null,
//   };
// }

// async function getAllSurvivorsEliminationStatusAtStartOfEpisode(
//   seasonId: SeasonsAttributes['seasonId'],
//   episodeId: EpisodeAttributes['id']
// ): Promise<Record<SurvivorsAttributes['id'], EliminationStatus>> {
//   const survivors = await survivorService.getSurvivorsBySeason(seasonId);
//   const survivorIds = survivors.map((survivor) => survivor.id as UUID);
//   const seasonEliminationsAttributes =
//     await seasonEliminationRepository.getEliminationStatusForSurvivorsByStartOfEpisode(
//       survivorIds,
//       seasonId,
//       episodeId
//     );
//   return Object.keys(seasonEliminationsAttributes).reduce((acc, survivorId) => {
//     const eliminationAttributes =
//       seasonEliminationsAttributes[survivorId as SurvivorsAttributes['id']];
//     acc[survivorId as SurvivorsAttributes['id']] = buildSurvivorEliminationInfo(
//       eliminationAttributes
//     );
//     return acc;
//   }, {} as Record<SurvivorsAttributes['id'], EliminationStatus>);
// }

// async function getSurvivorEliminationInfo(
//   survivorId: SurvivorsAttributes['id'],
//   seasonId: SeasonsAttributes['seasonId']
// ): Promise<EliminationStatus> {
//   const seasonEliminationAttributes =
//     await seasonEliminationRepository.getSeasonEliminationForSurvivorOnSeason(
//       survivorId,
//       seasonId
//     );
//   return buildSurvivorEliminationInfo(seasonEliminationAttributes);
// }

// export function buildSurvivorEliminationInfo(
//   seasonEliminationAttributes: SeasonEliminationAttributes | null
// ): EliminationStatus {
//   if (!seasonEliminationAttributes) {
//     return {
//       isEliminated: false,
//       dayEliminated: null,
//       placement: null,
//       episodeEliminated: null,
//     };
//   }
//   return {
//     isEliminated: true,
//     dayEliminated: seasonEliminationAttributes.day || null,
//     placement: seasonEliminationAttributes.placement || null,
//     episodeEliminated: seasonEliminationAttributes.episodeId || null,
//   };
// }

// export default seasonEliminationService;
