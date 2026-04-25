import { success } from "zod";
import investmentService from "../services/investment.service.js";

const getCategories = (req,res)=>{
    const data = investmentService.getCategories();

    res.status(200).json({
        success:true,
        data
    });
};

const getCompanies = async(req,res,next)=>{
    try{
        const {category} = req.params;

        const data = await investmentService.getCompanies(category);

        res.status(200).json({
            success : true,
            data
        })
    }
    catch(err)
    {
        next(err);
    }
};

export default {getCategories,getCompanies};