import knex from '../config/knex.js';

export const getCompaniesByCategory = async (category)=>{
    return knex('companies')
    .where({category});
};
