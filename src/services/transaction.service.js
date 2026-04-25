import knex from '../config/knex.js';
import Decimal from 'decimal.js';

import {insertTransaction} from '../db/transaction.queries.js';
import {getHolding ,upsertHolding , deleteHolding} from '../db/holdings.queries.js';
import {getCompaniesByCategory} from '../db/company.queries.js';

// Finding Company

const findCompany = async(symbol)=>{
    const companies = await knex('companies').where({symbol});
    return companies[0];
}

// Service for Buy
const buy = async(portfolioId , symbol , quantity , price)=>{
    return knex.transaction(async (trx)=>{
        const portfolio = await trx('portfolios').where({id : portfolioId}).first();
        if(!portfolio)
        {
            throw new Error("Portfolio Not Found");
        }

        const company = await findCompany(symbol);
        if(!company)
        {
            throw new Error("Symbol Not Found");
        }

        const qty = new Decimal(quantity);
        const pr = new Decimal(price);

        if(qty.lte(0) || pr.lte(0))
        {
            throw new Error("Validation Error");
        }

        const totalCost = qty.mul(pr);

        const balance = new Decimal(portfolio.cash_balance);

        if(totalCost > balance)
        {
            throw new Error("Insufficient Balance");
        }

        const newBalance = balance.minus(totalCost);

        await trx('portfolios')
        .where({id : portfolioId})
        .update({cash_balance : newBalance.toFixed(4)});

        const holding = await getHolding(trx,portfolioId,symbol);

        let newQty , newAvg;

        if(!holding)
        {
            newQty = qty;
            newAvg = pr;
        }
        else{
            const oldQty = new Decimal(holding.quantity);
            const oldAvg = new Decimal(holding.avg_cost);

            newQty = oldQty.plus(qty);

            newAvg = (oldQty.mul(oldAvg).plus(qty.mul(pr)))
                .div(newQty);
        }

        await upsertHolding(trx,{
            portfolio_id : portfolioId,
            symbol,
            quantity : newQty.toFixed(4),
            avg_cost : newAvg.toFixed(4)
        });


        const txn = await insertTransaction(trx,{
            portfolio_id : portfolioId,
            symbol,
            type : 'BUY',
            quantity : qty.toFixed(4),
            price : pr.toFixed(4),
            amount : totalCost.toFixed(4)
        });

        return{
            transaction : txn[0],
            newBalance : newBalance.toFixed(4),
            holding:{
                symbol,
                quantity : newQty.toFixed(4),
                avgCost : newAvg.toFixed(4)
            }
        };
    });
};

// Service for Sell

const sell = async (portfolioId, symbol, quantity, price) => {

    return knex.transaction(async (trx) => {

        const portfolio = await trx('portfolios').where({ id: portfolioId }).first();
        if (!portfolio) throw new Error("PORTFOLIO_NOT_FOUND");

        const holding = await getHolding(trx, portfolioId, symbol);
        if (!holding) throw new Error("NO_HOLDING");

        const qty = new Decimal(quantity);
        const pr = new Decimal(price);

        const heldQty = new Decimal(holding.quantity);

        if (qty.gt(heldQty)) throw new Error("INSUFFICIENT_HOLDING");

        const proceeds = qty.mul(pr);

        // update balance
        const balance = new Decimal(portfolio.cash_balance);
        const newBalance = balance.plus(proceeds);

        await trx('portfolios')
            .where({ id: portfolioId })
            .update({ cash_balance: newBalance.toFixed(4) });

        const remainingQty = heldQty.minus(qty);

        if (remainingQty.eq(0)) {
            await deleteHolding(trx, portfolioId, symbol);
        } else {
            await upsertHolding(trx, {
                portfolio_id: portfolioId,
                symbol,
                quantity: remainingQty.toFixed(4),
                avg_cost: holding.avg_cost // IMPORTANT
            });
        }

        const txn = await insertTransaction(trx, {
            portfolio_id: portfolioId,
            symbol,
            type: 'SELL',
            quantity: qty.toFixed(4),
            price: pr.toFixed(4),
            amount: proceeds.toFixed(4)
        });

        return {
            transaction: txn[0],
            newBalance: newBalance.toFixed(4),
            remainingQty: remainingQty.toFixed(4)
        };
    });
};

export default {buy,sell};