const errorHandler = require("../../middleware/errorHandler");
const { getSurvivorsBySeasonService } = require("../../services/survivors/getSurvivors");

const getSurvivorsBySeasonController = async (req, res) => {
    const { seasonId } = req.query;
    try {
        const {statusCode, message, survivors} = await getSurvivorsBySeasonService(seasonId);
        console.log(statusCode, message, survivors);
        res.status(statusCode).json({message, survivors});
    } catch (error) {
        return errorHandler(error, req, res);
    }
};

const getSurvivorById = async (req, res) => {

}

module.exports = {
    getSurvivorById, getSurvivorsBySeasonController
}