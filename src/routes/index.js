import express from 'express';
import portfolioRoutes from './portfolio.routes.js';
import walletRoutes from './wallet.routes.js';
// import investmentRoutes from './investment.routes.js';
import transtactionRoutes from './transaction.routes.js';
import holdingRoutes from './holdings.routes.js'

const router = express.Router();

router.use('/v1', portfolioRoutes);
router.use('/v1', walletRoutes);
// router.use('/v1', investmentRoutes);
router.use('/v1',transtactionRoutes);
router.use('/v1',holdingRoutes);

export default router;