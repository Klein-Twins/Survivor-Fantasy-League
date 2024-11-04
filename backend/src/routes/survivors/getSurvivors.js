const express = require('express');
const survivorController = require('../../controllers/survivorController');
const router = express.Router();
/**
 * @swagger
 * /api/survivors:
 *  get:
 *      summary: Get survivors by season
 *      description: Gets the list of survivors by season
 *      tags:
 *          - Survivors
 *      parameters:
 *          -   in: query
 *              name: seasonId
 *              schema:
 *                  type: integer
 *              required: true
 *              description: The ID of the season to retrieve survivors from
 *      responses:
 *          200:
 *              description: A list of survivors
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  survivorId:
 *                                      type: integer
 *                                      description: The survivor ID
 *                                  firstName:
 *                                      type: string
 *                                      description: The survivor's first name
 *                                  lastName:
 *                                      type: string
 *                                      description: The survivor's last name
 *                                  nickName:
 *                                      type: string
 *                                      description: The survivor's nick name
 *                                  fromCity:
 *                                      type: string
 *                                      description: The city the survivor is from
 *                                  fromState:
 *                                      type: string
 *                                      description: The state the survivor is from
 *                                  fromCountry:
 *                                      type: string
 *                                      description: The country the survivor is from
 *                                  age:
 *                                      type: integer
 *                                      description: The survivor's age at the time of the survivor season
 *                                  description:
 *                                      type: string
 *                                      description: The survivor's description
 *                                  job:
 *                                      type: string
 *                                      description: The survivor's job/occupation.
 *          404:
 *              description: Not Found - No survivors for provided season ID
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: Not Found - No survivors for provided season id.
 *          400:
 *              description: Bad Request - Missing season ID | Invalid season ID
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  enum:
 *                                      - Bad Request - Missing season ID
 *                                      - Bad Request - Invalid season ID
 *          500:
 *              description: Internal Server Error - Failed to fetch survivors by season
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: Internal Server Error - Failed to login user
 */
router.get('/survivors', survivorController.getSurvivorsBySeasonController);

router.get('/survivor', survivorController.getSurvivorById);

module.exports = router;