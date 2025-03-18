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

import { Pick } from './pick';
import { Survey } from './survey';
import { SurveyAvailabilityStatus } from './survey-availability-status';
 /**
 * 
 *
 * @export
 * @interface EpisodeSurvey
 */
export interface EpisodeSurvey extends Survey {

    /**
     * The ID of the episode the survey is for
     *
     * @type {string}
     * @memberof EpisodeSurvey
     */
    episodeId: string;

    /**
     * The date the survey is due
     *
     * @type {Date}
     * @memberof EpisodeSurvey
     */
    dueDate: Date;

    /**
     * The date the survey opens
     *
     * @type {Date}
     * @memberof EpisodeSurvey
     */
    openDate: Date;

    /**
     * The ID of the episode survey
     *
     * @type {string}
     * @memberof EpisodeSurvey
     */
    episodeSurveyId: string;

    /**
     * @type {SurveyAvailabilityStatus}
     * @memberof EpisodeSurvey
     */
    surveyAvailabilityStatus?: SurveyAvailabilityStatus;
}
