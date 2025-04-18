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

import { LeagueMember } from './league-member';
 /**
 * 
 *
 * @export
 * @interface League
 */
export interface League {

    /**
     * The ID of the league.
     *
     * @type {string}
     * @memberof League
     * @example c5ea9a19-c8cd-4dfc-af1b-44d3b0d4928f
     */
    id: string;

    /**
     * The name of the league.
     *
     * @type {string}
     * @memberof League
     * @example Corner By The Bookshelf
     */
    name: string;

    /**
     * The ID of the season the league is for.
     *
     * @type {number}
     * @memberof League
     * @example 1
     */
    seasonId: number;

    /**
     * @type {Array<LeagueMember>}
     * @memberof League
     */
    leagueMembers: Array<LeagueMember>;
}
