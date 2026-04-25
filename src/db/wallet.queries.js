import knex from '../config/knex.js';

export const getPortfolioById = async(id) =>{
    return knex('portfolios')
    .where({id})
    .first();
};

export const updateBalance = async(id ,newBalance)=>{
    return knex('portfolios')
    .where({id})
    .update({
        cash_balance : newBalance
    })
    .returning('*');
};
