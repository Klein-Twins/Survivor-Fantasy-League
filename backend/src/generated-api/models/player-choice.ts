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
 * @interface PlayerChoice
 */
export interface PlayerChoice {

    /**
     * The choice made by the player
     *
     * @type {string}
     * @memberof PlayerChoice
     * @example UUID of survivor
     */
    playerChoice: string;

    /**
     * The rank of the choice
     *
     * @type {number}
     * @memberof PlayerChoice
     * @example 1
     */
    rank: number;
}
