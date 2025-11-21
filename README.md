# .ENV

**Добавить в  `.env` переменные:**

```env
EXCHANGE_RATE_API_URL=https://v6.exchangerate-api.com/v6
EXCHANGE_RATE_API_KEY=
CURRENCY_CACHE_TTL=3600
```


## Примеры использования


### ✅**Request:** `GET /store/currency/convert?amount=10&from=EUR&to=USD`

**Response:**
```json
{
    "success": true,
    "data": {
        "amount": 10,
        "from": "EUR",
        "to": "USD",
        "rate": 1.1531,
        "result": 11.531,
        "timestamp": "2025-11-21T18:25:05.499Z"
    }
}
```

### ✅**Request:** `GET /store/currency/convert?amount=10&from=EUR&to=USD`

**Response:**
```json
{
  "success": true,
  "data": {
    "amount": 10,
    "from": "EUR",
    "to": "USD",
    "rate": 1.1531,
    "result": 11.531,
    "timestamp": "2025-11-21T18:25:05.499Z"
  }
}
```

### ❌**Request:** `GET /store/currency/convert?amount=10&from=EUR&to=AAA`

**Response:**
```json
{
  "success": false,
  "error": "Invalid currency code: EUR or AAA"
}
```

### ❌**Request:** `GET /store/currency/convert?amount=0&from=EUR&to=USD`

**Response:**
```json
{
  "success": false,
  "error": "Validation error",
  "details": [
    "Amount must be a positive number"
  ]
}
```

### ❌**Request:** `GET /store/currency/convert?amount=10&from=EUR&to=USDa`

**Response:**
```json
{
  "success": false,
  "error": "Validation error",
  "details": [
    "To currency must be a valid 3-letter currency code"
  ]
}
```

### ❌ Импровизированная ошибка при запросе к API курсов

**Response:**
```json
{
  "success": false,
  "error": "Failed to fetch exchange rates for EUR and no cached data available"
}
```