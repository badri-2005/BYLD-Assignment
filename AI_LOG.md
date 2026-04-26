# AI_LOG.md - BYLD Portfolio & SIP Management API

## Tools Used

* **ChatGPT** – Primary tool for understanding concepts, designing modules, and debugging major issues
* **Claude** – Used for generating and validating industry-level folder structure and architecture
* **GitHub Copilot** – Used for inline suggestions, quick fixes, and syntax completion inside VS Code

---

## Significant Prompts & Code Outcomes

### 1. Backend Structure Design

**Prompt**:
"Give me structured backend  for Node.js Express with proper folder structure"

**What AI Produced**:
A layered architecture with routes → controllers → services → db separation.

**What You Kept**:

* Full modular structure
* Clear separation of concerns

**What You Rejected and WHY**:

* Some enterprise-level abstractions (too complex for this assignment)
* Simplified to beginner-friendly but scalable structure

**Tool Used**: Claude

---

### 2. Swagger Documentation Issue

**Prompt**:
"Add swagger documentation for routes and make it work"

**What AI Produced**:

* Swagger JSDoc format with request/response examples
* Tag-based grouping of APIs

**What You Kept**:

* Swagger structure
* Example request/response
* Path parameter definitions

**What You Rejected and WHY**:

* Overly detailed schemas
* Simplified examples for readability

**Tool Used**: ChatGPT

---

### 3. Docker Execution Error

**Prompt**:
"docker compose up error: dockerDesktopLinuxEngine not found"

**What AI Produced**:

* Identified Docker engine not running
* Suggested starting Docker Desktop
* Explained DB_HOST must be `db`

**What You Kept**:

* Docker troubleshooting steps
* Correct service-to-service communication

**What You Rejected and WHY**:

* None (issue was environmental, not architectural)

**Tool Used**: ChatGPT

---

### 4. Transaction Module Logic

**Prompt**:
"Implement buy and sell transaction with weighted average logic"

**What AI Produced**:

* BUY/SELL logic
* Decimal.js usage
* Atomic DB transaction

**What You Kept**:

* Weighted average formula
* Transaction safety using DB transactions
* Decimal handling

**What You Rejected and WHY**:

* Complex error handling classes
* Simplified to basic error strings for clarity

**Tool Used**: ChatGPT

---

### 5. SIP Execution Bug

**Prompt**:
Error: "sips is not iterable"

**What AI Produced**:

* Identified missing `return` in Knex queries
* Fixed query functions

**What You Kept**:

* All fixes
* Corrected query structure

**Why**:
Knex queries must be returned to be awaited

**Tool Used**: ChatGPT + Copilot (verification inline)

---

### 6. Import/Export Error

**Prompt**:
"deleteHolding not exported error"

**What AI Produced**:

* Identified mismatch between default export and named import

**What You Kept**:

* Switched to named exports

**Why**:
Ensures consistency across modules

**Tool Used**: ChatGPT

---

## A Bug Your AI Introduced

**Bug**:
Mismatch between default export and named import:

```js
export default { deleteHolding }
```

But used:

```js
import { deleteHolding } from ...
```

**Error**:

```
does not provide an export named 'deleteHolding'
```

**How I Caught It**:

* Runtime error during execution
* Checked import/export pattern mismatch

**Fix**:

```js
export const deleteHolding = ...
```

---

## A Design Choice Made Against AI Suggestion

**Issue**:
Whether to add an `amount` column in portfolio

**AI Suggestion (implicit confusion)**:
Consider storing amount separately

**What I Did Instead**:
Used only `cash_balance`

**Why**:

* Avoids duplicate data
* Maintains single source of truth
* Matches real-world wallet system (Groww/Zerodha)
* Aligns with assignment schema

---

## Time Split

### 23/04/26

* ~1.5 hours
* Understood project requirements
* Designed system workflow
* Created project structure

### 24/04/26

* Around 3+ Hours of implementation
* Implemented portfolio APIs - create , read , delete portfolios.
* Added wallet API for adding amount by the user based on their portfolio id.

### 25/04/26

* Around 4+ Hours of implementation
* Implemented transactions (BUY/SELL) - Created services , controllers and routes 
* Implemented holdings module

### 26/04/26

* Around 3 Hours of implementation for assignment specific module - Variant A
* Implemented Variant A (SIP module)
* Added Docker setup

---

### Overall Effort Distribution

* Writing Code: 40%
* AI Prompting: 20%
* Reviewing AI Output: 10%
* Debugging: 25%
* Testing: 5%

---

## Final Reflection

AI tools helped accelerate development, but:

* Debugging and validation were manual
* Understanding system flow was essential
* Critical decisions (schema, money logic) required human judgment

The project emphasizes correctness, reproducibility, and clarity over unnecessary complexity.
