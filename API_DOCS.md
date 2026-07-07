# API Documentation - Mini ERP Backend

Base URL: `https://mini-erp-backend-c922.onrender.com/api/v1`

All protected routes require a header:
```
Authorization: Bearer <access_token>
```

All responses follow this structure:
```json
{
  "success": true | false,
  "message": "string",
  "data": {},
  "meta": {}
}
```

---

## Auth

### Login
`POST /auth/login`

**Access:** Public

**Body:**
```json
{
  "email": "bayazidhassan776@gmail.com",
  "password": "12345678"
}
```

Available test accounts:
- **Admin:** `bayazidhassan776@gmail.com` / `12345678`
- **Manager:** `bayazidhassan777@gmail.com` / `12345678`
- **Employee:** `bayazidhassan778@gmail.com` / `12345678`

**Response:**
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "safeUser": { "_id": "", "name": "", "email": "", "role": "" },
    "accessToken": ""
  }
}
```

---

## Products

### Get Products
`GET /products?search=&page=1&limit=10`

**Access:** Admin, Manager, Employee

**Response:** paginated product list with `meta` (total, page, limit, totalPages)

### Create Product
`POST /products`

**Access:** Admin, Manager

**Body:** `multipart/form-data`
- `name`, `sku`, `category`, `purchasePrice`, `sellingPrice`, `stockQuantity` (text fields)
- `image` (file, required)

### Update Product
`PATCH /products/:id`

**Access:** Admin, Manager

**Body:** `multipart/form-data` (same fields as create; `image` optional)

### Delete Product
`DELETE /products/:id`

**Access:** Admin, Manager

---

## Sales

### Create Sale
`POST /sales`

**Access:** Admin, Manager, Employee

**Body:**
```json
{
  "products": [
    { "product": "productId", "quantity": 2 }
  ]
}
```

**Response:** created sale with calculated `priceAtSale` per product and `grandTotal`

**Business rules:**
- Rejects duplicate product IDs in one sale
- Rejects if requested quantity exceeds available stock
- Automatically deducts stock (MongoDB transaction — rolls back on any failure)
- Emits a `lowStock` Socket.io event for any product that drops below 5 units in stock

---

## Users

### Create User
`POST /users`

**Access:** Admin only

**Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "yourpassword",
  "role": "manager"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully.",
  "data": {
    "_id": "",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "manager"
  }
}
```

`role` must be one of: `admin`, `manager`, `employee`

---

## Dashboard

### Get Dashboard Stats
`GET /dashboard`

**Access:** Any authenticated user

**Response:**
```json
{
  "success": true,
  "message": "Dashboard statistics retrieved successfully.",
  "data": {
    "totalProducts": 0,
    "totalSales": 0,
    "lowStockProducts": []
  }
}
```
(`lowStockProducts` returns products where `stockQuantity < 5`)

---

## Real-time Events (Socket.io)

The backend also runs a Socket.io server on the same port as the REST API.

**Connection URL:** same as the base API host, without the `/api/v1` path (e.g. `https://mini-erp-backend-c922.onrender.com`)

### Event: `lowStock`

Emitted automatically whenever a sale reduces a product's stock quantity below 5 units.

**Payload:**
```json
{
  "productId": "",
  "name": "",
  "stockQuantity": 0
}
```

Clients can listen for this event to trigger real-time UI updates (e.g. refreshing dashboard statistics) without polling.
