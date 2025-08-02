# Hotel Booking System - Deployment Guide

## Prerequisites

- .NET 8.0 SDK
- Visual Studio 2022
- SQL Server Management Studio (SSMS)
- Azure SQL Database access
- Postman (for API testing)

## Database Setup

### Connection Details
- **Server**: hotel-booking-server.database.windows.net
- **Database**: HotelBookingSystem
- **Username**: dbadmin
- **Password**: HotelBooking1234

### Create Database Schema

Connect to Azure SQL Database using SSMS and run the following scripts:

```sql
-- Create schemas
USE HotelBookingSystem;
GO

CREATE SCHEMA booking;
GO

CREATE SCHEMA analytics;
GO

-- Create booking schema tables
CREATE TABLE booking.Customers (
    CustomerId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    GoogleId NVARCHAR(100),
    Email NVARCHAR(100) NOT NULL UNIQUE,
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    PhoneNumber NVARCHAR(20),
    Address NVARCHAR(200),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE()
);

CREATE TABLE booking.Rooms (
    RoomId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    RoomNumber NVARCHAR(10) NOT NULL UNIQUE,
    RoomType NVARCHAR(50) NOT NULL,
    MaxOccupancy INT NOT NULL,
    PricePerNight DECIMAL(10,2) NOT NULL,
    Description NVARCHAR(500),
    Amenities NVARCHAR(MAX),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE()
);

CREATE TABLE booking.Bookings (
    BookingId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    CustomerId UNIQUEIDENTIFIER NOT NULL,
    RoomId UNIQUEIDENTIFIER NOT NULL,
    CheckInDate DATE NOT NULL,
    CheckOutDate DATE NOT NULL,
    NumberOfGuests INT NOT NULL,
    TotalAmount DECIMAL(10,2) NOT NULL,
    BookingStatus NVARCHAR(20) DEFAULT 'Confirmed',
    IsRecurring BIT DEFAULT 0,
    RecurrencePattern NVARCHAR(100),
    BookingReference NVARCHAR(20) UNIQUE,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (CustomerId) REFERENCES booking.Customers(CustomerId),
    FOREIGN KEY (RoomId) REFERENCES booking.Rooms(RoomId)
);

CREATE TABLE booking.SpecialRequests (
    RequestId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    BookingId UNIQUEIDENTIFIER NOT NULL,
    RequestType NVARCHAR(50) NOT NULL,
    Description NVARCHAR(500),
    Status NVARCHAR(20) DEFAULT 'Pending',
    RequestDate DATETIME2 DEFAULT GETUTCDATE(),
    FulfilledDate DATETIME2,
    FOREIGN KEY (BookingId) REFERENCES booking.Bookings(BookingId)
);

-- Create analytics schema tables
CREATE TABLE analytics.BookingAnalytics (
    AnalyticsId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    BookingId UNIQUEIDENTIFIER NOT NULL,
    BookingDate DATE NOT NULL,
    CheckInDate DATE NOT NULL,
    CheckOutDate DATE NOT NULL,
    RoomType NVARCHAR(50) NOT NULL,
    TotalAmount DECIMAL(10,2) NOT NULL,
    NumberOfNights INT NOT NULL,
    SeasonalFactor DECIMAL(5,2),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

CREATE TABLE analytics.Reports (
    ReportId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    ReportType NVARCHAR(50) NOT NULL,
    ReportPeriodStart DATE NOT NULL,
    ReportPeriodEnd DATE NOT NULL,
    ReportData NVARCHAR(MAX),
    GeneratedAt DATETIME2 DEFAULT GETUTCDATE(),
    GeneratedBy NVARCHAR(100)
);
```

### Insert Sample Data

```sql
-- Insert sample customers
INSERT INTO booking.Customers (Email, FirstName, LastName, PhoneNumber, Address) VALUES
('john.doe@example.com', 'John', 'Doe', '+1234567890', '123 Main St, City, State 12345'),
('jane.smith@example.com', 'Jane', 'Smith', '+9876543210', '456 Oak Ave, City, State 67890');

-- Insert sample rooms
INSERT INTO booking.Rooms (RoomNumber, RoomType, MaxOccupancy, PricePerNight, Description, Amenities) VALUES
('101', 'Standard', 2, 100.00, 'Comfortable standard room', '["WiFi", "Air Conditioning", "TV"]'),
('102', 'Standard', 2, 100.00, 'Comfortable standard room', '["WiFi", "Air Conditioning", "TV"]'),
('201', 'Deluxe', 4, 150.00, 'Spacious deluxe room with balcony', '["WiFi", "Air Conditioning", "TV", "Balcony", "Mini Bar"]'),
('301', 'Suite', 6, 250.00, 'Luxury suite with city view', '["WiFi", "Air Conditioning", "TV", "Balcony", "Mini Bar", "Jacuzzi"]');
```

## Build and Run Services

### 1. Navigate to Solution Directory
```bash
cd HotelBookingSystem
```

### 2. Restore NuGet Packages
```bash
dotnet restore
```

### 3. Build the Solution
```bash
dotnet build
```

### 4. Run Services

#### Start Booking Service
```bash
cd src/Services/HotelBooking.BookingService
dotnet run
```
Service will be available at: https://localhost:5003

#### Start Analytics Service (in new terminal)
```bash
cd src/Services/HotelBooking.AnalyticsService
dotnet run
```
Service will be available at: https://localhost:5005

## Testing with Postman

### 1. Import Collection and Environment
1. Open Postman
2. Import `Hotel-Booking-API-Collection.postman_collection.json`
3. Import `Hotel-Booking-Environment.postman_environment.json`
4. Select the "Hotel Booking Environment" environment

### 2. Test Workflow

#### Step 1: Create a Customer
```
POST {{booking_service_url}}/api/customers
```

#### Step 2: Create a Room
```
POST {{booking_service_url}}/api/rooms
```

#### Step 3: Check Room Availability
```
GET {{booking_service_url}}/api/rooms/availability?checkInDate=2024-03-15&checkOutDate=2024-03-18&numberOfGuests=2
```

#### Step 4: Create a Booking
```
POST {{booking_service_url}}/api/bookings
```

#### Step 5: Add Special Request
```
POST {{booking_service_url}}/api/special-requests/booking/{{booking_id}}
```

#### Step 6: Generate Reports
```
GET {{analytics_service_url}}/api/reports/weekly?startDate=2024-03-01&endDate=2024-03-07
```

## API Endpoints Summary

### Booking Service (Port 5003)

#### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/active` - Get active rooms
- `GET /api/rooms/by-type/{roomType}` - Get rooms by type
- `GET /api/rooms/{roomId}` - Get room by ID
- `GET /api/rooms/availability` - Check room availability
- `POST /api/rooms` - Create room
- `PUT /api/rooms/{roomId}` - Update room
- `DELETE /api/rooms/{roomId}` - Delete room

#### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/{customerId}` - Get customer by ID
- `GET /api/customers/by-email/{email}` - Get customer by email
- `POST /api/customers` - Create customer
- `PUT /api/customers/{customerId}` - Update customer
- `DELETE /api/customers/{customerId}` - Delete customer

#### Bookings
- `GET /api/bookings` - Get all bookings (with pagination and filtering)
- `GET /api/bookings/{bookingId}` - Get booking by ID
- `GET /api/bookings/customer/{customerId}` - Get bookings by customer
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/{bookingId}` - Update booking
- `DELETE /api/bookings/{bookingId}` - Cancel booking

#### Special Requests
- `GET /api/special-requests/booking/{bookingId}` - Get requests by booking
- `GET /api/special-requests/pending` - Get pending requests
- `GET /api/special-requests/{requestId}` - Get request by ID
- `POST /api/special-requests/booking/{bookingId}` - Create special request
- `PUT /api/special-requests/{requestId}/status` - Update request status
- `DELETE /api/special-requests/{requestId}` - Delete special request

### Analytics Service (Port 5005)

#### Reports
- `GET /api/reports/weekly` - Weekly booking report
- `GET /api/reports/monthly` - Monthly analytics
- `GET /api/reports/occupancy` - Occupancy report
- `GET /api/reports/revenue` - Revenue report
- `POST /api/reports/custom` - Generate custom report

#### Predictions
- `GET /api/predictions/pricing` - Price predictions
- `GET /api/predictions/availability` - Availability forecast
- `GET /api/predictions/demand` - Demand forecast

### Health Checks
- `GET /health` - Service health status

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify Azure SQL Database credentials
   - Check if database exists and schemas are created
   - Ensure firewall rules allow connections

2. **Port Already in Use**
   - Check if services are already running
   - Use different ports in launchSettings.json if needed

3. **Migration Errors**
   - Ensure Entity Framework tools are installed: `dotnet tool install --global dotnet-ef`
   - Run migrations: `dotnet ef database update --startup-project [StartupProject]`

4. **CORS Issues**
   - Verify CORS policy in Startup.cs
   - Check if frontend URL is allowed

### Logs
Check application logs in:
- Console output when running `dotnet run`
- Event Viewer (Windows)
- Application Insights (if configured)

## Production Deployment

For production deployment:

1. **Update Connection Strings** for production database
2. **Configure HTTPS** certificates
3. **Set up Load Balancer** for multiple instances
4. **Configure Logging** (Application Insights, Serilog)
5. **Set up Monitoring** and health checks
6. **Configure CI/CD** pipelines
7. **Security Hardening** (remove development settings)

## Support

For technical support:
- Check the implementation details document
- Review API documentation in Swagger UI
- Test individual endpoints using Postman collection