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

import { InviteResponseEnum } from './invite-response-enum';
 /**
 * 
 *
 * @export
 * @interface RespondToLeagueInviteRequestBody
 */
export interface RespondToLeagueInviteRequestBody {

    /**
     * The unique ID of the league the user is being invited to.
     *
     * @type {string}
     * @memberof RespondToLeagueInviteRequestBody
     */
    leagueId: string;

    /**
     * THe unique ID of the profile that is responding to the invite
     *
     * @type {string}
     * @memberof RespondToLeagueInviteRequestBody
     */
    profileId: string;

    /**
     * @type {InviteResponseEnum}
     * @memberof RespondToLeagueInviteRequestBody
     */
    inviteResponse: InviteResponseEnum;
}
