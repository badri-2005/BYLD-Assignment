import express from 'express';
import investmentController from '../controllers/investment.controller.js';

const router = express.Router();

// /**
//  * @swagger
//  * /v1/investments/categories:
//  *   get:
//  *     summary: Get all investment categories
//  *     tags: [Investments]
//  *     responses:
//  *       200:
//  *         description: List of categories
//  *         content:
//  *           application/json:
//  *             example:
//  *               success: true
//  *               data:
//  *                 - code: ETF
//  *                   label: Exchange Traded Funds
//  *                   description: Diversified index-tracking funds
//  *                 - code: MTF
//  *                   label: Mutual Funds
//  *                   description: Actively managed fund schemes
//  */
router.get('/investments/categories', investmentController.getCategories);


// /**
//  * @swagger
//  * /v1/investments/{category}/companies:
//  *   get:
//  *     summary: Get companies by category
//  *     tags: [Investments]
//  *     parameters:
//  *       - in: path
//  *         name: category
//  *         required: true
//  *         schema:
//  *           type: string
//  *           enum: [ETF, MTF, BONDS, SHARES]
//  *     responses:
//  *       200:
//  *         description: Companies list
//  *         content:
//  *           application/json:
//  *             example:
//  *               success: true
//  *               data:
//  *                 category: SHARES
//  *                 companies:
//  *                   - symbol: RELIANCE
//  *                     name: Reliance Industries Ltd
//  *                     price: "2510.0000"
//  *                     minLotSize: "1"
//  *       400:
//  *         description: Invalid category
//  */
router.get('/investments/:category/companies', investmentController.getCompanies);

export default router;