import express from 'express';
import walletController from '../controllers/wallet.controller.js';

const router = express.Router();

/**
 * @swagger
 * /v1/portfolios/{id}/wallet/deposit:
 *   post:
 *     summary: Deposit amount into portfolio wallet
 *     tags: [Wallet]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Portfolio ID (UUID)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 1000
 *     responses:
 *       200:
 *         description: Amount deposited successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Portfolio not found
 */
router.post('/portfolios/:id/wallet/deposit', walletController.deposit);

export default router;