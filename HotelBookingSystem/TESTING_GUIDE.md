# Hotel Booking System - Complete Testing Guide

## 🚀 Services Overview

| Service | Port | URL | Status |
|---------|------|-----|--------|
| API Gateway | 5000/5001 | http://localhost:5000 | ✅ Ready |
| Booking Service | 5002/5003 | http://localhost:5002 | ✅ Ready |
| Analytics Service | 5004/5005 | http://localhost:5004 | ✅ Ready |

## 🏗️ Setup Instructions

### 1. Database Setup
1. Connect to Azure SQL Server: `hotel-booking-server.database.windows.net`
2. Create database: `hotel-booking-db`
3. Run the script: `scripts/complete-database-setup.sql`

### 2. Start Services
```bash
# Terminal 1 - Booking Service
cd src\Services\HotelBooking.BookingService
dotnet run

# Terminal 2 - Analytics Service  
cd src\Services\HotelBooking.AnalyticsService
dotnet run

# Terminal 3 - API Gateway
cd src\ApiGateway\HotelBooking.ApiGateway
dotnet run
```

## 🔐 Authentication Flow

### Step 1: Get JWT Token
**POST** `http://localhost:5000/api/auth/verify-google-token`
```json
{
  "email": "test@example.com",
  "name": "Test User",
  "googleId": "123456789",
  "googleToken": "google-access-token"
}
```

**Response:**
```json
{
  "Token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "User": {
    "Email": "test@example.com",
    "Name": "Test User",
    "GoogleId": "123456789"
  }
}
```

### Step 2: Use JWT Token
Add to headers: `Authorization: Bearer YOUR_JWT_TOKEN`

## 📋 Endpoint Testing Checklist

### ✅ Direct Service Testing (No Auth Required)

#### Booking Service - Customers
- [ ] **GET** `http://localhost:5002/api/customers` - Get all customers
- [ ] **POST** `http://localhost:5002/api/customers` - Create customer
- [ ] **GET** `http://localhost:5002/api/customers/{id}` - Get customer by ID

#### Booking Service - Rooms  
- [ ] **GET** `http://localhost:5002/api/rooms` - Get all rooms
- [ ] **GET** `http://localhost:5002/api/rooms/active` - Get active rooms
- [ ] **GET** `http://localhost:5002/api/rooms/availability?checkInDate=2024-03-15&checkOutDate=2024-03-18&numberOfGuests=2`
- [ ] **POST** `http://localhost:5002/api/rooms` - Create room

#### Booking Service - Bookings
- [ ] **GET** `http://localhost:5002/api/bookings` - Get all bookings
- [ ] **POST** `http://localhost:5002/api/bookings` - Create booking

#### Analytics Service
- [ ] **GET** `http://localhost:5004/api/reports/weekly?startDate=2024-03-01&endDate=2024-03-07`
- [ ] **GET** `http://localhost:5004/api/predictions/pricing?roomType=Standard&checkInDate=2024-03-15&numberOfNights=3`

### 🔒 API Gateway Testing (With Authentication)

#### Authentication Endpoints
- [ ] **GET** `http://localhost:5000/api/auth/google-login` - Google OAuth redirect
- [ ] **POST** `http://localhost:5000/api/auth/verify-google-token` - Get JWT token
- [ ] **GET** `http://localhost:5000/api/auth/user-info` - Get user info (requires auth)
- [ ] **POST** `http://localhost:5000/api/auth/refresh-token` - Refresh token (requires auth)

#### Protected Routes (Require JWT Token)
- [ ] **GET** `http://localhost:5000/api/customers` - Get customers via gateway
- [ ] **POST** `http://localhost:5000/api/customers` - Create customer via gateway
- [ ] **GET** `http://localhost:5000/api/bookings` - Get bookings via gateway
- [ ] **POST** `http://localhost:5000/api/bookings` - Create booking via gateway
- [ ] **GET** `http://localhost:5000/api/reports/weekly?startDate=2024-03-01&endDate=2024-03-07`

#### Public Routes (No Auth Required)
- [ ] **GET** `http://localhost:5000/api/rooms` - Get rooms via gateway
- [ ] **GET** `http://localhost:5000/api/rooms/availability?checkInDate=2024-03-15&checkOutDate=2024-03-18&numberOfGuests=2`

## 📊 Health Checks
- [ ] **GET** `http://localhost:5000/health` - API Gateway health
- [ ] **GET** `http://localhost:5002/health` - Booking Service health  
- [ ] **GET** `http://localhost:5004/health` - Analytics Service health

## 📮 Postman Collections

### Import Collections:
1. `Hotel-Booking-Complete-API-Collection.postman_collection.json` - **NEW Complete Collection**
2. `Hotel-Booking-Environment.postman_environment.json` - Environment variables

### Key Features:
- **Auto JWT Token Management** - Automatically saves and uses JWT tokens
- **Complete Authentication Flow** - Google OAuth simulation
- **Both Gateway and Direct Access** - Compare responses
- **Organized by Service** - Easy navigation
- **Health Checks** - Monitor service status

## 🧪 Sample Test Data

### Customer Creation:
```json
{
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "address": "123 Main Street, City, State"
}
```

### Room Creation:
```json
{
  "roomNumber": "501",
  "roomType": "Premium Suite",
  "maxOccupancy": 4,
  "pricePerNight": 300.00,
  "description": "Luxury premium suite with ocean view",
  "amenities": "[\"WiFi\", \"Air Conditioning\", \"TV\", \"Ocean View\", \"Mini Bar\", \"Jacuzzi\"]",
  "isActive": true
}
```

### Booking Creation:
```json
{
  "customerId": "CUSTOMER_GUID_FROM_PREVIOUS_RESPONSE",
  "roomId": "ROOM_GUID_FROM_PREVIOUS_RESPONSE", 
  "checkInDate": "2024-03-15",
  "checkOutDate": "2024-03-18",
  "numberOfGuests": 2,
  "isRecurring": false
}
```

## 🔍 Troubleshooting

### Common Issues:
1. **404 Errors**: Check if services are running on correct ports
2. **Database Connection**: Verify Azure SQL connection string and firewall rules
3. **Authentication**: Make sure JWT token is valid and properly formatted
4. **CORS Issues**: Check if CORS is properly configured

### Expected Response Codes:
- **200 OK**: Successful GET requests
- **201 Created**: Successful POST requests  
- **401 Unauthorized**: Missing or invalid JWT token
- **400 Bad Request**: Invalid request data
- **404 Not Found**: Resource not found

## 🎯 Success Criteria

All checkboxes above should be ✅ when testing is complete. The system demonstrates:
- ✅ **Microservices Architecture** - Independent, scalable services
- ✅ **API Gateway Pattern** - Centralized entry point
- ✅ **Authentication & Authorization** - JWT-based security
- ✅ **Database Integration** - Azure SQL with Entity Framework
- ✅ **Comprehensive API Coverage** - CRUD operations for all entities
- ✅ **Analytics & Reporting** - Business intelligence features
- ✅ **Health Monitoring** - Service status endpoints
