// import { injectable } from 'tsyringe';
// import { SeasonsAttributes } from '../../../../models/season/Seasons';
// import { SurvivorsAttributes } from '../../../../models/survivors/Survivors';
// import { models } from '../../../../config/db';

// @injectable()
// export class SurvivorEliminationRepository {
//   async findSurvivorElimination(
//     seasonId: SeasonsAttributes['seasonId'],
//     survivorId: SurvivorsAttributes['id']
//   ) {
//     const survivorElimination = await models.SeasonEliminations.findOne({
//       where: {
//         seasonId: seasonId,
//         survivorId: survivorId,
//       },
//     }).then((elimination) =>
//       elimination ? elimination.get({ plain: true }) : null
//     );

//     if (!survivorElimination) {
//       throw new Error(`Survivor with ID ${survivorId} not found`);
//     }

//     return survivorElimination;
//   }
// }
