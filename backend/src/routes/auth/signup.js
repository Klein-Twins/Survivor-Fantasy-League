const express = require('express');
const authController = require('../../controllers/authController');
const router = express.Router();

/**
 * @swagger
 * /api/auth/signup:
 *  post:
 *      summary: Register a new user
 *      description: Creates a new User account with a provided email, username, and password.
 *      tags:
 *          - Authentication
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - email
 *                          - password
 *                          - username
 *                      properties:
 *                          email:
 *                              type: string
 *                              example: user@example.com
 *                          password:
 *                              type: string
 *                              example: StrongPassword123
 *                          username:
 *                              type: string
 *                              example: SurvivorFan69
 *                          firstName:
 *                              type: string
 *                              example: Jeff
 *                          lastName:
 *                              type: string
 *                              example: Probst
 *      responses:
 *          201:
 *              description: Created - User created successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: "User created successfully"
 *                              user:
 *                                  type: object
 *                                  properties:
 *                                      username:
 *                                          type: string
 *                                          example: "SurvivorFan69"
 *                                      userProfileId:
 *                                          type: integer
 *                                          example: 123456433
 *          400:
 *              description: Bad request - No email provided | No username provided | No password provided | Username is unavailable | Email is unavailable | User password is not strong enough | Email is invalid
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  enum:
 *                                      - Bad Request - No email provided
 *                                      - Bad Request - No username provided
 *                                      - Bad Request - No password provided
 *                                      - Bad Request - Username is unavailable
 *                                      - Bad Request - Email is unavailable
 *                                      - Bad Request - User password is not strong enough
 *                                      - Bad Request - Email is invalid
 *          500:
 *              description: Internal Server Error - Failed to sign up and create user
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: Internal Server Error - Failed to sign up and create user
 *          
 */
router.post('/signup', authController.signup);

module.exports = router;