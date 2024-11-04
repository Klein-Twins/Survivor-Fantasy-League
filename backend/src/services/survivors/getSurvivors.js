const { RESPONSE_MESSAGES } = require("../../routes/ResponseMessageConstants.js");
const SeasonSurvivorCastMembers = require("../../models/SeasonSurvivorCastMembers.js");
const Survivors = require("../../models/Survivors.js");
const Seasons = require("../../models/Seasons.js");

class CustomError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

const getSurvivorsBySeasonService = async (seasonId) => {
    if(!seasonId) {
        throw new CustomError(RESPONSE_MESSAGES.SURVIVORS.GETSURVIVORS.BAD_REQUEST_MISSING_SEASON_ID.statusCode, RESPONSE_MESSAGES.SURVIVORS.GETSURVIVORS.BAD_REQUEST_MISSING_SEASON_ID.message);
    }
    const seasonIdAsInteger = parseInt(seasonId, 10);
    if(!Number.isInteger(seasonIdAsInteger)) {
        throw new CustomError(RESPONSE_MESSAGES.SURVIVORS.GETSURVIVORS.BAD_REQUEST_INVALID_SEASON_ID.statusCode, RESPONSE_MESSAGES.SURVIVORS.GETSURVIVORS.BAD_REQUEST_INVALID_SEASON_ID.message)
    }

    const survivors = await SeasonSurvivorCastMembers.findAll({
        where: { SEASON_ID: seasonIdAsInteger},
        include: [
            {
                model: Survivors,
                attributes: ['FIRST_NAME', 'LAST_NAME', 'NICK_NAME', 'FROM_CITY', 'FROM_STATE', 'FROM_COUNTRY']
            },
            {
                model: Seasons,
                attributes: [],
            },
        ]
    });

    if (survivors.length === 0) {
        throw new CustomError(RESPONSE_MESSAGES.SURVIVORS.GETSURVIVORS.NOT_FOUND_SEASON.statusCode, RESPONSE_MESSAGES.SURVIVORS.GETSURVIVORS.NOT_FOUND_SEASON.message);
    }

    transformedSurvivors = [];
    survivors.forEach((survivor) => {
        transformedSurvivors.push({
            survivorId: survivor.SURVIVOR_ID,
            seasonId: survivor.SEASON_ID,
            firstName: survivor.Survivor.FIRST_NAME,
            lastName: survivor.Survivor.LAST_NAME,
            nickName: survivor.Survivor.NICK_NAME,
            originalTribeId: survivor.ORIGINAL_TRIBE_ID,
            age: survivor.AGE,
            description: survivor.DESCRIPTION,
            job: survivor.JOB,
            fromCity: survivor.Survivor.FROM_CITY,
            fromState: survivor.Survivor.FROM_STATE,
            fromCountry: survivor.Survivor.FROM_COUNTRY
        })
    })

    return {
        statusCode: RESPONSE_MESSAGES.SURVIVORS.GETSURVIVORS.OK.statusCode,
        message: RESPONSE_MESSAGES.SURVIVORS.GETSURVIVORS.OK.message,
        survivors: transformedSurvivors
    };
}

module.exports = { getSurvivorsBySeasonService };