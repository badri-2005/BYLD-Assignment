import * as sipQueries from '../db/sip.queries.js';
import { getNextRunDate } from '../utils/sipSchedule.js';
import transactionService from './transaction.service.js';
import knex from '../config/knex.js';
import Decimal from 'decimal.js';

export const runSipExecutor = async () => {
    const sips = await sipQueries.findDueSips();

    for (const sip of sips) {
        try {
            const portfolio = await knex('portfolios')
                .where({ id: sip.portfolio_id })
                .first();

            const company = await knex('companies')
                .where({ symbol: sip.symbol })
                .first();

            if (!portfolio || !company) continue;

            const price = new Decimal(company.current_price);
            const amount = new Decimal(sip.amount);

            const qty = amount.div(price).toFixed(4);

            if (new Decimal(portfolio.cash_balance).gte(amount)) {
                await transactionService.buy(
                    sip.portfolio_id,
                    sip.symbol,
                    qty,
                    price.toFixed(4)
                );
            }

            const nextRun = getNextRunDate(sip.frequency, sip.next_run_at);

            await sipQueries.updateAfterRun(sip.id, nextRun);

        } catch (err) {
            console.error("SIP execution error:", err.message);
        }
    }
};