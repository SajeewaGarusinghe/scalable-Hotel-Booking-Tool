# Backend Implementation Details - Enterprise Hotel Booking System

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Microservices Design](#microservices-design)
3. [Database Schema Design](#database-schema-design)
4. [API Specifications](#api-specifications)
5. [Security Implementation](#security-implementation)
6. [Technology Stack](#technology-stack)
7. [Project Setup Instructions](#project-setup-instructions)
8. [Development Guidelines](#development-guidelines)

## Architecture Overview

### System Architecture
The Enterprise Hotel Booking System follows a microservices architecture pattern, decomposed from the original monolithic application. The system is designed to handle enterprise-level load with horizontal scaling capabilities.

### Core Principles
- **Loose Coupling**: Services communicate through well-defined APIs
- **Service Independence**: Each service can be developed, deployed, and scaled independently
- **Fault Tolerance**: Services handle failures gracefully
- **Single Responsibility**: Each service has a specific business domain

### High-Level Architecture Components
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │    │  Mobile Client  │    │  Admin Portal   │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────┴─────────────┐
                    │      API Gateway          │
                    │   (ASP.NET Core)          │
                    └─────────────┬─────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
┌───────▼───────┐    ┌────────────▼────────────┐   ┌────────▼────────┐
│ Booking & Room │    │   Analytics & Reports  │   │  Notification   │
│   Service      │    │      Service           │   │    Service      │
│ (ASP.NET Core) │    │   (ASP.NET Core)       │   │ (ASP.NET Core)  │
└───────┬───────┘    └────────────┬────────────┘   └────────┬────────┘
        │                         │                         │
        └─────────────────────────┼─────────────────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │    Shared Database        │
                    │   (SQL Server)            │
                    └───────────────────────────┘
```

## Microservices Design

### 1. API Gateway Service
**Purpose**: Central entry point for all client requests, routing, authentication, and cross-cutting concerns.

**Responsibilities**:
- Request routing to appropriate microservices
- Authentication and authorization (Google OAuth)
- Rate limiting and throttling
- Request/response logging
- CORS handling
- API versioning

**Technology**: ASP.NET Core Web API
**Port**: 5000 (HTTP), 5001 (HTTPS)

### 2. Booking & Room Service
**Purpose**: Core business logic for booking and room management operations.

**Responsibilities**:
- Booking CRUD operations (Create, Read, Update, Delete)
- Room inventory management
- Room availability checking
- Booking validation and business rules
- Special requests linked to bookings

**Technology**: ASP.NET Core Web API
**Port**: 5002 (HTTP), 5003 (HTTPS)

**Key Features**:
- One-off and recurring bookings support
- Real-time availability checking
- Room type categorization
- Conflict detection and resolution

### 3. Analytics & Reports Service
**Purpose**: Handle reporting, analytics, and predictive capabilities including chatbot functionality.

**Responsibilities**:
- Generate weekly booking reports
- Historical booking analysis
- Availability and pricing trend predictions
- Chatbot for availability/pricing queries
- Business intelligence dashboards
- Performance metrics

**Technology**: ASP.NET Core Web API + ML.NET for predictions
**Port**: 5004 (HTTP), 5005 (HTTPS)

**Key Features**:
- Machine learning models for price prediction
- Historical data analysis
- Real-time analytics
- Chatbot natural language processing

### 4. Notification Service (Optional Enhancement)
**Purpose**: Handle all communication and notifications.

**Responsibilities**:
- Email notifications
- SMS notifications
- In-app notifications
- Booking confirmations
- Reminder notifications

**Technology**: ASP.NET Core Web API
**Port**: 5006 (HTTP), 5007 (HTTPS)

## Database Schema Design

### Shared Database with Service Boundaries
Using a shared SQL Server database with proper schema separation for each microservice.

### Database Schema Structure

#### Booking Service Schema (`booking` schema)
```sql
-- Rooms Table
CREATE TABLE booking.Rooms (
    RoomId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    RoomNumber NVARCHAR(10) NOT NULL UNIQUE,
    RoomType NVARCHAR(50) NOT NULL,
    MaxOccupancy INT NOT NULL,
    PricePerNight DECIMAL(10,2) NOT NULL,
    Description NVARCHAR(500),
    Amenities NVARCHAR(MAX), -- JSON format
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- Room Types Table
CREATE TABLE booking.RoomTypes (
    RoomTypeId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    TypeName NVARCHAR(50) NOT NULL UNIQUE,
    Description NVARCHAR(500),
    BasePrice DECIMAL(10,2) NOT NULL,
    MaxOccupancy INT NOT NULL
);

-- Bookings Table
CREATE TABLE booking.Bookings (
    BookingId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    CustomerId UNIQUEIDENTIFIER NOT NULL,
    RoomId UNIQUEIDENTIFIER NOT NULL,
    CheckInDate DATE NOT NULL,
    CheckOutDate DATE NOT NULL,
    NumberOfGuests INT NOT NULL,
    TotalAmount DECIMAL(10,2) NOT NULL,
    BookingStatus NVARCHAR(20) DEFAULT 'Confirmed', -- Confirmed, Cancelled, CheckedIn, CheckedOut
    IsRecurring BIT DEFAULT 0,
    RecurrencePattern NVARCHAR(100), -- Weekly, Monthly, etc.
    BookingReference NVARCHAR(20) UNIQUE,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (RoomId) REFERENCES booking.Rooms(RoomId)
);

-- Special Requests Table
CREATE TABLE booking.SpecialRequests (
    RequestId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    BookingId UNIQUEIDENTIFIER NOT NULL,
    RequestType NVARCHAR(50) NOT NULL, -- Extra Bed, Late Checkout, Early Checkin, etc.
    Description NVARCHAR(500),
    Status NVARCHAR(20) DEFAULT 'Pending', -- Pending, Approved, Denied, Fulfilled
    RequestDate DATETIME2 DEFAULT GETUTCDATE(),
    FulfilledDate DATETIME2,
    FOREIGN KEY (BookingId) REFERENCES booking.Bookings(BookingId)
);

-- Customers Table
CREATE TABLE booking.Customers (
    CustomerId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    GoogleId NVARCHAR(100) UNIQUE,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    PhoneNumber NVARCHAR(20),
    Address NVARCHAR(200),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE()
);
```

#### Analytics Service Schema (`analytics` schema)
```sql
-- Booking Analytics Table
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

-- Price Predictions Table
CREATE TABLE analytics.PricePredictions (
    PredictionId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    RoomType NVARCHAR(50) NOT NULL,
    PredictionDate DATE NOT NULL,
    PredictedPrice DECIMAL(10,2) NOT NULL,
    ConfidenceLevel DECIMAL(5,2),
    ModelVersion NVARCHAR(20),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- Reports Table
CREATE TABLE analytics.Reports (
    ReportId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    ReportType NVARCHAR(50) NOT NULL, -- Weekly, Monthly, Yearly
    ReportPeriodStart DATE NOT NULL,
    ReportPeriodEnd DATE NOT NULL,
    ReportData NVARCHAR(MAX), -- JSON format
    GeneratedAt DATETIME2 DEFAULT GETUTCDATE(),
    GeneratedBy NVARCHAR(100)
);

-- Chatbot Interactions Table
CREATE TABLE analytics.ChatbotInteractions (
    InteractionId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    CustomerId UNIQUEIDENTIFIER,
    Query NVARCHAR(500) NOT NULL,
    Response NVARCHAR(MAX) NOT NULL,
    QueryType NVARCHAR(50), -- Availability, Pricing, Booking
    Timestamp DATETIME2 DEFAULT GETUTCDATE()
);
```

## API Specifications

### API Gateway Endpoints

#### Authentication
```
POST /api/auth/google-login
POST /api/auth/refresh-token
POST /api/auth/logout
```

#### Route Configuration
```
/api/bookings/* → Booking Service
/api/rooms/* → Booking Service
/api/analytics/* → Analytics Service
/api/reports/* → Analytics Service
/api/chatbot/* → Analytics Service
```

### Booking & Room Service API

#### Booking Endpoints
```http
# Get all bookings with pagination
GET /api/bookings?page=1&pageSize=10&status=confirmed

# Get booking by ID
GET /api/bookings/{bookingId}

# Create new booking
POST /api/bookings
Content-Type: application/json
{
    "customerId": "uuid",
    "roomId": "uuid",
    "checkInDate": "2024-03-15",
    "checkOutDate": "2024-03-18",
    "numberOfGuests": 2,
    "specialRequests": [
        {
            "requestType": "Late Checkout",
            "description": "Need to checkout at 2 PM"
        }
    ]
}

# Update booking
PUT /api/bookings/{bookingId}

# Cancel booking
DELETE /api/bookings/{bookingId}

# Check room availability
GET /api/bookings/availability?checkIn=2024-03-15&checkOut=2024-03-18&guests=2
```

#### Room Management Endpoints
```http
# Get all rooms
GET /api/rooms?roomType=deluxe&available=true

# Get room by ID
GET /api/rooms/{roomId}

# Create new room
POST /api/rooms
Content-Type: application/json
{
    "roomNumber": "201",
    "roomType": "Deluxe",
    "maxOccupancy": 4,
    "pricePerNight": 150.00,
    "description": "Spacious deluxe room with city view",
    "amenities": ["WiFi", "Air Conditioning", "Mini Bar", "Balcony"]
}

# Update room
PUT /api/rooms/{roomId}

# Delete room
DELETE /api/rooms/{roomId}
```

#### Special Requests Endpoints
```http
# Get requests for a booking
GET /api/bookings/{bookingId}/requests

# Add special request
POST /api/bookings/{bookingId}/requests

# Update request status
PUT /api/requests/{requestId}
```

### Analytics & Reports Service API

#### Reports Endpoints
```http
# Get weekly booking report
GET /api/reports/weekly?startDate=2024-03-01&endDate=2024-03-07

# Get monthly analytics
GET /api/reports/monthly?year=2024&month=3

# Get occupancy report
GET /api/reports/occupancy?roomType=deluxe&period=last30days

# Generate custom report
POST /api/reports/custom
Content-Type: application/json
{
    "reportType": "Revenue Analysis",
    "startDate": "2024-01-01",
    "endDate": "2024-03-31",
    "filters": {
        "roomTypes": ["Standard", "Deluxe"],
        "includeSpecialRequests": true
    }
}
```

#### Predictions Endpoints
```http
# Get price predictions
GET /api/predictions/pricing?roomType=deluxe&startDate=2024-04-01&endDate=2024-04-30

# Get availability forecast
GET /api/predictions/availability?period=next30days

# Get demand forecast
GET /api/predictions/demand?roomType=standard&period=next7days
```

#### Chatbot Endpoints
```http
# Send query to chatbot
POST /api/chatbot/query
Content-Type: application/json
{
    "customerId": "uuid",
    "query": "What are the available rooms for next weekend?",
    "context": {
        "checkInDate": "2024-03-16",
        "checkOutDate": "2024-03-17",
        "guests": 2
    }
}

# Get chatbot interaction history
GET /api/chatbot/history/{customerId}
```

## Security Implementation

### Google OAuth 2.0 Integration

#### Configuration in `appsettings.json`
```json
{
  "GoogleAuth": {
    "ClientId": "your-google-client-id",
    "ClientSecret": "your-google-client-secret",
    "RedirectUri": "https://localhost:5001/api/auth/google-callback"
  },
  "JWT": {
    "SecretKey": "your-secret-key-here",
    "Issuer": "HotelBookingSystem",
    "Audience": "HotelBookingSystem",
    "ExpirationMinutes": 60
  }
}
```

#### JWT Token Implementation
```csharp
// JWT Token Service
public class JwtTokenService
{
    public string GenerateToken(User user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_secretKey);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}")
            }),
            Expires = DateTime.UtcNow.AddMinutes(_expirationMinutes),
            Issuer = _issuer,
            Audience = _audience,
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key), 
                SecurityAlgorithms.HmacSha256Signature)
        };
        
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}
```

### API Security Middleware
```csharp
public class SecurityMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        // Add security headers
        context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
        context.Response.Headers.Add("X-Frame-Options", "DENY");
        context.Response.Headers.Add("X-XSS-Protection", "1; mode=block");
        
        // Rate limiting logic
        var clientIp = context.Connection.RemoteIpAddress?.ToString();
        if (await IsRateLimited(clientIp))
        {
            context.Response.StatusCode = 429;
            return;
        }
        
        await next(context);
    }
}
```

## Technology Stack

### Backend Technologies
- **Framework**: ASP.NET Core 8.0
- **Database**: Microsoft SQL Server (LocalDB for development, Azure SQL for production)
- **ORM**: Entity Framework Core
- **Authentication**: Google OAuth 2.0 + JWT
- **API Documentation**: Swagger/OpenAPI
- **Logging**: Serilog
- **Testing**: xUnit, Moq
- **Containerization**: Docker (optional)

### Development Tools
- **IDE**: Visual Studio 2022
- **Version Control**: Git
- **API Testing**: Postman
- **Database Management**: SQL Server Management Studio (SSMS)

### Packages Required

#### API Gateway
```xml
<PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="8.0.0" />
<PackageReference Include="Microsoft.AspNetCore.Authentication.Google" Version="8.0.0" />
<PackageReference Include="Ocelot" Version="20.0.0" />
<PackageReference Include="Serilog.AspNetCore" Version="8.0.0" />
```

#### Booking Service
```xml
<PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="8.0.0" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="8.0.0" />
<PackageReference Include="AutoMapper.Extensions.Microsoft.DependencyInjection" Version="12.0.0" />
<PackageReference Include="FluentValidation.AspNetCore" Version="11.3.0" />
```

#### Analytics Service
```xml
<PackageReference Include="Microsoft.ML" Version="3.0.0" />
<PackageReference Include="Microsoft.ML.TimeSeries" Version="3.0.0" />
<PackageReference Include="Newtonsoft.Json" Version="13.0.3" />
```

## Project Setup Instructions

### Prerequisites
- Visual Studio 2022 (Community or Professional)
- .NET 8.0 SDK
- SQL Server LocalDB or SQL Server Express
- Node.js 18+ (for React frontend)
- Git

### Step 1: Create Solution Structure

#### 1.1 Create Solution in Visual Studio 2022
1. Open Visual Studio 2022
2. Select "Create a new project"
3. Choose "Blank Solution" template
4. Name: `HotelBookingSystem`
5. Location: Choose your desired location
6. Click "Create"

#### 1.2 Create Project Structure
Add the following projects to the solution:

```
HotelBookingSystem/
├── src/
│   ├── ApiGateway/
│   │   └── HotelBooking.ApiGateway/
│   ├── Services/
│   │   ├── HotelBooking.BookingService/
│   │   └── HotelBooking.AnalyticsService/
│   ├── Shared/
│   │   ├── HotelBooking.Common/
│   │   └── HotelBooking.Models/
│   └── Infrastructure/
│       └── HotelBooking.Data/
├── tests/
│   ├── HotelBooking.BookingService.Tests/
│   └── HotelBooking.AnalyticsService.Tests/
└── docs/
```

### Step 2: Create Individual Projects

#### 2.1 Create API Gateway Project
1. Right-click on solution → Add → New Project
2. Choose "ASP.NET Core Web API" template
3. Name: `HotelBooking.ApiGateway`
4. Location: `src/ApiGateway/`
5. Framework: .NET 8.0
6. Authentication: None (we'll implement custom)
7. Click "Create"

#### 2.2 Create Booking Service Project
1. Right-click on solution → Add → New Project
2. Choose "ASP.NET Core Web API" template
3. Name: `HotelBooking.BookingService`
4. Location: `src/Services/`
5. Framework: .NET 8.0
6. Click "Create"

#### 2.3 Create Analytics Service Project
1. Right-click on solution → Add → New Project
2. Choose "ASP.NET Core Web API" template
3. Name: `HotelBooking.AnalyticsService`
4. Location: `src/Services/`
5. Framework: .NET 8.0
6. Click "Create"

#### 2.4 Create Shared Libraries
1. **Common Library**:
   - Right-click solution → Add → New Project
   - Choose "Class Library (.NET)" template
   - Name: `HotelBooking.Common`
   - Location: `src/Shared/`

2. **Models Library**:
   - Right-click solution → Add → New Project
   - Choose "Class Library (.NET)" template
   - Name: `HotelBooking.Models`
   - Location: `src/Shared/`

3. **Data Library**:
   - Right-click solution → Add → New Project
   - Choose "Class Library (.NET)" template
   - Name: `HotelBooking.Data`
   - Location: `src/Infrastructure/`

### Step 3: Configure Project Dependencies

#### 3.1 Add Project References
- **ApiGateway** should reference: Common, Models
- **BookingService** should reference: Common, Models, Data
- **AnalyticsService** should reference: Common, Models, Data

#### 3.2 Add NuGet Packages
For each project, add the respective packages mentioned in the Technology Stack section.

### Step 4: Database Setup

#### 4.1 Create Database
```sql
-- Create main database
CREATE DATABASE HotelBookingSystem;

-- Create schemas
USE HotelBookingSystem;
GO

CREATE SCHEMA booking;
GO

CREATE SCHEMA analytics;
GO
```

#### 4.2 Configure Connection Strings
Add to each service's `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=HotelBookingSystem;Trusted_Connection=true;MultipleActiveResultSets=true"
  }
}
```

### Step 5: Create React Frontend

#### 5.1 Create React Application
Open Command Prompt or PowerShell and navigate to your solution directory:

```bash
# Navigate to solution root
cd HotelBookingSystem

# Create React app
npx create-react-app hotel-booking-frontend --template typescript
cd hotel-booking-frontend

# Install additional dependencies
npm install @types/react @types/react-dom
npm install axios react-router-dom
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install react-query
npm install formik yup
```

#### 5.2 Frontend Project Structure
```
hotel-booking-frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── booking/
│   │   ├── rooms/
│   │   └── analytics/
│   ├── services/
│   │   ├── api.ts
│   │   ├── bookingService.ts
│   │   └── analyticsService.ts
│   ├── types/
│   ├── utils/
│   ├── contexts/
│   └── pages/
└── package.json
```

### Step 6: Development Environment Setup

#### 6.1 Configure Multiple Startup Projects
1. Right-click solution in Visual Studio
2. Select "Properties"
3. Choose "Multiple startup projects"
4. Set the following projects to "Start":
   - HotelBooking.ApiGateway
   - HotelBooking.BookingService
   - HotelBooking.AnalyticsService

#### 6.2 Configure Port Numbers
Update `launchSettings.json` in each project:

**ApiGateway** - ports 5000/5001
**BookingService** - ports 5002/5003
**AnalyticsService** - ports 5004/5005

### Step 7: Initial Implementation Tasks

#### 7.1 Priority Order
1. **Models and DTOs** (HotelBooking.Models)
2. **Data Layer** (HotelBooking.Data)
3. **Booking Service** (Core CRUD operations)
4. **API Gateway** (Authentication and routing)
5. **Analytics Service** (Reports and predictions)
6. **React Frontend** (UI components)

#### 7.2 Development Workflow
1. Start with database schema creation
2. Implement Entity Framework models
3. Create basic CRUD operations
4. Add authentication middleware
5. Implement business logic
6. Add API documentation
7. Create frontend components
8. Integration testing

## Development Guidelines

### Code Standards
- Follow C# coding conventions
- Use async/await for all I/O operations
- Implement proper error handling and logging
- Use dependency injection
- Write unit tests for business logic

### API Design Principles
- RESTful design patterns
- Consistent error response format
- Proper HTTP status codes
- Comprehensive API documentation
- Input validation and sanitization

### Security Best Practices
- Never store sensitive data in plain text
- Use HTTPS for all communications
- Implement proper CORS policies
- Validate all inputs
- Use parameterized queries
- Implement rate limiting

### Performance Considerations
- Use async/await for I/O operations
- Implement caching where appropriate
- Use pagination for large datasets
- Optimize database queries
- Monitor performance metrics

### Testing Strategy
- Unit tests for business logic
- Integration tests for API endpoints
- End-to-end tests for critical workflows
- Performance testing for scalability
- Security testing for vulnerabilities

---

This implementation plan provides a comprehensive foundation for building the Enterprise Hotel Booking System with microservices architecture. Each service is designed to be independently deployable and scalable while maintaining data consistency and business integrity.
