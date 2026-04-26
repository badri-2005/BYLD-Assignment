import * as sipQueries from '../db/sip.queries.js';
import { getNextRunDate } from '../utils/sipSchedule.js';

export const createSip = async (portfolioId, data) => {
    const { symbol, amount, cadence, startDate } = data;

    if (!["WEEKLY", "MONTHLY"].includes(cadence)) {
        throw new Error("INVALID_CADENCE");
    }

    const nextRunAt = new Date(startDate);

    const sip = await sipQueries.createSip({
        portfolio_id: portfolioId,
        symbol,
        amount,
        frequency: cadence,
        start_date: startDate,
        is_active: true,
        next_run_at: nextRunAt
    });

    return sip[0];
};

export const getSips = async (portfolioId) => {
    return sipQueries.getSipsByPortfolio(portfolioId);
};

export const cancelSip = async (sipId) => {
    const result = await sipQueries.deleteSip(sipId);

    if (!result) throw new Error("SIP_NOT_FOUND");

    return { sipId, status: "CANCELLED" };
};