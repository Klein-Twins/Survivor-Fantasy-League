import { Request, Response, NextFunction } from "express";
import { Account, SignupRequestFields } from "../../types/auth/authTypes";
import accountService from "../../servicesAndHelpers/auth/accountService";
import logger from "../../config/logger";
import { formatSignupData, validateSignupData } from "../../utils/auth/accountUtils";
import errorFactory from "../../utils/errors/errorFactory";


const accountController = {
    createAccount: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            logger.debug("Signup Request received.");

            //Extract signup data
            const signupRequestData: SignupRequestFields = {
                username: req.body.username,
                password: req.body.password,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
            };

            //Validate and format request data
            validateSignupData(signupRequestData);
            const formattedSignupRequestData = formatSignupData(signupRequestData);

            //Create account
            logger.debug("Attempting to create account");
            const account: Account = await accountService.createAccount(formattedSignupRequestData);
            if (!account) {
                throw errorFactory({ statusCode: 500 })
            }

            res.locals.message = "User signed up successfully"
            res.locals.account = account;
            res.status(201);
            next();
        } catch (error) {
            logger.error(`Error in creating account: ${error}`);
            next(error);
        }
    },
};

export default accountController;