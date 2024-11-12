import { Request, Response, NextFunction } from "express";
import { Account, SignupRequestFields } from "../../types/auth/authTypes";
import accountService from "../../servicesAndHelpers/auth/accountService";
import logger from "../../config/logger";
import { formatSignupData, validateSignupData } from "../../utils/auth/accountUtils";
import httpStatusCodes from 'http-status-codes';


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
            const account: Account = await accountService.createAccount(formattedSignupRequestData);
            if (!account) {
                res.sendStatus(httpStatusCodes.INTERNAL_SERVER_ERROR)
            }

            res.locals.account = account;
            next();
        } catch (error) {
            logger.error(`Error in creating account: ${error}`);
            next(error);
        }
    },
};

export default accountController;