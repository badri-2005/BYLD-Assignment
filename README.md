# BYLD Backend Assignment (Variant A)

## Overview

This project is built using Node.js and Express.js to implement a Portfolio API for managing investments, transactions, and automated SIPs.

This implementation follows Variant A — SIPs, which includes:

* SIP creation and management
* Automated execution using a cron job
* Integration with transaction logic (BUY operations)

The focus of this project is correct financial calculations, clean architecture, and reproducibility.

---

## Tech Stack

| Component        | Technology              |
| ---------------- | ----------------------- |
| Runtime          | Node.js (v20 LTS)       |
| Framework        | Express.js              |
| Database         | PostgreSQL              |
| Query Builder    | Knex.js                 |
| Money Math       | decimal.js              |
| Validation       | Zod                     |
| Scheduling       | node-cron               |
| Containerization | Docker + Docker Compose |
| API Docs         | Swagger                 |

---

## Why Knex instead of Flyway?

Knex.js is used as a Node.js-native alternative to Flyway because:

* It supports versioned migrations
* Automatically tracks applied migrations
* Allows rollback support
* Integrates well with JavaScript projects

---

## Folder Structure

```text
src/
│
├── app.js                 → Express app setup
├── server.js              → Entry point (runs migrations and starts server)
│
├── config/
│   ├── knex.js            → Database connection
│   └── scheduler.js       → SIP cron job
│
├── routes/                → API route definitions
├── controllers/           → Request/response handling
├── services/              → Business logic
├── db/                    → Database queries
├── utils/                 → Helper functions
├── schemas/               → Validation schemas
├── migrations/            → Database schema setup
```

---

## Features Implemented

### Portfolio

* Create, fetch, and delete portfolios
* Maintains cash_balance

### Wallet

* Deposit money into portfolio
* Validates amount

### Transactions

* BUY and SELL operations
* Weighted average cost calculation
* Atomic database transactions

### Holdings

* Portfolio summary with P&L
* Uses current market price from database

### SIP (Variant A)

* Create, list, and cancel SIPs
* Cron job executes SIPs automatically
* Uses database price for execution

---

## API Endpoints

### 1. Create Portfolio

**POST** `/v1/portfolios`

Request:

```json
{
  "clientName": "Badri",
  "riskProfile": "MODERATE"
}
```

---

### 2. Get Portfolio

**GET** `/v1/portfolios/{id}`

---

### 3. Delete Portfolio

**DELETE** `/v1/portfolios/{id}`

---

### 4. Deposit Money

**POST** `/v1/portfolios/{id}/wallet/deposit`

Request:

```json
{
  "amount": "50000"
}
```

---

### 5. Buy Transaction

**POST** `/v1/portfolios/{id}/transactions/buy`

Request:

```json
{
  "symbol": "RELIANCE",
  "quantity": "5",
  "price": "2450.0000"
}
```

---

### 6. Sell Transaction

**POST** `/v1/portfolios/{id}/transactions/sell`

Request:

```json
{
  "symbol": "RELIANCE",
  "quantity": "2",
  "price": "2500.0000"
}
```

---

### 7. Get Holdings

**GET** `/v1/portfolios/{id}/holdings`

---

### 8. Create SIP

**POST** `/v1/portfolios/{id}/sips`

Request:

```json
{
  "symbol": "TCS",
  "amount": "5000",
  "cadence": "MONTHLY",
  "startDate": "2026-05-01"
}
```

---

### 9. Get SIPs

**GET** `/v1/portfolios/{id}/sips`

---

### 10. Cancel SIP

**DELETE** `/v1/portfolios/{id}/sips/{sipId}`

---



## Getting Started

Clone the repository:

```bash
git clone https://github.com/badri-2005/BYLD-Assignment.git
cd BYLD-Assignment
```

### Configure Environment Variables

Copy the example environment file and update it with your configuration:

```bash
cp .env.example .env
```

Edit `.env` with your actual values:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=portfolio_db
DB_USER=postgres
DB_PASSWORD=your_secure_password
PORT=3000
```
---

## One Command to Run

For Docker deployment:

```bash
docker compose up 
```

This command:

* Starts PostgreSQL container
* Starts Node.js application
* Runs database migrations automatically
* Starts the server on port 3000

---

## Setup (Local Development)

```bash
# Install dependencies
npm install

# Create .env from template
cp .env.example .env

# Update .env with your database credentials
# Then start the server
npm run dev
```

Ensure PostgreSQL is running locally before starting the server.

---

## API Documentation

Swagger UI is available at:

```
http://localhost:3000/swagger-ui/
```

---

## Environment Variables

All configuration is managed through environment variables in the `.env` file.

### Setup Your Environment File

1. Copy the example file:
```bash
cp .env.example .env
```

2. Update `.env` with your actual values:
```env
PORT=3000
DB_HOST=localhost          # Use 'db' when running in Docker
DB_PORT=5432
DB_NAME=portfolio_db
DB_USER=postgres
DB_PASSWORD=your_secure_password
NODE_ENV=development
```

---

## Money Math Rule

* All monetary values are stored as NUMERIC(19,4)
* decimal.js is used to avoid floating point errors
* Native JavaScript numbers are not used for financial calculations

---

## Trade-offs and Design Decisions

1. Simplicity over complexity
   Focused on clear and understandable structure rather than over-engineering

2. Knex over ORM
   Provided better control over SQL queries and easier debugging

3. Basic error handling
   Used simple error messages for clarity during development

4. Inline Swagger documentation
   Faster implementation compared to maintaining a separate YAML file

---

## What I’d Do with 2 More Days

1. Improve SIP execution scalability
   Introduce queue-based processing using BullMQ or Redis

2. Add structured error handling
   Implement custom error classes with proper HTTP status codes

3. Add integration testing
   Use Testcontainers to test with real PostgreSQL instances

4. Improve logging and monitoring
   Add request tracking and performance metrics

5. Production readiness
   Add environment-based configuration and health check endpoints

---

## Final Note

This project focuses on:

* Accurate financial calculations
* Clean modular architecture
* Reproducible setup using Docker

It simulates a real-world backend system used in wealth-tech platforms.

---

Built by
<br />
Badri Narayanan B R
<br />
BYLD Backend Intern Assignment - (Variant A)
<br />
Computer Science and Engineering – KIOT

