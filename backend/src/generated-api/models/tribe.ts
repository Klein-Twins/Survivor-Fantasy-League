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
 * @interface Tribe
 */
export interface Tribe {

    /**
     * The tribe's unique identifier
     *
     * @type {string}
     * @memberof Tribe
     * @example 1
     */
    id: string;

    /**
     * The tribe's name
     *
     * @type {string}
     * @memberof Tribe
     * @example Luzon
     */
    name: string;

    /**
     * The tribe's color
     *
     * @type {string}
     * @memberof Tribe
     * @example #FF0000
     */
    color: string;

    /**
     * The tribe's image URL
     *
     * @type {string}
     * @memberof Tribe
     * @example https://www.cbs.com/shows/survivor/photos/1007124/season-28-cast-photos/1007124_1_8x6.jpg
     */
    imageUrl: string;
}
