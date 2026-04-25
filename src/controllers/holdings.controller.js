import * as holdingsService from '../services/holdings.service.js';

export const getHoldings = async (req, res, next) => {
    try {
        const { id } = req.params;

        const data = await holdingsService.getHoldings(id);

        res.status(200).json({
            success: true,
            data
        });

    } catch (err) {
        next(err);
    }
};