# Mini ERP - Backend API

Inventory & Sales Management System backend built for the MERN Stack Technical Assessment.

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary (image uploads)
- Multer

## Features

- JWT-based authentication with role-based authorization (Admin, Manager, Employee)
- Product CRUD with image upload, search, and pagination
- Sales creation with automatic stock deduction, insufficient-stock prevention, and grand total calculation (MongoDB transactions)
- Dashboard statistics API (total products, total sales, low stock products)
- Generic reusable Query Builder (search, filter, sort, pagination)
- Global error handler with consistent API response structure
- Modular feature-based architecture

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB replica set, required for transactions)
- Cloudinary account

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/bayazidhassan/Mini_ERP_Backend.git
   cd Mini_ERP_Backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   ACCESS_TOKEN=your_jwt_secret
   BCRYPT_SALT=10
   ADMIN_EMAIL=bayazidhassan776@gmail.com
   ADMIN_PASSWORD=12345678
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. Run in development mode:
   ```
   npm run start:dev
   ```

5. Build and run in production:
   ```
   npm run build
   npm start
   ```

The admin user is automatically seeded on server start using `ADMIN_EMAIL` and `ADMIN_PASSWORD` from your `.env` file (only created if it doesn't already exist).

## Live API

Base URL: `https://mini-erp-backend-c922.onrender.com/api/v1`

## API Documentation

See [API_DOCS.md](./API_DOCS.md) for full endpoint documentation.

## Admin Login Credentials

- Email: `bayazidhassan776@gmail.com`
- Password: `12345678`
