/* tslint:disable */
/* eslint-disable */
/**
 * Survivor Fantasy League - OpenAPI 3.0.3
 * This is the Survivor Fantasy League Spec for API's
 *
 * OpenAPI spec version: 1.0.11
 * Contact: pklein111697@gmail.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

 /**
 * 
 *
 * @export
 * @interface SignupUserRequestBody
 */
export interface SignupUserRequestBody {

    /**
     * Email address for the new user
     *
     * @type {string}
     * @memberof SignupUserRequestBody
     * @example user@example.com
     */
    email: string;

    /**
     * Password for the new account
     *
     * @type {string}
     * @memberof SignupUserRequestBody
     * @example StrongPassword123!
     */
    password: string;

    /**
     * Unique username for the account
     *
     * @type {string}
     * @memberof SignupUserRequestBody
     * @example SurvivorFan69
     */
    userName: string;

    /**
     * First name of the user
     *
     * @type {string}
     * @memberof SignupUserRequestBody
     * @example Jeff
     */
    firstName?: string;

    /**
     * Last name of the user
     *
     * @type {string}
     * @memberof SignupUserRequestBody
     * @example Probst
     */
    lastName?: string;
}
