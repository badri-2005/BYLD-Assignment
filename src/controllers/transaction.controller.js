import { success } from 'zod';
import transactionService from '../services/transaction.service.js'

const buy = async(req , res ,next)=>{
    try{
        const {id} = req.params;
        const {symbol,quantity,price} =req.body;

        const data = await transactionService.buy(id,symbol,quantity,price);

        res.status(201).json({
            success:true,
            data
        });
    }
    catch(err)
    {
        next(err);
    }
};

const sell = async(req ,res , next)=>{
    try{
        const {id} = req.params;
        const {symbol,quantity,price} = req.body;

        const data = await transactionService.sell(id,symbol,quantity,price);

        res.status(201).json({
            success:true,
            data
        })
    }
    catch(err)
    {
        next(err);
    }
};

export default {buy,sell};