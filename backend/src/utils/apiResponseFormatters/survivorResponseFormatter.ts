import { SurvivorsWithDetailsBySeasonResponseData, SurvivorWithDetailsObject } from "../../types/survivor/survivorTypes";
import formatAPIResponse from "./apiResponseFormatter";

const getSurvivorResponseDataFormatter = {
    /**
     * Formats the response data for retrieving survivors with details by season.
     * 
     * This function includes a formatted message and status code, along with an array of survivors with their details.
     *
     * ### Parameters:
     * - `statusCode` (number): The HTTP status code for the response.
     * - `message` (string): A message describing the result of the request.
     * - `survivors` (SurvivorWithDetailsObject[]): An array of survivors with their detailed information.
     *
     * ### Returns:
     * - An object of type `SurvivorsWithDetailsBySeasonResponseData` containing:
     *   - `statusCode` (number): HTTP status code for the response.
     *   - `message` (string): The message indicating the result of the request.
     *   - `survivors` (SurvivorWithDetailsObject[]): Array of survivor details.
     * 
     * @param {number} statusCode - The HTTP status code for the response.
     * @param {string} message - A message indicating the result of the request.
     * @param {SurvivorWithDetailsObject[]} survivors - Array of survivors with their details.
     * @returns {SurvivorsWithDetailsBySeasonResponseData} - The formatted response containing the survivors' details.
     */
    formatgetSurvivorsWithDetailsBySeasonResponse: (
        statusCode: number,
        message: string,
        survivors: SurvivorWithDetailsObject[]
    ): SurvivorsWithDetailsBySeasonResponseData => {
        return {
            ...formatAPIResponse(statusCode, message),
            survivors: survivors
        }
    },
};

export default getSurvivorResponseDataFormatter;