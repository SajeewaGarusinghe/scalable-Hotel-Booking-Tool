# Hotel Booking System

## Overview
The Hotel Booking System is a microservices-based application designed to facilitate hotel bookings, room management, and analytics. The system is composed of several services, each responsible for a specific domain, allowing for scalability and maintainability.

## Project Structure
The project is organized into multiple services and shared libraries, as follows:

- **ApiGateway**: The entry point for all client requests, handling authentication and routing to the appropriate services.
- **BookingService**: Manages all booking-related operations, including room management and special requests.
- **AnalyticsService**: Provides reporting and predictive analytics capabilities, including a chatbot for user queries.
- **Shared Libraries**: Contains common utilities, constants, and data transfer objects (DTOs) used across services.
- **Infrastructure**: Manages data access and database context for the application.
- **Tests**: Contains unit tests for both the Booking and Analytics services.
- **Docs**: Documentation for API specifications and deployment guides.
- **Scripts**: SQL scripts for database setup and sample data insertion.

## Setup Instructions

### Prerequisites
- .NET 8.0 SDK
- SQL Server LocalDB or SQL Server Express
- Node.js (for frontend development)
- Git

### Step 1: Clone the Repository
Clone the repository from GitHub (or your version control system) to your local machine.

```bash
git clone <repository-url>
cd HotelBookingSystem
```

### Step 2: Restore NuGet Packages
Navigate to each service project and restore the NuGet packages.

```bash
cd src/ApiGateway/HotelBooking.ApiGateway
dotnet restore

cd ../../Services/HotelBooking.BookingService
dotnet restore

cd ../HotelBooking.AnalyticsService
dotnet restore
```

### Step 3: Set Up the Database
Run the SQL scripts located in the `scripts` folder to set up the database.

1. Open SQL Server Management Studio (SSMS).
2. Connect to your SQL Server instance.
3. Execute the `database-setup.sql` script to create the database and schemas.
4. Optionally, execute the `sample-data.sql` script to insert sample data.

### Step 4: Configure Connection Strings
Update the `appsettings.json` files in each service to include the correct connection strings for your database.

### Step 5: Run the Application
You can run the application by starting the API Gateway, which will route requests to the appropriate services.

```bash
cd src/ApiGateway/HotelBooking.ApiGateway
dotnet run
```

### Step 6: Access the API
Once the application is running, you can access the API at `http://localhost:5000` (or the configured port). Use tools like Postman to test the endpoints.

## Conclusion
This Hotel Booking System provides a robust framework for managing hotel bookings and analytics. The microservices architecture allows for independent development and scaling of each service, ensuring a responsive and efficient application.