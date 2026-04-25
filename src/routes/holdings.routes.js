import express from 'express';
import * as holdingsController from '../controllers/holdings.controller.js';

const router = express.Router();

/**
 * @swagger
 * /v1/portfolios/{id}/holdings:
 *   get:
 *     summary: Get portfolio holdings with P&L summary
 *     tags: [Holdings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Holdings with P&L
 */
router.get('/portfolios/:id/holdings', holdingsController.getHoldings);

export default router;