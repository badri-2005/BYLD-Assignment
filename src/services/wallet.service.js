import { getPortfolioById, updateBalance } from '../db/wallet.queries.js';
import Decimal from 'decimal.js';

const depositMoney = async (portfolioId , amount) =>{
    if(new Decimal(amount).lte(0))
    {
        throw new Error("Invalid Amount");
    }

    const portfolio = await getPortfolioById(portfolioId);

    if(!portfolio)
    {
        throw new Error("Portfolio Not Found");
    }

    const currentBalance = new Decimal(portfolio.cash_balance);
    const depositAmount = new Decimal(amount);

    const newBalance = currentBalance.plus(depositAmount);

    const updateDb = await updateBalance(
        portfolioId,
        newBalance.toFixed(4)
    );

    return{
        portfolioId,
        depositedAmount : depositAmount.toFixed(4),
        previousBalance: currentBalance.toFixed(4),
        newCashBalance: newBalance.toFixed(4),
        updatedAt: new Date()
    };
};

export default {depositMoney};