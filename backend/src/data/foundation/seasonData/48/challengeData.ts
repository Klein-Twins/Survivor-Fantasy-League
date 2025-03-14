import {
  ChallengeAttributes,
  ChallengeType,
} from '../../../../models/season/challenges/Challenges';
import { season48ChallengeIds, season48EpisodeIds } from '../../foundationIds';

const season48ChallengesData: ChallengeAttributes[] = [
  //Episode 1 Reward Challenge
  {
    challengeId: season48ChallengeIds.episode1.reward1,
    description: 'Marooning Challenge: Mud, Sweat and Precision',
    notes:
      'Each tribe formed 3 pairs. Each pair sprinted down the beach and crawled through a mud pit under a heavy cargo net and then ran to retrieve a heavy chest and carry it back to their mat before the next pair could go. After retrieving all three chests, three tribe members climbed a steep slide to the top of a platform. Using a pole they knocked off a key ring used to open the chest. They retrieved sandbags from the chest and tossed sand bags onto three small high platforms. The first tribe to land all three sandbags on the platforms won a pot, machete, and flint.',
    episodeId: season48EpisodeIds.episode1,
    type: ChallengeType.REWARD,
  },
  {
    challengeId: season48ChallengeIds.episode1.reward2,
    description: 'Supply Challenge: Water Supply',
    notes:
      'Following a buried rope that had a machete locked to the end, they used the machete to chop open a coconut to retrieve a key to unlock the machete. They then had to retrieve a pot from the top of a tall pole by any means possible. They filled the pot with seawater and used that to fill a large glass jug to float a key to the top that would unlock a flint. The one who unlocked the flint won the supplies. Kevin won when Kyle accidentally broke his jug. Kyle, in a demonstration of sportsmanship, then helped Kevin finish filling his bottle.',
    episodeId: season48EpisodeIds.episode1,
    type: ChallengeType.REWARD,
  },
  //Episode 1 Immunity Challenge
  {
    challengeId: season48ChallengeIds.episode1.rewardAndImmunity1,
    notes:
      'Survivors raced over a massive net ramp and through a net tunnel. Then one player used a Fijian war club to smash a mask releasing a box with a key in it. The key unlocked a heavy sled that the team moved down a track, then over some sandbags and finally up an incline to the top of a tall platform. Two players then used the pieces inside the sled to assemble a Survivor logo puzzle. The first two teams to finish won immunity plus a large shelter-building kit for first place and a smaller toolkit for second place while the losing tribe had to forfeit their flint.',
    description: 'Relay into a puzzle',
    episodeId: season48EpisodeIds.episode1,
    type: ChallengeType.REWARD_AND_IMMUNITY,
  },

  //Episode 2 Reward Challenge
  {
    challengeId: season48ChallengeIds.episode2.rewardAndImmunity1,
    notes:
      'Starting on a floating platform, one survivor climbed a ladder to the top of the platform and dove into the water to swim under a platform and released two buoys. They then placed the buoys in trays on the platform and then swam under a second platform and then over to a third platform. Once at the platform. The remaining survivors swam in pairs to the first platform and working together, transported the buoys over a balance beam. Once all players had reached the final platform with the buoys, they took turns shooting the buoys into a basket. The first two tribes to finish won immunity and a fishing kit.',
    description: 'Buoy Oh Buoy',
    episodeId: season48EpisodeIds.episode2,
    type: ChallengeType.REWARD_AND_IMMUNITY,
  },

  //Episode 2 Immunity Challenge
  {
    challengeId: season48ChallengeIds.episode3.rewardAndImmunity1,
    description: 'Blind obstacle course with a sliding puzzle.',
    notes:
      'A caller for each tribe directed their three blindfolded tribemates around and through obstacles searching for three key bags that were used to unlock a slide puzzle. The caller then led the blindfolded members to the puzzle table and directed a still-blindfolded tribemate in solving the puzzle. The first two tribes to complete their puzzle won immunity and a large comfort kit for first place and a smaller tarp for second place.',
    episodeId: season48EpisodeIds.episode2,
    type: ChallengeType.REWARD_AND_IMMUNITY,
  },
];

export default season48ChallengesData;
