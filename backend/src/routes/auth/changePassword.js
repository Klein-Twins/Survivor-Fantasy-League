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
 *          202:
 *              description: Accepted - User password updated successfully
 *          401:
 *              description: Unauthorized - Old password invalid
 *          404:
 *              description: Not Found - Email is not tied to a registered user
 *          400:
 *              description: Bad request - No old password provided | No new password provided | No email provided | Email is not tied to a registered user | New password is not strong enough
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  enum:
 *                                      - Bad request - No old password provided
 *                                      - Bad request - No new password provided
 *                                      - Bad request - No email provided
 *                                      - Bad request - New password is not strong enough
 *          500:
 *              description: Internal Server Error - Failed to update password
 *          
 */
router.post('/changePassword', authController.changePassword);

module.exports = router;