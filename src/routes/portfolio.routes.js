import express from 'express'
import portfolioController from '../controllers/portfolio.controller.js'

const router = express.Router()

/**
 * @swagger
 * /v1/portfolios:
 *   post:
 *     summary: Create a new portfolio
 *     tags: [Portfolio]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientName:
 *                 type: string
 *               riskProfile:
 *                 type: string
 *     responses:
 *       201:
 *         description: Portfolio created successfully
 */
router.post('/portfolios', portfolioController.createPortfolio)

/**
 * @swagger
 * /v1/portfolios/{id}:
 *   get:
 *     summary: Get portfolio by ID
 *     tags: [Portfolio]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Portfolio retrieved successfully
 *       404:
 *         description: Portfolio not found
 */
router.get('/portfolios/:id', portfolioController.getPortfolio)

/**
 * @swagger
 * /v1/portfolios/{id}:
 *   delete:
 *     summary: Delete a portfolio by ID
 *     tags: [Portfolio]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Portfolio deleted successfully
 *       404:
 *         description: Portfolio not found
 */
router.delete('/portfolios/:id', portfolioController.deletePortfolio)

export default router