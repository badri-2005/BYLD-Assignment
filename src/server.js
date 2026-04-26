import app from './app.js'
import knex from './config/knex.js'
import dotenv from 'dotenv'
import { startScheduler } from './config/scheduler.js';


dotenv.config()

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await knex.migrate.latest();
        console.log("Migrations completed");

        // Start server
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();
startScheduler();