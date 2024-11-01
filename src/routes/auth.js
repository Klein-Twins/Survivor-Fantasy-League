const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();

const { AUTH_ERROR_MESSAGES } = require('./ResponseMessageConstants');

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
 *      responses:
 *          201:
 *              description: User created successfully
 *          400:
 *              description: Bad request - "User name is already taken." | "User password is not strong enough." | "Email already in use." | "Email is invalid" | "No email provided in request." | "No username provided in request." | "No password provided in request."
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  enum:
 *                                      - "User name is already taken."
 *                                      - "User password is not strong enough."
 *                                      - "Email already in use."
 *                                      - "Email is invalid"
 *                                      - "No email provided in request."
 *                                      - "No username provided in request."
 *                                      - "No password provided in request."
 *          500:
 *              description: Failed to create User, Internal Server Error
 *          
 */
router.post('/signup', authController.signup);

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
 *          404:
 *              description: Email is not tied to a registered user.
 *          401:
 *              description: Unauthorized, invalid user credentials.
 *          400:
 *              description: Bad Request - "Email is invalid" | "No email provided in request." | "No password provided in request."
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  enum:
 *                                      - "Email is invalid"
 *                                      - "No email provided in request."
 *                                      - "No password provided in request."
 *          500:
 *              description: Failed to log in User, Internal Server Error
 */
router.post('/login', authController.login);

module.exports = router;