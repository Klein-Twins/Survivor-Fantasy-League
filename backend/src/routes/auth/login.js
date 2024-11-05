const express = require('express');
const authController = require('../../controllers/authController');
const router = express.Router();

/**
 * @swagger
 * /api/auth/login:
 *  post:
 *      summary: Log in a user
 *      description: Authenticates a user with email and password.
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
 *                      properties:
 *                          email:
 *                              type: string
 *                              example: user@example.com
 *                          password:
 *                              type: string
 *                              example: StrongPassword123
 *      responses:
 *          200:
 *              description: OK - User authenticated successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: "User authenticated successfully"
 *                              token:
 *                                  type: string
 *                                  example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiU3Vydml...
 *                              user:
 *                                  type: object
 *                                  properties:
 *                                      username:
 *                                          type: string
 *                                          example: "SurvivorFan69"
 *                                      userProfileId:
 *                                          type: integer
 *                                          example: 535c5e40-a4bb-4b9b-b6d8-289e8e813b83
 *          404:
 *              description: Not Found - Email is not tied to a registered user
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: Not Found - Email is not tied to a registered user
 *          401:
 *              description: Unauthorized - password invalid
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: Unauthorized - password invalid
 *          400:
 *              description: Bad Request - Email is invalid | No email provided | No password provided
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  enum:
 *                                      - Bad Request - Email is invalid
 *                                      - Bad Request - No email provided
 *                                      - Bad Request - No password provided
 *          500:
 *              description: Internal Server Error - Failed to login user
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: Internal Server Error - Failed to login user
 */
router.post('/login', authController.login);

module.exports = router;