import { models } from "../config/db";
import errorFactory from "../utils/errors/errorFactory";
import logger from "../config/logger";
import { NOT_FOUND_ERROR } from "../constants/auth/responseErrorConstants";
import { SurvivorDetailsOnSeasonIncludeSurvivors } from "../types/survivor/survivorTypes";
import { SurvivorDetailsOnSeasonAttributes } from "../models/SurvivorDetailsOnSeason";
import { Survivor } from "../generated-api";
import { SurvivorsAttributes } from "../models/Survivors";

const survivorRepository = {
    getSurvivorsBySeasonId
}

function buildSurvivor(survivorAttributes: SurvivorsAttributes, SurvivorDetailsOnSeason: SurvivorDetailsOnSeasonAttributes): Survivor {
    return {
        survivorId: survivorAttributes.survivorId,
        firstName: survivorAttributes.firstName,
        lastName: survivorAttributes.lastName,
        fromCity: survivorAttributes.fromCity,
        fromState: survivorAttributes.fromState,
        fromCountry: survivorAttributes.fromCountry,
        nickName: survivorAttributes.nickName,
        seasonId: SurvivorDetailsOnSeason.seasonId,
        age: SurvivorDetailsOnSeason.age,
        description: SurvivorDetailsOnSeason.description,
        job: SurvivorDetailsOnSeason.job,
        imageUrl: SurvivorDetailsOnSeason.imageUrl
    }
}


async function getSurvivorBySurvivorId(survivorId: string): Promise<Survivor | null> {
    try {
        const survivorAttributes: SurvivorsAttributes | null = await models.Survivors.findOne({
            where: {
                survivorId: survivorId
            }
        });
        if (!survivorAttributes) {
            logger.error(`No survivor found for survivorId ${survivorId}`);
            return null;
        }

        const SurvivorDetailsOnSeason: SurvivorDetailsOnSeasonAttributes | null = await models.SurvivorDetailsOnSeason.findOne({
            where: {
                survivorId: survivorId
            }
        });
        if (!SurvivorDetailsOnSeason) {
            logger.error(`No survivor details found for survivorId ${survivorId}`);
            return null;
        }

        return buildSurvivor(survivorAttributes, SurvivorDetailsOnSeason);


    } catch (error) {
        logger.error(`Error retrieving survivor from DB for survivorId ${survivorId}: ${error}`);
        throw error;
    }
}

async function getSurvivorsBySeasonId(seasonId: number): Promise<Survivor[]> {
    try {

        const survivorsDetailAttributes: SurvivorDetailsOnSeasonAttributes[] = await models.SurvivorDetailsOnSeason.findAll({
            where: {
                seasonId: seasonId
            }
        });

        let survivors: Survivor[] = [];
        for (const survivorDetailAttributes of survivorsDetailAttributes) {
            const survivorId = survivorDetailAttributes.survivorId;
            const survivor: Survivor | null = await getSurvivorBySurvivorId(survivorId)
            if (survivor) {
                survivors.push(survivor);
            } else {
                logger.error(`No survivor found for survivorId ${survivorId}`);
            }
        }
        return survivors;

    } catch (error) {
        logger.error(`Error retrieving survivors from DB for season ${seasonId}: ${error}`);
        throw error;
    }
}

export default survivorRepository;