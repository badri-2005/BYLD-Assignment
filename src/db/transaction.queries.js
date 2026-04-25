import knex from '../config/knex.js';

export const insertTransaction = async(trx,data)=>{
    return trx('transactions')
    .insert(data)
    .returning("*");
};

