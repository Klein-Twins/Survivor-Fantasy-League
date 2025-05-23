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

import { Episode } from './episode';
import { Survivor } from './survivor';
import { Tribe } from './tribe';
 /**
 * 
 *
 * @export
 * @interface Season
 */
export interface Season {

    /**
     * The unique identifier of the season.
     *
     * @type {number}
     * @memberof Season
     */
    id: number;

    /**
     * The name of the season.
     *
     * @type {string}
     * @memberof Season
     */
    name: string;

    /**
     * The start date of the season.
     *
     * @type {string}
     * @memberof Season
     */
    startDate: string | null;

    /**
     * The end date of the season.
     *
     * @type {string}
     * @memberof Season
     */
    endDate: string | null;

    /**
     * The location of the season.
     *
     * @type {string}
     * @memberof Season
     */
    location: string;

    /**
     * The theme of the season.
     *
     * @type {string}
     * @memberof Season
     */
    theme: string;

    /**
     * Whether the season is currently active.
     *
     * @type {boolean}
     * @memberof Season
     */
    isActive: boolean;

    /**
     * The survivors in the season.
     *
     * @type {Array<Survivor>}
     * @memberof Season
     */
    survivors: Array<Survivor>;

    /**
     * The episodes in the season.
     *
     * @type {Array<Episode>}
     * @memberof Season
     */
    episodes: Array<Episode>;

    /**
     * The unique identifier of the next episode.
     *
     * @type {string}
     * @memberof Season
     */
    nextEpisode: string | null;

    /**
     * The tribes in the season.
     *
     * @type {Array<Tribe>}
     * @memberof Season
     */
    tribesInSeason: Array<Tribe>;
}
