# AI_LOG.md - BYLD Backend Internship Assignment - Variant A

## Tools Used

* **ChatGPT** — Primary tool used for debugging, understanding concepts, Swagger setup, and Docker-related issues
* **Claude** — Used for initializing and validating industry-level folder structure and architecture
* **GitHub Copilot** — Used for inline suggestions, especially while writing Knex queries and schemas

---

## Significant Prompts & Code Outcomes

### 1. Project Structure Initialization

**Prompt :**
"Generate a proper backend folder structure for Node.js and Express"

**What AI Produced:**
A modular backend structure with routes, controllers, services, and database layers.

**What I Kept:**

* Clear separation of concerns
* Scalable folder organization

**What I Rejected and Why:**

* Removed unnecessary abstraction layers to keep it simple and aligned with assignment scope

**Tool Used:** Claude

---

### 2. Portfolio Module Implementation (Knex Integration)

**Prompt (based on requirement):**
"How to implement Knex queries for portfolio APIs (create, get, delete) in Node.js"

**What AI Produced:**

* Knex query structure for insert, select, and delete operations
* Basic integration of Knex with service layer

**What I Kept:**

* Knex query syntax and usage
* Query structure for CRUD operations

**What I Modified:**

* Adjusted queries to match API contract
* Updated migration schema to align with required fields
* Ensured UUID generation and correct response format


**Why:**
Knex provided flexibility in writing SQL-like queries while keeping integration simple and readable.

**Tool Used:** Copilot + ChatGPT


---

### 3. Swagger UI Not Loading

**Prompt (actual issue):**
"Swagger UI is not opening and showing error in Chrome DevTools, what changes are needed?"

**What AI Produced:**

* Identified configuration issues in Swagger setup
* Suggested correct Swagger initialization and route setup

**What I Kept:**

* Swagger configuration fixes
* Proper documentation structure

**What I Rejected and Why:**

* Removed overly complex schema definitions to keep documentation readable

**Tool Used:** ChatGPT

---

### 4. API Route Not Working

**Prompt (actual issue):**
"API is not working, showing 'Cannot GET ...'. I think there is an issue in routing, find and fix it"

**What AI Produced:**

* Identified incorrect route mounting
* Suggested proper use of route prefixes

**What I Kept:**

* Correct route configuration
* Proper endpoint structure

**Why:**
Ensured APIs are accessible and correctly mapped

**Tool Used:** ChatGPT

---

### 5. Docker Execution Error

**Prompt (actual issue):**
"docker compose up error: dockerDesktopLinuxEngine not found"

**What AI Produced:**

* Identified that Docker Engine was not running
* Suggested starting Docker Desktop
* Explained container networking (`DB_HOST=db` instead of localhost)

**What I Kept:**

* Docker troubleshooting steps
* Correct container communication setup

**What I Rejected and Why:**

* Nothing — the issue was environmental and correctly identified

**Insight:**
Learned that services inside Docker communicate using service names, not localhost

**Tool Used:** ChatGPT

---

### 6. Transaction Module Logic (BUY/SELL)

**Prompt (paraphrased):**
"Implement buy and sell transaction with weighted average cost using decimal.js"

**What AI Produced:**

* BUY/SELL logic
* Weighted average cost calculation
* Decimal.js integration
* Database transaction handling

**What I Kept:**

* Weighted average formula
* Atomic transaction logic
* Decimal handling for financial accuracy

**What I Rejected and Why:**

* Complex error-handling classes
* Simplified error handling to basic error messages for readability

**Insight:**
Ensured financial calculations are precise and consistent using decimal.js instead of native JS numbers

**Tool Used:** ChatGPT

---

### 7. Database Export Error Fix

**Prompt (actual issue):**
"SyntaxError: The requested module '../db/holdings.queries.js' does not provide an export named 'deleteHolding'"

**What AI Produced:**

* Identified mismatch between default export and named import

**What I Kept:**

* Converted all exports to named exports

**Why:**
Ensures consistency and prevents runtime module errors

**Tool Used:** ChatGPT

---

## A Bug AI Introduced

**Bug:**
Mismatch between default export and named import:

```js
export default { deleteHolding }
```

Used as:

```js
import { deleteHolding } from ...
```

**Error:**

```
does not provide an export named 'deleteHolding'
```

**How I Caught It:**

* Runtime error during execution
* Verified mismatch between export and import patterns

**Fix:**
Converted to named export:

```js
export const deleteHolding = ...
```

---

## A Design Choice Made Against AI Suggestion

**Situation:**
Consideration to add an additional `amount` field alongside `cash_balance`.

**What I Did Instead:**
Used only `cash_balance` as the single source of truth.

**Why:**

* Avoids data duplication
* Prevents inconsistency between fields
* Simplifies system understanding and analysis
* Aligns with real-world financial systems

---

## Time Split

### 23/04/26

* 1.5 hours of implemention
* Understood project requirements
* Designed system workflow
* Created project structure

### 24/04/26

* Around 3+ Hours of implementation
* Implemented portfolio APIs - create , read , delete portfolios.
* Added wallet API for adding amount by the user based on their portfolio id.

### 25/04/26

* Around 3+ Hours of implementation
* Implemented transactions (BUY/SELL) - Created services , controllers and routes
* Implemented holdings module

### 26/04/26

* Around 3 Hours of implementation for assignment specific module - Variant A
* Implemented Variant A (SIP module)
* Added Docker setup

### 27/04/26

* Spent around 1 Hour for reviewing the documentation both ai_log.md and readme.md
* Recorded walkthrough video

---


### Overall Effort Distribution

* Writing Code: 40%
* AI Prompting: 20%
* Reviewing AI Output: 10%
* Debugging: 25%
* Testing: 5%

---

## Final Reflection

AI tools accelerated development, especially for debugging and structuring components.

However:

* Core design decisions were made manually
* Financial logic required careful validation
* Debugging required understanding beyond AI suggestions

AI was used as a supporting tool, while final implementation decisions were based on my own reasoning.

---

---
Built by
<br />
Badri Narayanan B R
<br />
BYLD Backend Intern Assignment - (Variant A)
<br />
Computer Science and Engineering – KIOT
