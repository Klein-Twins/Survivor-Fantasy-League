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

import { Pagination } from './pagination';
import { ProfileAndLeagueInviteStatus } from './profile-and-league-invite-status';
 /**
 * 
 *
 * @export
 * @interface SearchProfilesForLeagueInviteResponseData
 */
export interface SearchProfilesForLeagueInviteResponseData {

    /**
     * @type {Array<ProfileAndLeagueInviteStatus>}
     * @memberof SearchProfilesForLeagueInviteResponseData
     */
    profilesFound?: Array<ProfileAndLeagueInviteStatus>;

    /**
     * @type {Pagination}
     * @memberof SearchProfilesForLeagueInviteResponseData
     */
    pagination?: Pagination;
}
