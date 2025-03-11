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

import { PickWithPlayerChoice } from './pick-with-player-choice';
 /**
 * 
 *
 * @export
 * @interface SubmitSurveyWithPickChoicesRequestBody
 */
export interface SubmitSurveyWithPickChoicesRequestBody {

    /**
     * The ID of the episode.
     *
     * @type {string}
     * @memberof SubmitSurveyWithPickChoicesRequestBody
     */
    episodeId: string;

    /**
     * The ID of the league survey.
     *
     * @type {string}
     * @memberof SubmitSurveyWithPickChoicesRequestBody
     */
    leagueSurveyId: string;

    /**
     * The ID of the survey.
     *
     * @type {string}
     * @memberof SubmitSurveyWithPickChoicesRequestBody
     */
    surveyId: string;

    /**
     * The ID of the league.
     *
     * @type {string}
     * @memberof SubmitSurveyWithPickChoicesRequestBody
     */
    leagueId: string;

    /**
     * The ID of the profile.
     *
     * @type {string}
     * @memberof SubmitSurveyWithPickChoicesRequestBody
     */
    profileId: string;

    /**
     * @type {Array<PickWithPlayerChoice>}
     * @memberof SubmitSurveyWithPickChoicesRequestBody
     */
    pickChoices: Array<PickWithPlayerChoice>;
}
