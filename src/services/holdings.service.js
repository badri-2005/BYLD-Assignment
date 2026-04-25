import knex from '../config/knex.js';
import Decimal from 'decimal.js';

export const getHoldings = async (portfolioId) => {
    // 1. Portfolio
    const portfolio = await knex('portfolios')
        .where({ id: portfolioId })
        .first();

    if (!portfolio) throw new Error("PORTFOLIO_NOT_FOUND");

    const cashBalance = new Decimal(portfolio.cash_balance);

    // 2. Join holdings + companies
    const rows = await knex('holdings')
        .join('companies', 'holdings.symbol', 'companies.symbol')
        .where('holdings.portfolio_id', portfolioId)
        .select(
            'holdings.symbol',
            'holdings.quantity',
            'holdings.avg_cost',
            'companies.name as company_name',
            'companies.category',
            'companies.current_price'
        );

    // Empty portfolio case
    if (!rows.length) {
        return {
            portfolioId,
            cashBalance: cashBalance.toFixed(4),
            holdings: [],
            summary: {
                totalHoldings: 0,
                totalCostBasis: "0.0000",
                totalCurrentValue: "0.0000",
                totalUnrealisedPnL: "0.0000",
                totalUnrealisedPnLPct: "0.00",
                totalPortfolioValue: cashBalance.toFixed(4)
            }
        };
    }

    // 3. Compute metrics
    let totalCostBasis = new Decimal(0);
    let totalCurrentValue = new Decimal(0);
    let totalUnrealisedPnL = new Decimal(0);

    const holdings = rows.map(row => {
        const qty = new Decimal(row.quantity);
        const avg = new Decimal(row.avg_cost);
        const currentPrice = new Decimal(row.current_price);

        const costBasisTotal = qty.mul(avg);
        const currentValue = qty.mul(currentPrice);
        const pnl = currentValue.minus(costBasisTotal);

        const pnlPct = costBasisTotal.eq(0)
            ? new Decimal(0)
            : pnl.div(costBasisTotal).mul(100);

        totalCostBasis = totalCostBasis.plus(costBasisTotal);
        totalCurrentValue = totalCurrentValue.plus(currentValue);
        totalUnrealisedPnL = totalUnrealisedPnL.plus(pnl);

        return {
            symbol: row.symbol,
            companyName: row.company_name,
            category: row.category,
            quantity: qty.toFixed(4),
            avgCostBasis: avg.toFixed(4),
            currentPrice: currentPrice.toFixed(4),
            currentValue: currentValue.toFixed(4),
            costBasisTotal: costBasisTotal.toFixed(4),
            unrealisedPnL: pnl.toFixed(4),
            unrealisedPnLPct: pnlPct.toFixed(2)
        };
    });

    const totalPortfolioValue = totalCurrentValue.plus(cashBalance);

    return {
        portfolioId,
        cashBalance: cashBalance.toFixed(4),
        holdings,
        summary: {
            totalHoldings: holdings.length,
            totalCostBasis: totalCostBasis.toFixed(4),
            totalCurrentValue: totalCurrentValue.toFixed(4),
            totalUnrealisedPnL: totalUnrealisedPnL.toFixed(4),
            totalUnrealisedPnLPct: totalCostBasis.eq(0)
                ? "0.00"
                : totalUnrealisedPnL.div(totalCostBasis).mul(100).toFixed(2),
            totalPortfolioValue: totalPortfolioValue.toFixed(4)
        }
    };
};