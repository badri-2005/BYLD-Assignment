import express from 'express';
import transactionController from '../controllers/transaction.controller.js';

const router = express.Router();

/**
 * @swagger
 * /v1/portfolios/{id}/transactions/buy:
 *   post:
 *     summary: Buy investment units
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Portfolio ID
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             symbol: RELIANCE
 *             quantity: "5"
 *             price: "2450.0000"
 *     responses:
 *       201:
 *         description: Buy transaction successful
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 transaction:
 *                   id: txn-uuid
 *                   type: BUY
 *                   symbol: RELIANCE
 *                   quantity: "5.0000"
 *                   price: "2450.0000"
 *                 newBalance: "37750.0000"
 *                 holding:
 *                   symbol: RELIANCE
 *                   quantity: "5.0000"
 *                   avgCost: "2450.0000"
 *       402:
 *         description: Insufficient balance
 *       404:
 *         description: Portfolio or symbol not found
 */
router.post('/portfolios/:id/transactions/buy', transactionController.buy);


/**
 * @swagger
 * /v1/portfolios/{id}/transactions/sell:
 *   post:
 *     summary: Sell investment units
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Portfolio ID
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             symbol: RELIANCE
 *             quantity: "2"
 *             price: "2500.0000"
 *     responses:
 *       201:
 *         description: Sell transaction successful
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 transaction:
 *                   id: txn-uuid
 *                   type: SELL
 *                   symbol: RELIANCE
 *                   quantity: "2.0000"
 *                   price: "2500.0000"
 *                 newBalance: "45280.0000"
 *                 remainingQty: "3.0000"
 *       409:
 *         description: Insufficient holding
 *       404:
 *         description: Portfolio not found
 */
router.post('/portfolios/:id/transactions/sell', transactionController.sell);

export default router;