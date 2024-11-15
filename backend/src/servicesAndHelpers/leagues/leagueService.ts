import { sequelize } from "../../config/db";
import { LeagueAttributes } from "../../models/League";
import { LeagueProfileAttributes } from "../../models/LeagueProfile";
import leagueRepository from "../../repositories/leagueRepository";
import errorFactory from "../../utils/errors/errorFactory";

const leagueService = {
  createLeague: async (
    seasonId: number,
    leagueName: string,
    profileId: string
  ): Promise<LeagueAttributes> => {
    const transaction = await sequelize.transaction();
    try {
      const league: LeagueAttributes = await leagueRepository.createLeague(seasonId, leagueName, {transaction});

      const leagueProfile: LeagueProfileAttributes =
        await leagueRepository.createLeagueProfile(profileId, league.leagueId, "LEAGUE_OWNER", {transaction}
        );

      if (!leagueProfile) {
        throw errorFactory({
          statusCode: 400,
          message: "Unable to create LeagueProfile association",
        });
      }

      await transaction.commit();

      return league;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
  getLeagueByLeagueId: async (leagueId: string): Promise<LeagueAttributes> => {
    const league: LeagueAttributes | null =
      await leagueRepository.findLeagueByLeagueId(leagueId);
    if (!league) {
      throw errorFactory({
        statusCode: 404,
        message: `Unable to find league with league id: ${leagueId}`,
      });
    }
    return league;
  },
  getLeaguesForProfile: async (
    profileId: string
  ): Promise<LeagueAttributes[]> => {
    try {
      const leagueProfileList: LeagueProfileAttributes[] =
        await leagueRepository.findLeagueProfileByProfileId(profileId);

      console.log(leagueProfileList);
      const leagues = await Promise.all(
        leagueProfileList.map(async (leagueProfile) => {
          const league = await leagueRepository.findLeagueByLeagueId(
            leagueProfile.leagueId
          );
          return league;
        })
      );

      return leagues.filter((league) => league !== null);
    } catch (error) {
      console.error("Error fetching leagues for profile:", error);
      throw new Error("Could not fetch leagues for profile");
    }
  },
};

export default leagueService;
