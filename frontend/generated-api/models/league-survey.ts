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
import { Pick } from './pick';
import { Survey } from './survey';
import { SurveyAvailabilityStatus } from './survey-availability-status';
 /**
 * 
 *
 * @export
 * @interface LeagueSurvey
 */
export interface LeagueSurvey extends Survey {

    /**
     * The ID of the league survey
     *
     * @type {string}
     * @memberof LeagueSurvey
     */
    leagueSurveyId: string;

    /**
     * @type {Episode}
     * @memberof LeagueSurvey
     */
    episode: Episode;

    /**
     * @type {SurveyAvailabilityStatus}
     * @memberof LeagueSurvey
     */
    availabilityStatus: SurveyAvailabilityStatus;
}
