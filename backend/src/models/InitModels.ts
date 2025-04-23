import { Sequelize } from 'sequelize';
import UserModel from './account/User';
import PasswordModel from './account/Password';
import SurvivorsModel from './survivors/Survivors';
import SeasonsModel from './season/Seasons';
import LeagueModel from './league/League';
import SurvivorDetailsOnSeasonModel from './survivors/SurvivorDetailsOnSeason';
import ProfileModel from './account/Profile';
import TokensModel from './account/Tokens';
import LeagueProfileModel from './league/LeagueProfile';
import TribeModel from './season/Tribes';
import EpisodeModel from './season/Episodes';
import SurveyModel from './surveyAndPick/Survey';
import SurveyPicksModel from './surveyAndPick/SurveyPicks';
import LeagueSurveyForEpisodeModel from './league/LeagueSurveysForEpisode';
import ChallengeModel from './season/challenges/Challenges';
import SeasonEliminationsModel from './season/SeasonEliminations';
import ChallengeWinnersModel from './season/challenges/ChallengeWinners';
import PicksModel from './surveyAndPick/picks/Picks';
import PickOptionsModel from './surveyAndPick/picks/PickOptions';
import PickPointsModel from './surveyAndPick/picks/PickPoints';
import ProfilePickModel from './league/LeagueProfilePicks';
import PickTypeModel from './surveyAndPick/picks/PickType';
import logger from '../config/logger';
import SurveySubmissionModel from './league/SurveySubmissions';
import PickSubmissionModel from './league/PickSubmission';
import EpisodeSurveyModel from './surveyAndPick/EpisodeSurvey';
import TribeMembersModel from './season/TribeMembers';
import PickSolutionModel from './surveyAndPick/picks/PickSolutions';
import TribalCouncilModel from './season/tribalCouncil/TribalCouncil';
import TribalCouncilSurvivorsModel from './season/tribalCouncil/TribalCouncilSurvivors';

const initModels = (sequelize: Sequelize) => {
  logger.debug('Initializing models');

  const User = UserModel(sequelize);
  const Password = PasswordModel(sequelize);
  const Survivors = SurvivorsModel(sequelize);
  const Seasons = SeasonsModel(sequelize);
  const League = LeagueModel(sequelize);
  const SurvivorDetailsOnSeason = SurvivorDetailsOnSeasonModel(sequelize);
  const Profile = ProfileModel(sequelize);
  const Tokens = TokensModel(sequelize);
  const LeagueProfile = LeagueProfileModel(sequelize);
  const Picks = PicksModel(sequelize);
  const PickOptions = PickOptionsModel(sequelize);
  const PickPoints = PickPointsModel(sequelize);
  //const PickType = PickTypeModel(sequelize);
  //const ProfilePick = ProfilePickModel(sequelize);
  //const PickSolution = PickSolutionModel(sequelize);
  const Episode = EpisodeModel(sequelize);
  const Tribe = TribeModel(sequelize);
  const Survey = SurveyModel(sequelize);
  const EpisodeSurvey = EpisodeSurveyModel(sequelize);
  const SurveyPicks = SurveyPicksModel(sequelize);
  const LeagueSurveyForEpisode = LeagueSurveyForEpisodeModel(sequelize);
  const Challenges = ChallengeModel(sequelize);
  const ChallengeWinners = ChallengeWinnersModel(sequelize);
  const SeasonEliminations = SeasonEliminationsModel(sequelize);
  const SurveySubmissions = SurveySubmissionModel(sequelize);
  const PickSubmissions = PickSubmissionModel(sequelize);
  const TribeMembers = TribeMembersModel(sequelize);
  const PickSolutions = PickSolutionModel(sequelize);
  const TribalCouncils = TribalCouncilModel(sequelize);
  const TribalCouncilSurvivors = TribalCouncilSurvivorsModel(sequelize);

  logger.debug('Models initialized');

  User.associate({ Password, Profile });
  Profile.associate({ User, LeagueProfile });
  Password.associate({ User });
  League.associate({ Seasons, LeagueProfile, LeagueSurveyForEpisode });
  Survivors.associate({
    SurvivorDetailsOnSeason,
  });
  Seasons.associate({
    SurvivorDetailsOnSeason,
    League,
    Episode,
    SeasonEliminations,
    Tribe,
  });
  SurvivorDetailsOnSeason.associate({
    Survivors,
    Seasons,
    SeasonEliminations,
    ChallengeWinners,
    TribeMembers,
    TribalCouncilSurvivors,
  });

  LeagueProfile.associate({ League, Profile, SurveySubmissions });
  Tribe.associate({
    ChallengeWinners,
    Seasons,
    Episode,
    TribeMembers,
    TribalCouncils,
  });
  Episode.associate({
    Seasons,
    Challenges,
    Tribe,
    TribeMembers,
    EpisodeSurvey,
    PickSolutions,
    TribalCouncils,
  });
  SeasonEliminations.associate({
    Seasons,
    SurvivorDetailsOnSeason,
    TribalCouncils,
  });
  ChallengeWinners.associate({
    Tribe,
    Challenges,
    SurvivorDetailsOnSeason,
  });
  TribeMembers.associate({ Tribe, Episode, SurvivorDetailsOnSeason });
  EpisodeSurvey.associate({
    Survey,
    Episode,
    LeagueSurveyForEpisode,
    PickSolutions,
  });
  Survey.associate({ EpisodeSurvey, SurveyPicks });
  SurveyPicks.associate({ Survey, Picks });
  LeagueSurveyForEpisode.associate({
    EpisodeSurvey,
    League,
    SurveySubmissions,
  });
  Picks.associate({
    SurveyPicks,
    PickSubmissions,
    PickPoints,
    PickOptions,
    PickSolutions,
  });
  //Todo add associations with tokens
  Tokens.associate({});
  PickPoints.associate({ Picks });
  SurveySubmissions.associate({
    PickSubmissions,
    LeagueProfile,
    LeagueSurveyForEpisode,
  });
  PickSubmissions.associate({ SurveySubmissions, Picks });
  Challenges.associate({ Episode, ChallengeWinners });
  PickOptions.associate({ Picks });
  PickSolutions.associate({
    Picks,
    EpisodeSurvey,
    Episode,
  });

  TribalCouncilSurvivors.associate({ TribalCouncils, SurvivorDetailsOnSeason });
  TribalCouncils.associate({
    Tribe,
    TribalCouncilSurvivors,
    Episode,
    SeasonEliminations,
  });

  logger.debug('Models associated');

  return {
    sequelize,
    User,
    Password,
    Survivors,
    Seasons,
    League,
    SurvivorDetailsOnSeason,
    Profile,
    Tokens,
    LeagueProfile,
    Picks,
    //PickOptions,
    PickPoints,
    //PickType,
    //ProfilePick,
    //PickSolution,
    Tribe,
    Episode,
    Survey,
    LeagueSurveyForEpisode,
    SurveyPicks,
    Challenges,
    ChallengeWinners,
    SeasonEliminations,
    SurveySubmissions,
    PickSubmissions,
    EpisodeSurvey,
    TribeMembers,
    PickOptions,
    PickSolutions,
    TribalCouncils,
    TribalCouncilSurvivors,
  };
};

export default initModels;
