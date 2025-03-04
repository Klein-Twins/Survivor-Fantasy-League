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

import { Profile } from './profile';
 /**
 * 
 *
 * @export
 * @interface ProfileAndLeagueInviteStatus
 */
export interface ProfileAndLeagueInviteStatus {

    /**
     * @type {Profile}
     * @memberof ProfileAndLeagueInviteStatus
     */
    profile?: Profile;

    /**
     * Indicates if the profile has been invited to the league.
     *
     * @type {boolean}
     * @memberof ProfileAndLeagueInviteStatus
     */
    isInvited?: boolean;

    /**
     * Indicates if the profile has joined the league.
     *
     * @type {boolean}
     * @memberof ProfileAndLeagueInviteStatus
     */
    isJoined?: boolean;
}
