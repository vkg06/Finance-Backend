# Finance Backend API
## Overview
This project is a backend system for managing financial transactions.
It includes authentication, role-based access control, and APIs for handling transactions and summaries.

The system is designed to reflect real-world backend architecture with proper security and structure.
## Tech Stack
* Node.js
* Express.js
* MongoDB
* JWT (Authentication)

## Setup

Install dependencies:

```
npm install
```

Run the server:

```
npm run dev
```

---

## API Base URL

```
http://localhost:5000/api/v1
```

---

## APIs

Authentication:

* POST /auth/register
* POST /auth/login

Transactions:

* GET /transactions
* POST /transactions (admin only)
* GET /transactions/summary

---

## Roles

viewer

* Can only read data

analyst

* Can read data and view summaries

admin

* Full access (create, read, manage)

---

## Author

Vikas Gupta

