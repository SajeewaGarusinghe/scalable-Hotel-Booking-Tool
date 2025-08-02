# Deployment Guide for Hotel Booking System

## Overview
This document provides a comprehensive guide for deploying the Hotel Booking System, which is built using a microservices architecture. The deployment process involves setting up the necessary infrastructure, configuring services, and ensuring that all components work seamlessly together.

## Prerequisites
Before deploying the application, ensure that the following prerequisites are met:

1. **Server Requirements**:
   - Windows Server or Linux Server (Ubuntu preferred)
   - .NET 8.0 SDK installed
   - SQL Server (LocalDB for development, Azure SQL for production)

2. **Tools**:
   - Docker (optional, for containerization)
   - Git for version control
   - Postman for API testing

## Deployment Steps

### Step 1: Clone the Repository
Clone the project repository from GitHub to your local machine or server.

```bash
git clone https://github.com/yourusername/HotelBookingSystem.git
cd HotelBookingSystem
```

### Step 2: Set Up the Database
1. **Create the Database**:
   Execute the `database-setup.sql` script to create the database and necessary schemas.

```sql
-- Run the following SQL script
CREATE DATABASE HotelBookingSystem;

USE HotelBookingSystem;

CREATE SCHEMA booking;
CREATE SCHEMA analytics;
```

2. **Run Migrations**:
   If using Entity Framework, run the migrations to set up the database schema.

```bash
cd src/Infrastructure/HotelBooking.Data
dotnet ef database update
```

### Step 3: Configure Application Settings
1. **Update Configuration Files**:
   Modify the `appsettings.json` files in each service to include the correct connection strings and any other environment-specific settings.

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=your_server;Database=HotelBookingSystem;User Id=your_user;Password=your_password;"
  }
}
```

2. **Set Environment Variables**:
   Set any necessary environment variables for sensitive information such as JWT secret keys and API keys.

### Step 4: Build the Application
Build the solution to ensure all components are compiled correctly.

```bash
dotnet build HotelBookingSystem.sln
```

### Step 5: Run the Services
1. **Run Each Service**:
   Start each microservice individually or configure them to run together using Docker Compose.

```bash
cd src/ApiGateway/HotelBooking.ApiGateway
dotnet run

cd ../HotelBooking.BookingService
dotnet run

cd ../HotelBooking.AnalyticsService
dotnet run
```

2. **Using Docker** (optional):
   If using Docker, create a `Dockerfile` for each service and a `docker-compose.yml` file to orchestrate the services.

### Step 6: Test the Deployment
Use Postman or any API testing tool to verify that the services are running correctly and can communicate with each other.

- Test the API Gateway endpoints.
- Verify that the Booking and Analytics services are functioning as expected.

### Step 7: Monitor and Maintain
1. **Logging**:
   Implement logging using Serilog or any other logging framework to monitor application performance and errors.

2. **Health Checks**:
   Set up health checks for each service to ensure they are running and accessible.

3. **Scaling**:
   Depending on the load, consider scaling the services horizontally by deploying multiple instances.

## Conclusion
Following this deployment guide will help you set up the Hotel Booking System in a production environment. Ensure to monitor the application and make adjustments as necessary to maintain performance and reliability.