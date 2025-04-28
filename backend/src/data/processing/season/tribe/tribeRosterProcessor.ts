import { container } from 'tsyringe';
import { Episode } from '../../../../domain/season/episode/Episode';
import { Season } from '../../../../domain/season/Season';
import { TribeHelper } from '../../../../helpers/season/tribe/tribeHelper';
import { TribeAttributes } from '../../../../models/season/Tribes';
import { SurvivorsAttributes } from '../../../../models/survivors/Survivors';
import { SeasonSurvivor } from '../../../../domain/season/survivor/SeasonSurvivor';
import logger from '../../../../config/logger';

const tribeRosterProcessor = {
  populateTribeRosterAtEpisodeStart,
  populateTribeRosterAtEpisodeEnd,
  populateTribeRosterAtEpisodeTribalCouncil,
  processTribeMemberSwitch,
};

function processTribeMemberSwitch(
  season: Season,
  episode: Episode,
  tribeSwitchData: {
    survivorId: SurvivorsAttributes['id'];
    tribeId: TribeAttributes['id'];
  }[]
) {
  const { id: currentEpisodeId, number: currentEpisodeNumber } =
    episode.getAttributes();

  const tribesActiveOnEpisodeStart = container
    .resolve(TribeHelper)
    .getActiveTribesOnEpisodeTribal(episode);

  //Go through each active tribe and update survivor roster for tribal council
  for (const activeTribe of tribesActiveOnEpisodeStart) {
    //Active tribe members at the start of the episode
    const tribeMembersAtEpisodeStart =
      activeTribe.getTribeMemberRosterOnEpisode(currentEpisodeId);

    //Filter out tribe members that will not be switched (aka, survivor Id is not in tribeSwitchData)
    const tribeMembersStillOnTribeAfterTribeSwitch =
      tribeMembersAtEpisodeStart.episodeStart.filter(
        (tribeMemberAtEpisodeStart) => {
          return !tribeSwitchData.some(
            (tribeSwitch) =>
              tribeSwitch.survivorId ===
              tribeMemberAtEpisodeStart.getAttributes().id
          );
        }
      );
    const existingTribeMembers: SeasonSurvivor[] = season.getSurvivorsByIds(
      tribeMembersStillOnTribeAfterTribeSwitch.map(
        (tribeMemberStillOnTribe) => tribeMemberStillOnTribe.getAttributes().id
      )
    );

    //Filter out tribe members that will be switched to current working tribe
    const tribeMembersToAddToTribeAfterTribeSwitch = tribeSwitchData.filter(
      (tribeSwitch) => {
        return tribeSwitch.tribeId === activeTribe.getAttributes().id;
      }
    );
    const tribeMembersToAdd: SeasonSurvivor[] = season.getSurvivorsByIds(
      tribeMembersToAddToTribeAfterTribeSwitch.map(
        (tribeMemberToSwitchIntoTribe) =>
          tribeMemberToSwitchIntoTribe.survivorId
      )
    );

    activeTribe
      .getTribeMemberRoster()
      .addTribeMembers(currentEpisodeId, 'episodeTribalCouncil', [
        ...existingTribeMembers,
        ...tribeMembersToAdd,
      ]);

    // //Remove tribe members that are being switched to another tribe
    // activeTribe.getTribeMemberRosterOnEpisode(currentEpisodeId).episodeEnd = [];
  }
}

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

  if (
    episode.getAttributes().isTribeSwitch ||
    episode.getEpisodeEvents().getMerge()
  ) {
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

  if (episode.getEpisodeEvents().getMerge()) {
    logger.debug('Break point');
  }

  const activeTribesOnEpisodeEnd = container
    .resolve(TribeHelper)
    .getActiveTribesOnEpisodeEnd(episode);

  activeTribesOnEpisodeEnd.forEach((tribe) => {
    if (
      episode.getEpisodeEvents().getMerge() &&
      tribe.getAttributes().mergeTribe
    ) {
      const nonMergeTribes = season
        .getTribes()
        .filter((tribe) => tribe.getAttributes().mergeTribe === false);

      const survivorsIncludingEliminated = nonMergeTribes
        .map((tribe) => {
          return tribe
            .getTribeMemberRosterOnEpisode(currentEpisodeId)
            .episodeStart.map((tm) => tm);
        })
        .flat();

      const survivors = survivorsIncludingEliminated.filter((tm) => {
        const eliminatedSurvivors = episode
          .getEpisodeEvents()
          .getTribalCouncils()
          .map((tc) => tc.getEliminatedSurvivor());

        //Remove eliminated survivors from survivorsIncludingEliminated
        return !eliminatedSurvivors.some(
          (eliminatedSurvivor) =>
            tm.getAttributes().id === eliminatedSurvivor.getAttributes().id
        );
      });

      tribe
        .getTribeMemberRoster()
        .addTribeMembers(episode.getAttributes().id, 'episodeEnd', survivors);
    }

    const tribeMembersAtEpisodeStart =
      tribe.getTribeMemberRosterOnEpisode(
        currentEpisodeId
      ).episodeTribalCouncil;
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
