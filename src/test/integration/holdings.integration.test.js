

import Decimal from 'decimal.js';
import { PostgreSqlContainer } from 'testcontainers';
import knex from '../../config/knex.js';
import { getHoldings } from '../../services/holdings.service.js';
import * as transactionQueries from '../../db/transaction.queries.js';
import * as holdingsQueries from '../../db/holdings.queries.js';

let container;
let testKnex;
let portfolioId = '550e8400-e29b-41d4-a716-446655440001';

describe('Integration Tests: Holdings & P&L (Real PostgreSQL)', () => {
  
  beforeAll(async () => {
    container = await new PostgreSqlContainer()
      .withDatabase('test_portfolio')
      .withUsername('postgres')
      .withUserPassword('postgres')
      .start();

    const connectionString = container.getConnectionUri();
    
    testKnex = knex({
      client: 'pg',
      connection: connectionString,
      migrations: {
        extension: 'js'
      }
    });

    // Run migrations
    await testKnex.migrate.latest({
      directory: '../../migrations'
    });

    // Seed companies
    await testKnex('companies').insert([
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        category: 'TECHNOLOGY',
        current_price: '150.00',
        sector: 'TECH'
      },
      {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        category: 'TECHNOLOGY',
        current_price: '140.00',
        sector: 'TECH'
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft Corp.',
        category: 'TECHNOLOGY',
        current_price: '380.00',
        sector: 'TECH'
      }
    ]);

    // Create test portfolio
    await testKnex('portfolios').insert({
      id: portfolioId,
      client_name: 'Test Client',
      risk_profile: 'MODERATE',
      cash_balance: '50000.00'
    });
  }, 60000);

  afterAll(async () => {
    if (testKnex) await testKnex.destroy();
    if (container) await container.stop();
  });

  // ==================== BASIC HOLDINGS TEST ====================

  test('Empty portfolio should return zero holdings', async () => {
    const holdings = await getHoldings(portfolioId);
    
    expect(holdings.portfolioId).toBe(portfolioId);
    expect(holdings.holdings).toHaveLength(0);
    expect(holdings.summary.totalHoldings).toBe(0);
    expect(holdings.summary.totalCostBasis).toBe('0.0000');
    expect(holdings.summary.totalCurrentValue).toBe('0.0000');
    expect(holdings.summary.totalUnrealisedPnL).toBe('0.0000');
    expect(holdings.summary.totalPortfolioValue).toBe('50000.0000');
  });

  // ==================== SINGLE HOLDING P&L TEST ====================

  test('Single holding with positive P&L', async () => {
    // Buy 100 AAPL @ $100
    await testKnex('holdings').insert({
      portfolio_id: portfolioId,
      symbol: 'AAPL',
      quantity: '100.0000',
      avg_cost: '100.0000'
    });

    // Update company price to $150
    await testKnex('companies')
      .where({ symbol: 'AAPL' })
      .update({ current_price: '150.00' });

    const holdings = await getHoldings(portfolioId);
    
    expect(holdings.holdings).toHaveLength(1);
    
    const appl = holdings.holdings[0];
    expect(appl.symbol).toBe('AAPL');
    expect(appl.quantity).toBe('100.0000');
    expect(appl.avgCostBasis).toBe('100.0000');
    expect(appl.currentPrice).toBe('150.0000');
    
    // Cost basis: 100 * 100 = 10,000
    expect(appl.costBasisTotal).toBe('10000.0000');
    
    // Current value: 100 * 150 = 15,000
    expect(appl.currentValue).toBe('15000.0000');
    
    // P&L: 15,000 - 10,000 = 5,000
    expect(appl.unrealisedPnL).toBe('5000.0000');
    
    // P&L %: 5,000 / 10,000 = 50%
    expect(appl.unrealisedPnLPct).toBe('50.00');
    
    // Portfolio totals
    expect(holdings.summary.totalHoldings).toBe(1);
    expect(holdings.summary.totalCostBasis).toBe('10000.0000');
    expect(holdings.summary.totalCurrentValue).toBe('15000.0000');
    expect(holdings.summary.totalUnrealisedPnL).toBe('5000.0000');
    expect(holdings.summary.totalUnrealisedPnLPct).toBe('50.00');
    
    // Portfolio value = current value + cash = 15,000 + 50,000 = 65,000
    expect(holdings.summary.totalPortfolioValue).toBe('65000.0000');
  });

  // ==================== MULTIPLE HOLDINGS TEST ====================

  test('Multiple holdings with mixed P&L', async () => {
    // Clean up previous test
    await testKnex('holdings').where({ portfolio_id: portfolioId }).del();

    // Add holdings
    await testKnex('holdings').insert([
      {
        portfolio_id: portfolioId,
        symbol: 'AAPL',
        quantity: '50.0000',
        avg_cost: '100.0000'  // Cost basis: 5,000
      },
      {
        portfolio_id: portfolioId,
        symbol: 'GOOGL',
        quantity: '30.0000',
        avg_cost: '120.0000'  // Cost basis: 3,600
      },
      {
        portfolio_id: portfolioId,
        symbol: 'MSFT',
        quantity: '20.0000',
        avg_cost: '350.0000'  // Cost basis: 7,000
      }
    ]);

    // Set prices for P&L calculation
    await testKnex('companies')
      .where({ symbol: 'AAPL' })
      .update({ current_price: '150.00' }); // Gain: 50 * 50 = 2,500

    await testKnex('companies')
      .where({ symbol: 'GOOGL' })
      .update({ current_price: '110.00' }); // Loss: 30 * -10 = -300

    await testKnex('companies')
      .where({ symbol: 'MSFT' })
      .update({ current_price: '380.00' }); // Gain: 20 * 30 = 600

    const holdings = await getHoldings(portfolioId);
    
    expect(holdings.holdings).toHaveLength(3);
    
    // Check AAPL
    const aapl = holdings.holdings.find(h => h.symbol === 'AAPL');
    expect(aapl.costBasisTotal).toBe('5000.0000');
    expect(aapl.currentValue).toBe('7500.0000');
    expect(aapl.unrealisedPnL).toBe('2500.0000');
    expect(aapl.unrealisedPnLPct).toBe('50.00');
    
    // Check GOOGL (loss)
    const googl = holdings.holdings.find(h => h.symbol === 'GOOGL');
    expect(googl.costBasisTotal).toBe('3600.0000');
    expect(googl.currentValue).toBe('3300.0000');
    expect(googl.unrealisedPnL).toBe('-300.0000');
    expect(googl.unrealisedPnLPct).toBe('-8.33');
    
    // Check MSFT
    const msft = holdings.holdings.find(h => h.symbol === 'MSFT');
    expect(msft.costBasisTotal).toBe('7000.0000');
    expect(msft.currentValue).toBe('7600.0000');
    expect(msft.unrealisedPnL).toBe('600.0000');
    expect(msft.unrealisedPnLPct).toBe('8.57');
    
    // Portfolio totals
    // Total cost basis: 5,000 + 3,600 + 7,000 = 15,600
    expect(holdings.summary.totalCostBasis).toBe('15600.0000');
    
    // Total current value: 7,500 + 3,300 + 7,600 = 18,400
    expect(holdings.summary.totalCurrentValue).toBe('18400.0000');
    
    // Total P&L: 2,500 - 300 + 600 = 2,800
    expect(holdings.summary.totalUnrealisedPnL).toBe('2800.0000');
    
    // Total P&L %: 2,800 / 15,600 = 17.95%
    expect(holdings.summary.totalUnrealisedPnLPct).toBe('17.95');
    
    // Portfolio value: 18,400 + 50,000 = 68,400
    expect(holdings.summary.totalPortfolioValue).toBe('68400.0000');
  });

  // ==================== WEIGHTED AVERAGE COST TEST ====================

  test('Weighted average cost calculation on multiple buys', async () => {
    // Clean up
    await testKnex('holdings').where({ portfolio_id: portfolioId }).del();
    
    // Simulate multiple buy transactions through holdings
    // Buy 1: 100 shares @ $100 avg cost
    await testKnex('holdings').insert({
      portfolio_id: portfolioId,
      symbol: 'AAPL',
      quantity: '100.0000',
      avg_cost: '100.0000'
    });

    let holding = await testKnex('holdings')
      .where({ portfolio_id: portfolioId, symbol: 'AAPL' })
      .first();
    
    expect(holding.avg_cost).toBe('100.0000');
    expect(holding.quantity).toBe('100.0000');

    // Simulate Buy 2: 50 shares @ $110
    // New average: (100*100 + 50*110) / 150 = 13,500 / 150 = 90
    // Wait, that's wrong. Let me recalculate: (10000 + 5500) / 150 = 15500 / 150 = 103.33
    
    const oldQty = new Decimal(holding.quantity);
    const oldAvg = new Decimal(holding.avg_cost);
    const newQtyAdd = new Decimal('50.0000');
    const newPrice = new Decimal('110.0000');
    
    const newQty = oldQty.plus(newQtyAdd);
    const totalCost = oldQty.mul(oldAvg).plus(newQtyAdd.mul(newPrice));
    const newAvg = totalCost.div(newQty);
    
    await testKnex('holdings')
      .where({ portfolio_id: portfolioId, symbol: 'AAPL' })
      .update({
        quantity: newQty.toFixed(4),
        avg_cost: newAvg.toFixed(4)
      });

    holding = await testKnex('holdings')
      .where({ portfolio_id: portfolioId, symbol: 'AAPL' })
      .first();
    
    expect(holding.quantity).toBe('150.0000');
    expect(holding.avg_cost).toBe('103.3333');
  });

  // ==================== DECIMAL PRECISION TEST ====================

  test('Decimal precision is maintained through database round-trip', async () => {
    // Clean up
    await testKnex('holdings').where({ portfolio_id: portfolioId }).del();

    // Insert fractional shares with precise cost
    const qty = new Decimal('0.3333');
    const avgCost = new Decimal('99.9999');
    
    await testKnex('holdings').insert({
      portfolio_id: portfolioId,
      symbol: 'GOOGL',
      quantity: qty.toFixed(4),
      avg_cost: avgCost.toFixed(4)
    });

    const holding = await testKnex('holdings')
      .where({ portfolio_id: portfolioId, symbol: 'GOOGL' })
      .first();

    // Verify precision
    expect(holding.quantity).toBe('0.3333');
    expect(holding.avg_cost).toBe('99.9999');
    
    // Calculate cost basis
    const qtyFromDb = new Decimal(holding.quantity);
    const costFromDb = new Decimal(holding.avg_cost);
    const costBasis = qtyFromDb.mul(costFromDb);
    
    expect(costBasis.toFixed(4)).toBe('33.3299');
  });

  // ==================== EDGE CASE: VERY LARGE PORTFOLIO ====================

  test('Large portfolio values maintain accuracy', async () => {
    // Clean up
    await testKnex('holdings').where({ portfolio_id: portfolioId }).del();

    // Large position: 1,000,000 shares @ $5000
    await testKnex('holdings').insert({
      portfolio_id: portfolioId,
      symbol: 'AAPL',
      quantity: '1000000.0000',
      avg_cost: '5000.0000'
    });

    await testKnex('companies')
      .where({ symbol: 'AAPL' })
      .update({ current_price: '5100.0000' });

    const holdings = await getHoldings(portfolioId);
    const aapl = holdings.holdings[0];

    // Cost basis: 1,000,000 * 5,000 = 5,000,000,000
    expect(aapl.costBasisTotal).toBe('5000000000.0000');

    // Current value: 1,000,000 * 5,100 = 5,100,000,000
    expect(aapl.currentValue).toBe('5100000000.0000');

    // P&L: 100,000,000
    expect(aapl.unrealisedPnL).toBe('100000000.0000');

    // P&L %: 100,000,000 / 5,000,000,000 = 2%
    expect(aapl.unrealisedPnLPct).toBe('2.00');
  });

  // ==================== ZERO COST BASIS EDGE CASE ====================

  test('Zero cost basis should not cause division errors', async () => {
    // Clean up
    await testKnex('holdings').where({ portfolio_id: portfolioId }).del();

    // Create portfolio with only cash
    const holdings = await getHoldings(portfolioId);

    expect(holdings.summary.totalCostBasis).toBe('0.0000');
    expect(holdings.summary.totalUnrealisedPnLPct).toBe('0.00');
    expect(holdings.summary.totalPortfolioValue).toBe('50000.0000');
  });
});
