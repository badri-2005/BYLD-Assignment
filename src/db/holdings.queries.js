export const getHolding = async(trx,portfolioId,symbol)=>{
    return trx('holdings')
    .where({portfolio_id : portfolioId , symbol})
    .first();
}

export const upsertHolding = async(trx,data)=>{
    return trx('holdings')
    .insert(data)
    .onConflict(['portfolio_id','symbol'])
    .merge();
}

export const deleteHolding = async (trx,portfolioId,symbol)=>{
    return trx('holdings')
    .where({portfolio_id : portfolioId , symbol})
    .del();
}

