import * as sipService from '../services/sip.service.js';

export const createSip = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = await sipService.createSip(id, req.body);

        res.status(201).json({ success: true, data });

    } catch (err) {
        next(err);
    }
};

export const getSips = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = await sipService.getSips(id);

        res.status(200).json({ success: true, data });

    } catch (err) {
        next(err);
    }
};

export const cancelSip = async (req, res, next) => {
    try {
        const { sipId } = req.params;
        const data = await sipService.cancelSip(sipId);

        res.status(200).json({ success: true, data });

    } catch (err) {
        next(err);
    }
};