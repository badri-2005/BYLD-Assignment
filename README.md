# Portfolio & SIP Management API

This is a Node.js backend application built with Express and Knex for managing investment portfolios, holdings, and Systematic Investment Plans (SIPs). Node.js is my primary framework of expertise, and I've leveraged its event-driven, non-blocking I/O model to build scalable financial services.

## Overview

A comprehensive REST API for:
- **Portfolio Management**: Create and manage investment portfolios
- **Holdings Tracking**: Monitor stock holdings with cost basis calculations
- **Transactions**: Record buy/sell transactions with decimal precision
- **SIPs**: Automated investment scheduling (weekly/monthly execution)
- **Wallet**: Manage portfolio cash balance

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL with Knex.js (query builder)
- **Scheduling**: node-cron for automated SIP execution
- **Precision**: decimal.js for accurate financial calculations
- **Validation**: Joi schemas
- **API Docs**: OpenAPI/Swagger

## Project Structure

```
src/
├── controllers/      # Request handlers
├── services/         # Business logic
├── db/              # Database queries
├── routes/          # API endpoints
├── migrations/      # Database schema versions
├── middleware/      # Express middleware (logging, error handling)
├── schemas/         # Request validation schemas
├── config/          # Configuration (DB, scheduler, swagger)
└── utils/           # Helper utilities
```

## Running the Application

```bash
# Install dependencies
npm install

# Start PostgreSQL via Docker
docker compose up -d

# Run migrations
npx knex migrate:latest

# Start server
npm run dev
```

Server runs on `http://localhost:3000`

## Key Features

### Decimal Precision
Uses `decimal.js` for all financial calculations to avoid floating-point errors:
- Average cost calculations
- Portfolio balance updates
- Transaction amounts

### SIP Automation
- Automated scheduling via node-cron (runs every minute)
- Supports WEEKLY and MONTHLY cadences
- Skips execution if insufficient balance
- Updates `next_run_at` for future scheduling

### Transaction Integrity
- Database transactions ensure atomicity
- Prevents race conditions on balance updates
- Maintains holdings consistency

## API Endpoints

### Portfolios
- `POST /v1/portfolios` - Create portfolio
- `GET /v1/portfolios/:id` - Get portfolio details
- `GET /v1/portfolios/:id/holdings` - List holdings

### SIPs
- `POST /v1/portfolios/:id/sips` - Create SIP
- `GET /v1/portfolios/:id/sips` - List SIPs
- `DELETE /v1/portfolios/:id/sips/:sipId` - Cancel SIP

### Transactions
- `POST /v1/portfolios/:id/transactions` - Record transaction
- `GET /v1/portfolios/:id/transactions` - List transactions

---

## What I'd Do With 2 More Days

### 1. **Input Validation & Error Handling** (1 day)
**Trade-off Made**: Currently using basic try-catch blocks
- **Would Add**: Comprehensive Joi schema validation on all endpoints
- **Why It Matters**: Prevents invalid data (negative amounts, invalid symbols) from reaching the database
- **Cost of Not Having It**: User sees generic 500 errors instead of descriptive validation messages

### 2. **Database Connection Pooling & Query Optimization** (0.5 days)
**Trade-off Made**: Using default Knex connection settings
- **Would Add**: 
  - Tune connection pool size based on load testing
  - Add database indexes on frequently queried columns (portfolio_id, symbol, status)
  - Implement query result caching for company data
- **Why It Matters**: Prevents connection exhaustion under high load
- **Cost of Not Having It**: Performance degrades as concurrent requests increase

### 3. **Unit & Integration Tests** (1.5 days)
**Trade-off Made**: Only manual testing via curl
- **Would Add**:
  - Unit tests for service layer business logic (decimal calculations, balance updates)
  - Integration tests for API endpoints
  - Tests for edge cases (insufficient balance, portfolio not found, duplicate SIP cancellation)
- **Why It Matters**: Ensures refactoring doesn't break existing functionality
- **Cost of Not Having It**: Risk of regression bugs in critical financial operations

### 4. **Audit Logging & Request Tracing** (0.5 days)
**Trade-off Made**: Basic logger middleware exists but doesn't track financial transactions
- **Would Add**:
  - Detailed audit logs for every transaction (who, what, when)
  - Request ID propagation through entire call stack for debugging
  - Separate audit table for compliance/forensics
- **Why It Matters**: Critical for financial applications (regulatory compliance, fraud detection)
- **Cost of Not Having It**: Cannot trace why portfolio balance changed or investigate discrepancies

### 5. **Rate Limiting & Authentication** (0.5 days)
**Trade-off Made**: No auth or rate limiting implemented
- **Would Add**:
  - JWT authentication for portfolio ownership verification
  - Rate limiting per API key/user to prevent abuse
  - Portfolio isolation (users can only access their own portfolios)
- **Why It Matters**: Prevents unauthorized access and API abuse
- **Cost of Not Having It**: Any user can modify any portfolio

### Summary of Key Trade-offs

| Aspect | Current | Trade-off |
|--------|---------|-----------|
| **Validation** | Minimal | Speed to MVP vs. data integrity |
| **Testing** | Manual only | Speed vs. regression risk |
| **Monitoring** | Basic logs | Speed vs. production visibility |
| **Security** | None | MVP scope vs. data protection |
| **Performance** | Not optimized | MVP vs. scale readiness |

The current implementation prioritizes **speed to working MVP** over production-ready robustness. For a 2-day extension, I'd focus on validation and testing first (highest ROI for reliability), then monitoring for operations visibility.
