import { APIResponseError } from "../../types/api/apiResponseTypes";
import CustomError, {ValidationError, NotFoundError, InternalServerError, UnauthorizedError, ForbiddenError} from './errors';


const errorFactory = (error : APIResponseError): CustomError => {
    
    switch (error.statusCode) {
        case 400:
            return new ValidationError(error.message);
        case 404:
            return new NotFoundError(error.message);
        case 500:
            return new InternalServerError(error.message);
        case 401:
            return new UnauthorizedError(error.message);
        case 403:
            return new ForbiddenError(error.message);
        default:
            return new CustomError(error.statusCode, error.message);
    }
};

export default errorFactory