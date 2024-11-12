import errorFactory from "../errors/errorFactory";

export const validateQuery = (seasonId : any): void => {
    // 1. Validate that seasonId is present
    if (!seasonId) {
        throw errorFactory({ message: "Missing seasonId", statusCode: 400 });
    }

    // 2. Parse seasonId as an integer and ensure it is a valid number
    const season = parseInt(seasonId as string, 10);
    if (isNaN(season)) {
        throw errorFactory({ message: "seasonId must be a valid number", statusCode: 400 });
    }
}