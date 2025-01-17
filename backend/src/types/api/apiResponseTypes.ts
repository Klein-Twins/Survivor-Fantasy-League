// Common types for API responses

/**
 * The general structure for API response data.
 * This can be used for any API response that includes a status code and a message.
 */
export interface APIResponse {
    statusCode: number;
    message?: string;
    error?: string;
    success?: boolean | null | undefined
}

/**
 * A more specific error response structure extending the base API response.
 * This can be used for all error responses.
 */
export interface APIResponseError extends APIResponse {
    error?: string
}