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
 * @interface SurvivorEliminationInfo
 */
export interface SurvivorEliminationInfo {

    /**
     * Whether the survivor is eliminated or not
     *
     * @type {boolean}
     * @memberof SurvivorEliminationInfo
     * @example false
     */
    isEliminated: boolean;

    /**
     * The day the survivor was eliminated
     *
     * @type {number}
     * @memberof SurvivorEliminationInfo
     * @example 12
     */
    dayEliminated: number | null;

    /**
     * The placement of the survivor in the season
     *
     * @type {number}
     * @memberof SurvivorEliminationInfo
     * @example 5
     */
    placement: number | null;

    /**
     * The episode id the survivor was eliminated in
     *
     * @type {string}
     * @memberof SurvivorEliminationInfo
     * @example 5
     */
    episodeEliminated: string | null;
}
