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
 * @interface LoginUserRequestBody
 */
export interface LoginUserRequestBody {

    /**
     * Email address of the user
     *
     * @type {string}
     * @memberof LoginUserRequestBody
     * @example user@example.com
     */
    email: string;

    /**
     * Password for the user account
     *
     * @type {string}
     * @memberof LoginUserRequestBody
     * @example StrongPassword123!
     */
    password: string;
}
