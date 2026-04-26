import knex from '../config/knex.js';

export const createSip = (data)=>{
    return knex('sips').insert(data).returning('*');
}

export const getSipsByPortfolio = (portfolioId)=>{
    return knex('sips').where({
        portfolio_id : portfolioId
    });
}

export const deleteSip = (sipId) =>{
    return knex('sips').where({
        id : sipId
    }).update({
        is_active : false
    });
}

export const findDueSips = ()=>{
    return knex('sips')
    .where('is_active', true)
    .andWhere('next_run_at', '<=', knex.fn.now())
}

export const updateAfterRun = (sipId, nextRunAt) =>
    knex('sips')
        .where({ id: sipId })
        .update({
            last_run_at: knex.fn.now(),
            next_run_at: nextRunAt
        });