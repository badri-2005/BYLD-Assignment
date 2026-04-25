import { createPortfolio, getPortfolioById, deletePortfolio } from "../db/portfolio.queries.js";

const createPortfolio_service = async(data) =>{
    const portfolio = await createPortfolio({
        client_name: data.clientName,
        risk_profile: data.riskProfile
    });

    return portfolio[0];
};

const getPortfolio = async(id)=>{
    const portfolio = await getPortfolioById(id);

    if(!portfolio)
    {
        throw new Error("Portfolio not Found");
    }

    return portfolio;
}

const deletePortfolio_service = async(id)=>{
    const deleted = await deletePortfolio(id);

    if(!deleted)
    {
        throw new Error("Portfolio not Found");
    }

    return {message : "Portfolio Deleted Successfully"};
}

export default {createPortfolio:createPortfolio_service,getPortfolio,deletePortfolio:deletePortfolio_service};