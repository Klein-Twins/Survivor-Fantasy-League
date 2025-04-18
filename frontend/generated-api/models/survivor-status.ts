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

import { EliminationStatus } from './elimination-status';
 /**
 * 
 *
 * @export
 * @interface SurvivorStatus
 */
export interface SurvivorStatus {

    /**
     * Survivor status as of start of the episodeId.
     *
     * @type {string}
     * @memberof SurvivorStatus
     * @example 5
     */
    episodeId: string;

    /**
     * @type {EliminationStatus}
     * @memberof SurvivorStatus
     */
    eliminationStatus: EliminationStatus;

    /**
     * The id of the tribe the survivor is currently in
     *
     * @type {string}
     * @memberof SurvivorStatus
     * @example tribeId
     */
    currentTribeId: string | null;
}
