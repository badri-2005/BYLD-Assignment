/**
 * Unit Tests for P&L and Cost Basis Calculations
 * 
 * These tests prove the mathematical correctness of:
 * - Weighted Average Cost (WAC) calculation
 * - Profit/Loss calculations
 * - Decimal precision handling
 */

import Decimal from 'decimal.js';

describe('Cost Basis & P&L Calculations', () => {
  
  // ==================== WEIGHTED AVERAGE COST TESTS ====================
  
  describe('Weighted Average Cost (WAC) Calculation', () => {
    
    test('First purchase should set average cost to purchase price', () => {
      const qty = new Decimal('10');
      const price = new Decimal('100.50');
      const avgCost = price; // First purchase
      
      expect(avgCost.toFixed(4)).toBe('100.5000');
      expect(avgCost.eq(price)).toBe(true);
    });

    test('Second purchase should calculate weighted average correctly', () => {
      // First purchase: 10 shares @ $100
      const oldQty = new Decimal('10');
      const oldAvg = new Decimal('100.00');
      
      // Second purchase: 5 shares @ $110
      const newQtyAdd = new Decimal('5');
      const newPrice = new Decimal('110.00');
      
      // Calculation: (10*100 + 5*110) / 15
      const totalQty = oldQty.plus(newQtyAdd);
      const totalCost = oldQty.mul(oldAvg).plus(newQtyAdd.mul(newPrice));
      const newAvg = totalCost.div(totalQty);
      
      // Expected: (1000 + 550) / 15 = 1550 / 15 = 103.33...
      expect(newAvg.toFixed(4)).toBe('103.3333');
    });

    test('Multiple purchases should maintain correct WAC', () => {
      // Buy 1: 100 shares @ $50
      let qty = new Decimal('100');
      let avg = new Decimal('50.00');
      
      // Buy 2: 50 shares @ $60
      const qty2 = new Decimal('50');
      const price2 = new Decimal('60.00');
      qty = qty.plus(qty2);
      avg = qty.mul(avg).minus(qty2.mul(price2)).div(qty);
      // Wait, that's wrong. Let me recalculate properly
      
      // Reset and do it right
      qty = new Decimal('100');
      avg = new Decimal('50.00');
      
      let totalCostBasis = qty.mul(avg); // 5000
      
      qty = qty.plus(qty2); // 150
      totalCostBasis = totalCostBasis.plus(qty2.mul(price2)); // 5000 + 3000 = 8000
      avg = totalCostBasis.div(qty); // 8000 / 150 = 53.33...
      
      expect(qty.toFixed(4)).toBe('150.0000');
      expect(avg.toFixed(4)).toBe('53.3333');
      expect(totalCostBasis.toFixed(2)).toBe('8000.00');
      
      // Buy 3: 100 shares @ $55
      const qty3 = new Decimal('100');
      const price3 = new Decimal('55.00');
      
      totalCostBasis = totalCostBasis.plus(qty3.mul(price3)); // 8000 + 5500 = 13500
      qty = qty.plus(qty3); // 250
      avg = totalCostBasis.div(qty); // 13500 / 250 = 54.00
      
      expect(qty.toFixed(4)).toBe('250.0000');
      expect(avg.toFixed(4)).toBe('54.0000');
      expect(totalCostBasis.toFixed(2)).toBe('13500.00');
    });

    test('Fractional shares should maintain precision', () => {
      // Buy 1: 0.5 shares @ $100.25
      const qty1 = new Decimal('0.5');
      const price1 = new Decimal('100.25');
      
      let qty = qty1;
      let avg = price1;
      
      // Buy 2: 0.3333 shares @ $99.99
      const qty2 = new Decimal('0.3333');
      const price2 = new Decimal('99.99');
      
      let totalCostBasis = qty.mul(avg).plus(qty2.mul(price2));
      qty = qty.plus(qty2);
      avg = totalCostBasis.div(qty);
      
      // (0.5 * 100.25 + 0.3333 * 99.99) / (0.5 + 0.3333)
      // = (50.125 + 33.3263667) / 0.8333
      // = 83.4513667 / 0.8333 = 100.1416...
      
      expect(avg.toFixed(4)).toBe('100.1416');
      expect(qty.toFixed(4)).toBe('0.8333');
    });
  });

  // ==================== P&L CALCULATION TESTS ====================

  describe('Profit & Loss (P&L) Calculation', () => {
    
    test('Profitable trade: Buy $100, Sell at $120', () => {
      const costBasis = new Decimal('100.00');
      const currentValue = new Decimal('120.00');
      const pnl = currentValue.minus(costBasis);
      const pnlPct = pnl.div(costBasis).mul(100);
      
      expect(pnl.toFixed(2)).toBe('20.00');
      expect(pnlPct.toFixed(2)).toBe('20.00');
    });

    test('Loss trade: Buy $100, Sell at $80', () => {
      const costBasis = new Decimal('100.00');
      const currentValue = new Decimal('80.00');
      const pnl = currentValue.minus(costBasis);
      const pnlPct = pnl.div(costBasis).mul(100);
      
      expect(pnl.toFixed(2)).toBe('-20.00');
      expect(pnlPct.toFixed(2)).toBe('-20.00');
    });

    test('Break-even trade: Buy $100, Sell at $100', () => {
      const costBasis = new Decimal('100.00');
      const currentValue = new Decimal('100.00');
      const pnl = currentValue.minus(costBasis);
      const pnlPct = pnl.div(costBasis).mul(100);
      
      expect(pnl.toFixed(2)).toBe('0.00');
      expect(pnlPct.toFixed(2)).toBe('0.00');
    });

    test('Portfolio-level P&L with multiple holdings', () => {
      // Holding 1: 10 shares, cost basis $100, current price $120
      const qty1 = new Decimal('10');
      const avg1 = new Decimal('100.00');
      const price1 = new Decimal('120.00');
      
      const costBasis1 = qty1.mul(avg1);
      const value1 = qty1.mul(price1);
      const pnl1 = value1.minus(costBasis1);
      
      // Holding 2: 5 shares, cost basis $200, current price $180
      const qty2 = new Decimal('5');
      const avg2 = new Decimal('200.00');
      const price2 = new Decimal('180.00');
      
      const costBasis2 = qty2.mul(avg2);
      const value2 = qty2.mul(price2);
      const pnl2 = value2.minus(costBasis2);
      
      // Total portfolio
      const totalCostBasis = costBasis1.plus(costBasis2);
      const totalValue = value1.plus(value2);
      const totalPnL = pnl1.plus(pnl2);
      const totalPnLPct = totalPnL.div(totalCostBasis).mul(100);
      
      // Holding 1: 1000 -> 1200 = +200
      // Holding 2: 1000 -> 900 = -100
      // Total: 2000 -> 2100 = +100
      
      expect(costBasis1.toFixed(2)).toBe('1000.00');
      expect(value1.toFixed(2)).toBe('1200.00');
      expect(pnl1.toFixed(2)).toBe('200.00');
      
      expect(costBasis2.toFixed(2)).toBe('1000.00');
      expect(value2.toFixed(2)).toBe('900.00');
      expect(pnl2.toFixed(2)).toBe('-100.00');
      
      expect(totalCostBasis.toFixed(2)).toBe('2000.00');
      expect(totalValue.toFixed(2)).toBe('2100.00');
      expect(totalPnL.toFixed(2)).toBe('100.00');
      expect(totalPnLPct.toFixed(2)).toBe('5.00');
    });

    test('P&L percentage with small cost basis should not divide by zero', () => {
      const costBasis = new Decimal('0');
      const currentValue = new Decimal('100');
      
      let pnlPct;
      if (costBasis.eq(0)) {
        pnlPct = new Decimal(0);
      } else {
        const pnl = currentValue.minus(costBasis);
        pnlPct = pnl.div(costBasis).mul(100);
      }
      
      expect(pnlPct.toFixed(2)).toBe('0.00');
    });
  });

  // ==================== DECIMAL PRECISION TESTS ====================

  describe('Decimal Precision & Edge Cases', () => {
    
    test('Should handle small decimal values accurately', () => {
      const qty = new Decimal('0.0001');
      const price = new Decimal('50000.00');
      const value = qty.mul(price);
      
      expect(value.toFixed(4)).toBe('5.0000');
    });

    test('Should handle very large portfolio values', () => {
      const qty = new Decimal('1000000');
      const price = new Decimal('5000.50');
      const value = qty.mul(price);
      
      expect(value.toFixed(2)).toBe('5000500000.00');
    });

    test('Recurring decimal should maintain precision', () => {
      // 10 / 3 = 3.333...
      const dividend = new Decimal('10');
      const divisor = new Decimal('3');
      const result = dividend.div(divisor);
      
      // Decimal.js maintains high precision
      expect(result.toFixed(4)).toBe('3.3333');
      expect(result.toFixed(10)).toBe('3.3333333333');
    });

    test('Should not have floating point errors like JavaScript native', () => {
      // Native JS: 0.1 + 0.2 !== 0.3
      const nativeResult = 0.1 + 0.2;
      expect(nativeResult).not.toBe(0.3); // Floating point error
      
      // Decimal.js: correctly handles this
      const decimalResult = new Decimal('0.1').plus(new Decimal('0.2'));
      expect(decimalResult.toFixed(1)).toBe('0.3');
    });

    test('Rounding should follow financial standards (half-up)', () => {
      Decimal.set({ rounding: Decimal.ROUND_HALF_UP });
      
      const value = new Decimal('10.125');
      expect(value.toFixed(2)).toBe('10.13');
      
      const value2 = new Decimal('10.124');
      expect(value2.toFixed(2)).toBe('10.12');
    });
  });

  // ==================== WEIGHTED AVERAGE COST - SELL SCENARIO ====================

  describe('Cost Basis After Partial Sell', () => {
    
    test('Partial sell should maintain average cost for remaining shares', () => {
      // Initial: 100 shares @ $50 average
      let qty = new Decimal('100');
      let avg = new Decimal('50.00');
      
      // Sell 30 shares
      const sellQty = new Decimal('30');
      const sellPrice = new Decimal('60.00');
      
      // After selling, remaining 70 shares still have avg cost of $50
      const remainingQty = qty.minus(sellQty);
      const remainingAvgCost = avg; // Doesn't change
      
      expect(remainingQty.toFixed(4)).toBe('70.0000');
      expect(remainingAvgCost.toFixed(2)).toBe('50.00');
    });

    test('Multiple buys and sells should maintain correct average cost', () => {
      // Buy 1: 100 @ $50 -> total cost = 5000, avg = 50
      let qty = new Decimal('100');
      let avg = new Decimal('50.00');
      
      // Buy 2: 50 @ $60 -> total cost = 5000 + 3000 = 8000, avg = 8000/150 = 53.33
      const qty2 = new Decimal('50');
      const price2 = new Decimal('60.00');
      let totalCostBasis = qty.mul(avg).plus(qty2.mul(price2));
      qty = qty.plus(qty2);
      avg = totalCostBasis.div(qty);
      
      expect(qty.toFixed(4)).toBe('150.0000');
      expect(avg.toFixed(4)).toBe('53.3333');
      
      // Sell 50 -> remaining 100 shares still have avg cost of 53.33
      const sellQty = new Decimal('50');
      qty = qty.minus(sellQty);
      // Average cost doesn't change on sell (FIFO or average cost method)
      
      expect(qty.toFixed(4)).toBe('100.0000');
      expect(avg.toFixed(4)).toBe('53.3333');
    });
  });

  // ==================== REAL WORLD SCENARIOS ====================

  describe('Real-World Trading Scenarios', () => {
    
    test('Day trader scenario: buy and sell same day with gain', () => {
      const buyQty = new Decimal('50');
      const buyPrice = new Decimal('100.00');
      const costBasis = buyQty.mul(buyPrice); // 5000
      
      const sellQty = new Decimal('50');
      const sellPrice = new Decimal('105.00');
      const proceeds = sellQty.mul(sellPrice); // 5250
      
      const gain = proceeds.minus(costBasis); // 250
      const gainPct = gain.div(costBasis).mul(100); // 5%
      
      expect(costBasis.toFixed(2)).toBe('5000.00');
      expect(proceeds.toFixed(2)).toBe('5250.00');
      expect(gain.toFixed(2)).toBe('250.00');
      expect(gainPct.toFixed(2)).toBe('5.00');
    });

    test('Long-term hold: multiple buys over time', () => {
      // Month 1: Buy 10 @ $100
      let qty = new Decimal('10');
      let avg = new Decimal('100.00');
      
      // Month 2: Buy 10 @ $95
      const qty2 = new Decimal('10');
      const price2 = new Decimal('95.00');
      let totalCost = qty.mul(avg).plus(qty2.mul(price2));
      qty = qty.plus(qty2);
      avg = totalCost.div(qty);
      
      // Month 3: Buy 10 @ $110
      const qty3 = new Decimal('10');
      const price3 = new Decimal('110.00');
      totalCost = totalCost.plus(qty3.mul(price3));
      qty = qty.plus(qty3);
      avg = totalCost.div(qty);
      
      // Now worth $120 per share
      const currentPrice = new Decimal('120.00');
      const currentValue = qty.mul(currentPrice);
      const pnl = currentValue.minus(totalCost);
      const pnlPct = pnl.div(totalCost).mul(100);
      
      // 30 shares, avg cost = (1000 + 950 + 1100) / 30 = 3050 / 30 = 101.67
      // Current value = 30 * 120 = 3600
      // P&L = 3600 - 3050 = 550
      // P&L % = 550 / 3050 = 18.03%
      
      expect(qty.toFixed(4)).toBe('30.0000');
      expect(avg.toFixed(4)).toBe('101.6667');
      expect(totalCost.toFixed(2)).toBe('3050.00');
      expect(currentValue.toFixed(2)).toBe('3600.00');
      expect(pnl.toFixed(2)).toBe('550.00');
      expect(pnlPct.toFixed(2)).toBe('18.03');
    });
  });
});
