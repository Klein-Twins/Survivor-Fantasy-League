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

import { EpisodeType } from './episode-type';
 /**
 * 
 *
 * @export
 * @interface Episode
 */
export interface Episode {

    /**
     * The ID of the episode
     *
     * @type {string}
     * @memberof Episode
     * @example 49e27bd8-dc24-4159-9630-e989025bf8fd
     */
    id: string;

    /**
     * The ID of the season the episode is in
     *
     * @type {number}
     * @memberof Episode
     * @example 47
     */
    seasonId: number;

    /**
     * The number of the episode
     *
     * @type {number}
     * @memberof Episode
     * @example 1
     */
    number: number;

    /**
     * The air date of the episode
     *
     * @type {string}
     * @memberof Episode
     * @example Wed Sep 22 00:00:00 UTC 2021
     */
    airDate: string;

    /**
     * The title of the episode
     *
     * @type {string}
     * @memberof Episode
     * @example The Beginning
     */
    title: string | null;

    /**
     * The description of the episode
     *
     * @type {string}
     * @memberof Episode
     * @example The first episode of the season
     */
    description: string | null;

    /**
     * Whether the episode has aired
     *
     * @type {boolean}
     * @memberof Episode
     * @example true
     */
    hasAired: boolean;

    /**
     * @type {EpisodeType}
     * @memberof Episode
     */
    episodeType: EpisodeType;

    /**
     * Whether the episode is a tribe switch episode
     *
     * @type {boolean}
     * @memberof Episode
     * @example false
     */
    isTribeSwitch: boolean;
}
