# Testing Implementation Guide

## Overview

This project includes comprehensive test coverage for financial calculations (P&L and cost-basis) with both unit tests and integration tests using real PostgreSQL.

## Test Structure

```
src/test/
├── unit/
│   └── costBasis.unit.test.js          # Unit tests for P&L & cost-basis math
└── integration/
    └── holdings.integration.test.js    # Integration tests with real Postgres
```

## Running Tests

### Install Test Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run Unit Tests Only (Fast)
```bash
npm run test:unit
```

### Run Integration Tests (Requires Docker)
```bash
npm run test:integration
```

---

## Unit Tests: `costBasis.unit.test.js`

**Purpose**: Prove mathematical correctness of all financial calculations

### Test Categories

#### 1. Weighted Average Cost (WAC) Calculation
- **First purchase**: Sets average cost to purchase price
- **Multiple purchases**: Correctly calculates weighted average
- **Fractional shares**: Maintains precision with decimals

**Formula**:
```
WAC = (OldQty × OldAvg + NewQty × NewPrice) / (OldQty + NewQty)
```

**Example**:
- Buy 10 @ $100 = Cost: $1,000, Avg: $100
- Buy 5 @ $110 = Total Cost: $1,550, New Avg: $103.33

#### 2. Profit & Loss (P&L) Calculation
- **P&L = Current Value - Cost Basis**
- **P&L % = (P&L / Cost Basis) × 100**

**Test Cases**:
- Profitable trade: +20% return
- Loss trade: -20% return
- Break-even: 0%
- Portfolio-level aggregation

#### 3. Decimal Precision
- Prevents JavaScript's floating-point errors
- Handles very small values (0.0001 shares)
- Handles very large values (millions)
- Recurring decimals (1/3)

**Key**: Uses `decimal.js` library for accurate financial math

#### 4. Real-World Scenarios
- Day trading (buy & sell same day)
- Long-term holdings (multiple purchases over time)

### Running Unit Tests
```bash
npm run test:unit
```

**Runtime**: ~1-2 seconds (fast, no database)

---

## Integration Tests: `holdings.integration.test.js`

**Purpose**: Test complete flow with real PostgreSQL database using Testcontainers

### What is Testcontainers?

Testcontainers automatically:
1. **Starts** a real PostgreSQL database in a Docker container
2. **Runs** all migrations
3. **Executes** tests against real database
4. **Cleans up** container after tests complete

**Benefits**:
- Tests actual database behavior (not mocks)
- Validates schema matches code expectations
- Catches serialization/deserialization bugs
- Tests complete transaction flow

### Test Scenarios

#### 1. Empty Portfolio
- Verifies holdings return empty array
- Checks summary totals are zero

#### 2. Single Holding with Positive P&L
- Buy 100 AAPL @ $100
- Current price: $150
- Validates:
  - Cost basis: $10,000
  - Current value: $15,000
  - Unrealized P&L: $5,000 (50%)

#### 3. Multiple Holdings with Mixed P&L
- 3 different stocks
- Mixed gains and losses
- Validates portfolio-level aggregation

**Holdings**:
```
AAPL: 50 @ $100 → $150 = +$2,500 gain (+50%)
GOOGL: 30 @ $120 → $110 = -$300 loss (-8.33%)
MSFT: 20 @ $350 → $380 = +$600 gain (+8.57%)

Portfolio Total:
- Cost Basis: $15,600
- Current Value: $18,400
- Total P&L: $2,800 (+17.95%)
```

#### 4. Weighted Average Cost Calculation
- Simulates two buy transactions
- Verifies WAC updates correctly
- Validates database persistence

#### 5. Decimal Precision Through Database
- Inserts fractional shares (0.3333 @ $99.9999)
- Round-trips through database
- Validates precision maintained

#### 6. Large Portfolio Values
- Tests 1M shares @ $5,000 = $5B portfolio
- Validates accuracy at scale
- Ensures no precision loss

#### 7. Edge Case: Zero Cost Basis
- Portfolio with only cash
- Verifies division-by-zero protection
- P&L % should be 0.00 (not error)

### Running Integration Tests
```bash
npm run test:integration
```

**Requirements**:
- Docker installed and running
- First run downloads PostgreSQL image (~400MB)

**Runtime**: ~15-30 seconds (includes container startup)

---

## Mathematical Proofs

### Weighted Average Cost Proof

**Scenario**: 
- Buy 100 shares @ $50 = $5,000
- Buy 50 shares @ $60 = $3,000
- What is average cost?

**Formula**:
```
WAC = (Q₁ × P₁ + Q₂ × P₂) / (Q₁ + Q₂)
    = (100 × 50 + 50 × 60) / (100 + 50)
    = (5000 + 3000) / 150
    = 8000 / 150
    = 53.33 per share
```

**Proof**: Average of $50 and $60 weighted by quantity should be slightly closer to $50 (since we bought more @ $50). ✓

### P&L Percentage Proof

**Scenario**: 
- Bought 10 shares @ $100 = $1,000 cost basis
- Current price: $120 per share = $1,200 value
- What is P&L percentage?

**Formula**:
```
P&L % = ((Current Value - Cost Basis) / Cost Basis) × 100
      = ((1200 - 1000) / 1000) × 100
      = (200 / 1000) × 100
      = 0.20 × 100
      = 20%
```

**Verification**: If I invested $1,000 and now have $1,200, I made 20% return. ✓

### Portfolio Aggregation Proof

**Scenario**:
- Stock A: $1,000 cost → $1,200 value = +$200 (+20%)
- Stock B: $1,000 cost → $900 value = -$100 (-10%)
- Total portfolio P&L %?

**Formula**:
```
Total P&L % = (Total P&L / Total Cost) × 100
            = ((200 - 100) / (1000 + 1000)) × 100
            = (100 / 2000) × 100
            = 5%
```

**Verification**: Net gain $100 on $2,000 investment = 5% return. ✓

---

## Code Coverage

### Files Tested

| File | Coverage |
|------|----------|
| `src/services/holdings.service.js` | P&L calculation logic |
| `src/services/transaction.service.js` | WAC calculation logic |
| `src/db/holdings.queries.js` | Database layer |
| Database schema | Migrations, constraints |

### What's NOT Tested

- API endpoints (would need supertest)
- SIP scheduler (has separate tests)
- Error handling paths (partial)
- Authentication/authorization (not implemented)

---

## Debugging Tests

### Unit Tests Fail?

1. Check `decimal.js` is installed: `npm list decimal.js`
2. Run with verbose output: `npm test -- --verbose`
3. Check for `NaN` in calculations (indicates division by zero)

### Integration Tests Fail?

1. **Docker not running**: `docker status` or restart Docker Desktop
2. **Port conflict**: PostgreSQL default port 5432 might be in use
3. **Timeout**: Increase `testTimeout` in `jest.config.js` if slow machine
4. **Missing migrations**: Check `src/migrations/` exists and is readable

### Debug Integration Test

```bash
# Run single test with debug output
npm run test:integration -- --testNamePattern="Empty portfolio"

# Keep container running for inspection
# (modify test to not cleanup in afterAll)
```

---

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run Tests
  run: |
    npm install
    npm run test:unit
    npm run test:integration
```

### Important Notes
- Integration tests require Docker (won't work in environment without Docker)
- Skip integration tests in CI with: `npm run test:unit`
- Consider using separate CI runs for unit vs integration

---

## Future Improvements

1. **API Endpoint Tests** (supertest)
   - Test `GET /holdings` returns correct P&L
   - Test `POST /transactions` updates WAC correctly

2. **Performance Tests**
   - Load test with 1000+ holdings
   - Query optimization validation

3. **Edge Case Tests**
   - Negative prices (should fail)
   - Sell more than owned (should fail)
   - Concurrent transactions (race conditions)

4. **Snapshot Tests**
   - Store expected P&L outputs
   - Detect unintended calculation changes

---

## References

- [Decimal.js Documentation](https://mikemcl.github.io/decimal.js/)
- [Testcontainers Node](https://node.testcontainers.org/)
- [Jest ESM Support](https://jestjs.io/docs/ecmascript-modules)
- [Weighted Average Cost - Accounting](https://en.wikipedia.org/wiki/Weighted_average)
