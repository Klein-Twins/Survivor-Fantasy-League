import express from 'express';
import accountController from '../../controllers/auth/accountController';
import tokenMiddleware from '../../middleware/tokenMiddleware';

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
 *              description: User created successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: User created successfully
 *                              token:
 *                                  type: string
 *                                  example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiU3Vydml...
 *                              user:
 *                                  type: object
 *                                  properties:
 *                                      username:
 *                                          type: string
 *                                          example: SurvivorFan69
 *                                      userProfileId:
 *                                          type: string
 *                                          example: 535c5e40-a4bb-4b9b-b6d8-289e8e813b83
 *
 *          400:
 *              description: Missing email | Missing password | Missing username | Invalid first name | Invalid last name | Invalid email | Email already tied to account | Username already tied to account | Password is too weak
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  enum:
 *                                      - Missing email
 *                                      - Missing password
 *                                      - Missing username
 *                                      - Invalid first name
 *                                      - Invalid last name
 *                                      - Email already tied to account
 *                                      - Username already tied to account
 *                                      - Password is too weak
 *          500:
 *              description: Could not create user
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: Could not create user
 *          
 */
router.post('/signup', accountController.createAccount, tokenMiddleware.generateToken);

export default router;