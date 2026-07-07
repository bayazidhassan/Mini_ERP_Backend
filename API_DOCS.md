# API Documentation - Mini ERP Backend

Base URL: `https://mini-erp-backend-c922.onrender.com/api/v1`

All protected routes require a header:
```
Authorization: Bearer <access_token>
```

All responses follow this structure:
```json
{
  "success": true,
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
