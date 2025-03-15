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

import { InviteResponse } from './invite-response';
import { League } from './league';
 /**
 * 
 *
 * @export
 * @interface RespondToLeagueInviteResponseData
 */
export interface RespondToLeagueInviteResponseData {

    /**
     * @type {League}
     * @memberof RespondToLeagueInviteResponseData
     */
    league?: League;

    /**
     * The unique ID of the league invite.
     *
     * @type {string}
     * @memberof RespondToLeagueInviteResponseData
     * @example 49e27bd8-dc24-4159-9630-e989025bf8fd
     */
    inviteId: string;

    /**
     * @type {InviteResponse}
     * @memberof RespondToLeagueInviteResponseData
     */
    inviteResponse: InviteResponse;
}
