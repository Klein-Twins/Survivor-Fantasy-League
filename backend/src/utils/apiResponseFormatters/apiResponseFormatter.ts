import { APIResponseData } from "../../types/api/apiResponseTypes";

/**
 * Formats a standard API response object.
 *
 * This utility function creates a response object containing a status code and message, 
 * which can be used to send a consistent API response from your server.
 *
 * ### Parameters:
 * - `statusCode` (number): The HTTP status code for the response.
 * - `message` (string): The message to be included in the response.
 *
 * ### Returns:
 * - An object of type `APIResponseData` containing the `statusCode` and `message`.
 *
 * ### Usage:
 * ```typescript
 * const response = formatAPIResponse(200, "Request was successful");
 * console.log(response);  // { message: "Request was successful", statusCode: 200 }
 * ```
 *
 * @param {number} statusCode - The HTTP status code for the response.
 * @param {string} message - The message to be included in the response.
 * @returns {APIResponseData} - The formatted API response containing the `statusCode` and `message`.
 */
const formatAPIResponse = (statusCode: number, message: string): APIResponseData => {
    return {message, statusCode}
}

export default formatAPIResponse;