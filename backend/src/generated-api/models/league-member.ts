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

import { Account } from './account';
 /**
 * 
 *
 * @export
 * @interface LeagueMember
 */
export interface LeagueMember {

    /**
     * @type {Account}
     * @memberof LeagueMember
     */
    account: Account;

    /**
     * The role of the league member
     *
     * @type {string}
     * @memberof LeagueMember
     * @example member
     */
    role: LeagueMemberRoleEnum;
}

/**
 * @export
 * @enum {string}
 */
export enum LeagueMemberRoleEnum {
    Owner = 'owner',
    Admin = 'admin',
    Member = 'member'
}

