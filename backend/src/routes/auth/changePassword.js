const express = require('express');
const authController = require('../../controllers/authController.js');
const router = express.Router();

/**
 * @swagger
 * /api/auth/changePassword:
 *  post:
 *      summary: Change a logged in user's password
 *      description: Changes a logged in user's password
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
 *                          - oldPassword
 *                          - newPassword
 *                      properties:
 *                          email:
 *                              type: string
 *                              example: user@example.com
 *                          oldPassword:
 *                              type: string
 *                              example: StrongPassword123
 *                          newPassword:
 *                              type: string
 *                              example: NewStrongPassword123
 *      responses:
 *          200:
 *              description: OK - User password updated successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: "User password changed successfully"
 *          401:
 *              description: Unauthorized - Old password invalid
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: Unauthorized - password invalid
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
 *          400:
 *              description: Bad request - No email provided | No old password provided | No new password provided | New password is not strong enough | Email is invalid
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  enum:
 *                                      - Bad Request - No email provided
 *                                      - Bad Request - No old password provided
 *                                      - Bad Request - No new password provided
 *                                      - Bad Request - New password is not strong enough
 *                                      - Bad Request - Email is invalid
 *          500:
 *              description: Internal Server Error - Failed to update password
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: Internal Server Error - Failed to update password
 *          
 */
router.post('/changePassword', authController.changePassword);

module.exports = router;