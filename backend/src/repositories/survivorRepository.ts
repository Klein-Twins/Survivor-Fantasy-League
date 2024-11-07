import { models } from "../config/db";
import { SeasonSurvivorWithDetailsAttributes } from "../types/survivor/survivorTypes";

/**
 * A repository for interacting with the `Survivors` and `Seasons` models in the database.
 * This repository includes methods to retrieve detailed survivor information associated with specific seasons.
 * 
 * The `survivorRepository` provides the following function:
 * - `getSurvivorsWithDetailsInSeason`: Retrieves survivors associated with a given season, including their details such as name, nickname, and location.
 * 
 * @module survivorRepository
 */
const survivorRepository = {
    /**
     * Retrieves a list of survivors associated with a specific season along with their detailed information.
     * The function fetches survivors' first and last names, nicknames, and locations (city, state, country) from the `Survivors` model.
     * Additionally, it joins the `Seasons` model to associate the survivors with the season they participated in.
     * 
     * @param {number} seasonId - The ID of the season for which survivor details are to be retrieved.
     * 
     * @returns {Promise<SeasonSurvivorWithDetails[]>} - A promise that resolves to an array of `SeasonSurvivorWithDetails` objects,
     *          each representing a survivor and their details within the specified season.
     * 
     * @throws {Error} - If there is an issue fetching the survivor details from the database.
     * 
     * @example
     * const seasonId = 1; // Example season ID
     * const survivors = await survivorRepository.getSurvivorsWithDetailsInSeason(seasonId);
     */
    getSurvivorsWithDetailsInSeason: async (seasonId: number): Promise<SeasonSurvivorWithDetailsAttributes[]> => {
        const results = await models.SeasonSurvivorCastMembers.findAll({
            where: { SEASON_ID: seasonId },
            include: [
                {
                    model: models.Survivors,
                    required: true,
                }
            ],
        });
        
        return results as unknown as SeasonSurvivorWithDetailsAttributes[];
    },
};

export default survivorRepository;