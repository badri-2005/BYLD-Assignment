import express from 'express';
import * as sipController from '../controllers/sip.controller.js';

const router = express.Router();

/**
 * @swagger
 * /v1/portfolios/{id}/sips:
 *   post:
 *     summary: Create a new SIP (Systematic Investment Plan)
 *     tags: [SIPs]
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
 *             symbol: TCS
 *             amount: "5000.00"
 *             cadence: MONTHLY
 *             startDate: "2026-05-01"
 *     responses:
 *       201:
 *         description: SIP created successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: sip-uuid
 *                 portfolio_id: uuid
 *                 symbol: TCS
 *                 amount: "5000.0000"
 *                 cadence: MONTHLY
 *                 start_date: "2026-05-01"
 *                 status: ACTIVE
 *                 next_run_at: "2026-05-01T00:00:00.000Z"
 *       400:
 *         description: Invalid input (cadence or startDate)
 *       404:
 *         description: Portfolio or symbol not found
 */
router.post('/portfolios/:id/sips', sipController.createSip);


/**
 * @swagger
 * /v1/portfolios/{id}/sips:
 *   get:
 *     summary: Get all SIPs for a portfolio
 *     tags: [SIPs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Portfolio ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of SIPs
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - id: sip-uuid
 *                   symbol: TCS
 *                   amount: "5000.0000"
 *                   cadence: MONTHLY
 *                   status: ACTIVE
 *                   start_date: "2026-05-01"
 *                   last_run_at: null
 *                   next_run_at: "2026-05-01T00:00:00.000Z"
 */
router.get('/portfolios/:id/sips', sipController.getSips);


/**
 * @swagger
 * /v1/portfolios/{id}/sips/{sipId}:
 *   delete:
 *     summary: Cancel a SIP
 *     tags: [SIPs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Portfolio ID
 *         schema:
 *           type: string
 *       - in: path
 *         name: sipId
 *         required: true
 *         description: SIP ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: SIP cancelled successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 sipId: sip-uuid
 *                 status: CANCELLED
 *       404:
 *         description: SIP not found
 */
router.delete('/portfolios/:id/sips/:sipId', sipController.cancelSip);

export default router;