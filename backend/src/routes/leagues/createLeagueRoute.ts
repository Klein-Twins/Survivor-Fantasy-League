import express from 'express';
import leagueController from '../../controllers/leagues/leagueController.ts';

const router = express.Router();
/**
 * @swagger
 * /api/league/:
 *   post:
 *     summary: Create a new League
 *     description: Creates a new league for a given season.
 *     operationId: createLeague
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the league
 *                 example: "Corner By The Bookshelf"
 *               seasonId:
 *                 type: integer
 *                 description: The ID of the season the league belongs to
 *                 example: 47
 *             required:
 *               - name
 *               - seasonId
 *     responses:
 *       '201':
 *         description: League created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 leagueId:
 *                   type: integer
 *                   description: The unique identifier of the newly created league
 *                   example: 123
 *                 seasonId:
 *                   type: integer
 *                   description: The ID of the season associated with the league
 *                   example: 47
 *                 name:
 *                   type: string
 *                   description: The name of the league
 *                   example: "Corner By The Bookshelf"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: The timestamp when the league was created
 *                   example: "2024-11-09T14:55:30.000Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: The timestamp when the league was last updated
 *                   example: "2024-11-09T14:55:30.000Z"
 *                 season:
 *                   type: object
 *                   description: The season information associated with the league
 *                   properties:
 *                     seasonId:
 *                       type: integer
 *                       description: The unique identifier of the season
 *                       example: 47
 *                     theme:
 *                       type: string
 *                       description: The theme of the season
 *                       example: "The New Era 2.0"
 *                     location:
 *                       type: string
 *                       description: The location of the season
 *                       example: "Fiji, Oceania"
 *                     name:
 *                       type: string
 *                       description: The name of the season (optional)
 *                       example: null
 *       '400':
 *         description: Bad request, missing required fields (name, seasonId)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Request is missing one of the required fields: seasonId, name"
 *       '404':
 *         description: Season not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "Season with seasonId 47 does not exist."
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred"
 */
router.post('/', leagueController.createLeague);

export default router;