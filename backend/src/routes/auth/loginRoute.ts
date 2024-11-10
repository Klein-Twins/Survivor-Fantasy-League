import express from 'express';
import authController from '../../controllers/auth/authController';
import tokenMiddleware from '../../middleware/tokenMiddleware';
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
 *              description: User authenticated successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: "User authenticated successfully"
 *                              statusCode:
 *                                  type: number
 *                                  example: 200
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
 *                                          type: string
 *                                          example: 535c5e40-a4bb-4b9b-b6d8-289e8e813b83
 *          404:
 *              description: No account tied to email
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: No account tied to email
 *          401:
 *              description: Unauthorized - Incorrect password | Please reset your password
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  enum:
 *                                      - Incorrect password
 *                                      - Please reset your password
 *          400:
 *              description: Invalid Email | Missing email | Missing password
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  enum:
 *                                      - Invalid Email
 *                                      - Missing email
 *                                      - Missing password
 *          500:
 *              description: Failed to login user
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: Failed to login user
 */
router.post('/login', authController.login, tokenMiddleware.generateToken);

export default router;