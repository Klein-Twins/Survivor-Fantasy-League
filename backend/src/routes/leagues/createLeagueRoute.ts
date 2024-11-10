import express from 'express';
import leagueController from '../../controllers/leagues/leagueController.ts';
import tokenMiddleware from '../../middleware/tokenMiddleware.ts';

const router = express.Router();
/**
 * @swagger
 * /api/league/:
 *   post:
 *     summary: Create a new League
 *     description: Creates a new league for a given season.
 *     tags:
 *       - League
 *     operationId: createLeague
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateLeagueRequest'
 *     responses:
 *       '201':
 *         description: League created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateLeagueResponse'
 *       '400':
 *         description: Bad request, missing required fields (name, seasonId)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       '404':
 *         description: Season not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 * components:
 *   schemas:
 *     CreateLeagueRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the league
 *           example: "Corner By The Bookshelf"
 *         seasonId:
 *           type: integer
 *           description: The ID of the season the league belongs to
 *           example: 47
 *       required:
 *         - name
 *         - seasonId
 * 
 *     CreateLeagueResponse:
 *       type: object
 *       properties:
 *         league:
 *           $ref: '#/components/schemas/League'
 *         statusCode:
 *           type: integer
 *           description: The HTTP status code indicating the result of the operation
 *           example: 201
 *         message:
 *           type: string
 *           description: A message describing the outcome of the operation
 *           example: "League successfully created."
 * 
 *     League:
 *       type: object
 *       properties:
 *         leagueId:
 *           type: integer
 *           description: The unique identifier of the newly created league
 *           example: 1
 *         seasonId:
 *           type: integer
 *           description: The ID of the season associated with the league
 *           example: 47
 *         name:
 *           type: string
 *           description: The name of the league
 *           example: "Corner By The Bookshelf"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the league was created
 *           example: "2024-11-10T16:35:09.034Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the league was last updated
 *           example: "2024-11-10T16:35:09.034Z"
 *         season:
 *           $ref: '#/components/schemas/Season'
 * 
 *     Season:
 *       type: object
 *       properties:
 *         seasonId:
 *           type: integer
 *           description: The unique identifier of the season
 *           example: 47
 *         theme:
 *           type: string
 *           description: The theme of the season
 *           example: "The New Era 2.0"
 *         location:
 *           type: string
 *           description: The location of the season
 *           example: "Fiji, Oceania"
 *         name:
 *           type: string
 *           description: The name of the season (optional)
 *           example: null
 * 
 *     ApiError:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: integer
 *           description: The HTTP status code indicating the result of the error
 *           example: 400
 *         message:
 *           type: string
 *           description: A message describing the error
 *           example: "Invalid input, missing required fields."
 *         errorDetails:
 *           type: string
 *           description: Additional details about the error (optional)
 *           example: "The 'seasonId' field is required and cannot be null."
 */
router.post('/', tokenMiddleware.authenticateToken, leagueController.createLeague);

export default router;