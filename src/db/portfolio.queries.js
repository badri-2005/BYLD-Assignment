import knex from '../config/knex.js';

export const createPortfolio = async(data) =>{
    // Table Name
    return knex('portfolios')
    .insert(data)
    .returning('*');
};

export const getPortfolioById = async(id) => {
    return knex('portfolios')
    .where({id})
    // Fetching the record
    .first()
};

export const deletePortfolio = async(id) =>{
    return knex('portfolios')
    .where({id})
    .del();
};
