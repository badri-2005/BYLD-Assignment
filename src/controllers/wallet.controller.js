import walletService from '../services/wallet.service.js';

const deposit = async(req,res,next)=>{
    try{
        const {amount} = req.body;
        const {id} = req.params;

        const result = await walletService.depositMoney(id,amount);

        res.status(200).json({
            success : true,
            data : result
        });
    }
    catch(err)
    {
        next(err);
    }
};

export default { deposit };
