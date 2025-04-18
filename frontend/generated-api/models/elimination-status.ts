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
 * @interface EliminationStatus
 */
export interface EliminationStatus {

    /**
     * Whether the survivor is eliminated or not
     *
     * @type {boolean}
     * @memberof EliminationStatus
     * @example false
     */
    isEliminated: boolean;

    /**
     * The day the survivor was eliminated
     *
     * @type {number}
     * @memberof EliminationStatus
     * @example 12
     */
    dayEliminated: number | null;

    /**
     * The placement of the survivor in the season
     *
     * @type {number}
     * @memberof EliminationStatus
     * @example 5
     */
    placement: number | null;

    /**
     * The episode id the survivor was eliminated in
     *
     * @type {string}
     * @memberof EliminationStatus
     * @example 5
     */
    episodeEliminated: string | null;
}
