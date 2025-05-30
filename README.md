# Subscription Microservice

A Node.js microservice for SaaS user subscription management, following modern best practices.

---

## Features

- User can subscribe, retrieve, update, and cancel subscriptions (JWT-protected)
- Subscription plans with name, price, features, and duration
- Status: ACTIVE, CANCELLED, EXPIRED (auto-expires after duration)
- Input validation & error handling
- RESTful API conventions

---

## Tech Stack

- **Backend:** Node.js (Express)
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT
- **Validation:** express-validator

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repo-url>
cd <repo-folder>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root with:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/subscriptions
JWT_SECRET=your_jwt_secret
```

### 4. Start the server

```bash
npm start
```

---

## API Endpoints

### **Auth**

> _You must include a JWT token in `Authorization: Bearer <token>` header for all endpoints below._

---

### **Subscription Plans**

- `GET /plans`  
  Get all available plans.

### **User Subscriptions**

- `POST /subscriptions`  
  Create a subscription  
  Request body: `{ "planId": "<plan id>" }`

- `GET /subscriptions/:userId`  
  Get user's current subscription

- `PUT /subscriptions/:userId`  
  Update user's subscription plan  
  Request body: `{ "planId": "<plan id>" }`

- `DELETE /subscriptions/:userId`  
  Cancel user's subscription

---

## Models

### **Plan**

| Field    | Type     | Description            |
|----------|----------|------------------------|
| name     | String   | Plan name              |
| price    | Number   | Price in currency unit |
| features | [String] | Array of features      |
| duration | Number   | Duration in days       |

### **Subscription**

| Field    | Type   | Description                  |
|----------|--------|------------------------------|
| userId   | String | User ID (from JWT)           |
| planId   | String | Reference to Plan            |
| status   | String | ACTIVE, CANCELLED, EXPIRED   |
| startDate| Date   | Subscription start date      |
| endDate  | Date   | Calculated from duration     |

---

## Error Handling

- Returns standard HTTP status codes and error messages.
- Input validation errors return 400 with details.

---

## License

MIT