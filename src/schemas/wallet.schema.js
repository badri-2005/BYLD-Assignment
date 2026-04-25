import z from 'zod';

const walletSchema =z.object({
    amount : z.string().refine(val=>parseFloat(val)>0,{
        message : "Amount must be greather than 0"
    })
});

export default walletSchema;