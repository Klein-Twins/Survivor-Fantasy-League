import { SurvivorBasic } from '../../generated-api';
import { EpisodeAttributes } from '../../models/season/Episodes';
import { TribeAttributes } from '../../models/season/Tribes';
import tribeMemberRepository, {
  TribeMemberQueryResult,
} from '../../repositories/season/tribeMemberRepository';
import episodeService from './episodeService';

const tribeMemberService = {
  getTribeMembers,
};

async function getTribeMembers(
  tribeId: TribeAttributes['id'],
  episodeId: EpisodeAttributes['episodeId']
): Promise<SurvivorBasic[]> {
  const tribeMemberHistory = await tribeMemberRepository.fetchTribeHistory(
    tribeId
  );
  const tribeMembersOnEpisode = await getTribeMembersOnEpisode(
    tribeMemberHistory,
    episodeId
  );
  return tribeMembersOnEpisode;
}

async function getTribeMembersOnEpisode(
  tribeMemberHistory: TribeMemberQueryResult[],
  episodeId: EpisodeAttributes['episodeId']
): Promise<SurvivorBasic[]> {
  const episode = await episodeService.getEpisode('episodeId', episodeId);
  const episodeNumber = episode.number;
  const allEpisodes = await episodeService.getAllEpisodesInSeason(
    episode.seasonId
  );

  // Dynamically determine if a tribe switch exists
  const tribeSwitchEpisode = Array.from(allEpisodes.values()).find(
    (ep) => ep.isTribeSwitch
  );
  const tribeSwitchEpisodeNumber = tribeSwitchEpisode
    ? tribeSwitchEpisode.number
    : null; // If no tribe switch, set to null

  const tribeMembersOnEpisode = tribeMemberHistory.filter((member) => {
    const startEpisodeNumber = allEpisodes.get(member.episodeIdStart)!.number;
    const endEpisodeNumber =
      member.episodeIdEnd !== null
        ? allEpisodes.get(member.episodeIdEnd)!.number
        : null;

    if (episodeNumber === 1 && startEpisodeNumber === 1) {
      return true;
    }

    //Case Tribe Switch has not happened.
    if (
      tribeSwitchEpisodeNumber === null ||
      tribeSwitchEpisodeNumber > episodeNumber
    ) {
      return (
        startEpisodeNumber < episodeNumber && // Joined before the given episode
        (endEpisodeNumber === null || endEpisodeNumber >= episodeNumber) && // Still in the tribe or left after the given episode
        (tribeSwitchEpisodeNumber === null ||
          episodeNumber <= tribeSwitchEpisodeNumber) // If tribe switch exists, ensure it's before or at the switch
      );
    } else {
      //Case Tribe Switch has happened.
      return (
        startEpisodeNumber < episodeNumber && // Joined before the given episode
        (endEpisodeNumber === null || endEpisodeNumber >= episodeNumber) && // Still in the tribe or left after the given episode
        (tribeSwitchEpisodeNumber === null ||
          episodeNumber >= tribeSwitchEpisodeNumber) // If tribe switch exists, ensure it's before or at the switch
      );
    }
  });

  return tribeMembersOnEpisode.map((member) => ({
    id: member.survivor.id,
    firstName: member.survivor.firstName,
    lastName: member.survivor.lastName,
    name: `${member.survivor.firstName} ${member.survivor.lastName}`,
  }));
}

export default tribeMemberService;
