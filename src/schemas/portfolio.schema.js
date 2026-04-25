import z from 'zod';

const portfolioSchema = z.object({
    clientName : z.string().min(1),
    riskProfile : z.enum(['CONSERVATIVE','MODERATE','AGGRESSIVE'])
});

export default portfolioSchema;