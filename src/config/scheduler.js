import cron from 'node-cron';
import { runSipExecutor } from '../services/sipExecutor.service.js';

export const startScheduler = () => {
    cron.schedule('* * * * *', async () => {
        console.log("Running SIP Executor...");
        await runSipExecutor();
    });
};