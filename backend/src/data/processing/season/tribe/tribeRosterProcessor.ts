import { container } from 'tsyringe';
import { Episode } from '../../../../domain/season/episode/Episode';
import { Season } from '../../../../domain/season/Season';
import { TribeHelper } from '../../../../helpers/season/tribe/tribeHelper';

const tribeRosterProcessor = {
  populateTribeRosterAtEpisodeStart,
  populateTribeRosterAtEpisodeEnd,
  populateTribeRosterAtEpisodeTribalCouncil,
};

function populateTribeRosterAtEpisodeStart(
  season: Season,
  episode: Episode
): void {
  const { id: currentEpisodeId, number: currentEpisodeNumber } =
    episode.getAttributes();

  //This should be handled in the tribeStart event processor
  if (currentEpisodeNumber === 1) {
    return;
  }

  const { id: prevEpisodeId, number: prevEpisodeNumber } = season
    .getEpisodeByNumber(currentEpisodeNumber - 1)
    .getAttributes();

  const tribesActiveOnEpisodeStart = container
    .resolve(TribeHelper)
    .getActiveTribesOnEpisodeStart(episode);

  tribesActiveOnEpisodeStart.forEach((tribe) => {
    const tribeMemberRosterOnPreviousEpisode =
      tribe.getTribeMemberRosterOnEpisode(prevEpisodeId);
    tribe
      .getTribeMemberRoster()
      .addTribeMembers(
        currentEpisodeId,
        'episodeStart',
        tribeMemberRosterOnPreviousEpisode.episodeEnd
      );
  });
}

//Should not run if episode has a tribe switch
function populateTribeRosterAtEpisodeTribalCouncil(
  season: Season,
  episode: Episode
) {
  const { id: currentEpisodeId, number: currentEpisodeNumber } =
    episode.getAttributes();

  if (episode.getAttributes().isTribeSwitch) {
    return;
  }

  //Get tribes active at Tribal Council
  const tribesActiveOnEpisodeTribalCouncil = container
    .resolve(TribeHelper)
    .getActiveTribesOnEpisodeTribal(episode);

  tribesActiveOnEpisodeTribalCouncil.forEach((tribe) => {
    const tribeMembersAtEpisodeStart =
      tribe.getTribeMemberRosterOnEpisode(currentEpisodeId).episodeStart;

    tribe
      .getTribeMemberRoster()
      .addTribeMembers(
        currentEpisodeId,
        'episodeTribalCouncil',
        tribeMembersAtEpisodeStart
      );
  });
}

function populateTribeRosterAtEpisodeEnd(season: Season, episode: Episode) {
  const { id: currentEpisodeId, number: currentEpisodeNumber } =
    episode.getAttributes();

  const activeTribesOnEpisodeEnd = container
    .resolve(TribeHelper)
    .getActiveTribesOnEpisodeEnd(episode);

  activeTribesOnEpisodeEnd.forEach((tribe) => {
    const tribeMembersAtEpisodeStart =
      tribe.getTribeMemberRosterOnEpisode(currentEpisodeId).episodeStart;
    const survivorsEliminatedAtTribalCouncil = episode
      .getEpisodeEvents()
      .getTribalCouncils()
      .map((tribalCouncil) => tribalCouncil.getEliminatedSurvivor());

    const tribeMembersAtEpisodeEnd = tribeMembersAtEpisodeStart.filter(
      (tribeMember) =>
        !survivorsEliminatedAtTribalCouncil.some(
          (eliminatedSurvivor) =>
            tribeMember.getAttributes().id ===
            eliminatedSurvivor.getAttributes().id
        )
    );
    tribe
      .getTribeMemberRoster()
      .addTribeMembers(
        currentEpisodeId,
        'episodeEnd',
        tribeMembersAtEpisodeEnd
      );
  });
}

export default tribeRosterProcessor;
