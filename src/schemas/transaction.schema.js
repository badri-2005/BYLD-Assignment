import {z} from 'zod';

const transactionSchema = z.object({
    symbol : z.string().min(1),
    quantity : z.string(),
});

export default transactionSchema;