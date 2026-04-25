import { success } from "zod";
import portfolioService from "../services/portfolio.service.js";

const createPortfolio = async(req , res , next)=>{
    try{
        const result = await portfolioService.createPortfolio(req.body);

        res.status(201).json({
            success : true,
            data : result
        });
    }catch(err)
    {
        next(err);
    }
};

const getPortfolio = async(req,res,next)=>{
    try{

        const result = await portfolioService.getPortfolio(req.params.id);

        res.status(200).json({
            success:true,
            data : result
        });
    }
    catch(err)
    {
        next(err);
    }
};

const deletePortfolio = async (req,res,next)=>{
    try{
        const result = await portfolioService.deletePortfolio(req.params.id);

        res.status(200).json({
            success:true,
            message : result.message
        });
    }
    catch(err)
    {
        next(err);
    }
};

export default {createPortfolio,getPortfolio,deletePortfolio};
