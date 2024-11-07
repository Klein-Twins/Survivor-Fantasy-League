import CustomError from './CustomError';  // Assuming CustomError is in utils

/**
 * Factory function to generate custom errors.
 * 
 * @param {Object} responseMessage - Contains message and statusCode properties.
 * @returns {CustomError} - A new instance of the CustomError class.
 */
const errorFactory = (responseMessage: { message: string, statusCode: number }): CustomError => {
    return new CustomError(responseMessage.statusCode, responseMessage.message);
};

export default errorFactory;