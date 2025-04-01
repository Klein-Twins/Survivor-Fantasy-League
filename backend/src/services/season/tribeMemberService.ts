import { Survivor } from '../../generated-api';
import { EpisodeAttributes } from '../../models/season/Episodes';
import { TribeAttributes } from '../../models/season/Tribes';
import tribeMemberRepository from '../../repositories/season/tribeMemberRepository';
import episodeService from './episodeService';
import survivorService from './survivorService';

const tribeMemberService = {
  getTribeMembers,
};

async function getTribeMembers(
  tribeId: TribeAttributes['id'],
  episodeId: EpisodeAttributes['episodeId']
): Promise<Survivor[]> {
  const tribeMemberIds = await tribeMemberRepository.getTribeMemberIds(
    tribeId,
    episodeId
  );

  const episode = await episodeService.getEpisode('episodeId', episodeId);

  const survivors = await Promise.all(
    tribeMemberIds.map(async (tribeMemberId) => {
      return await survivorService.getSurvivorById(
        tribeMemberId,
        episode.seasonId
      );
    })
  );

  return survivors;
}

export default tribeMemberService;
