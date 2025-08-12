# Hotel Booking System

## Application Summary
An enterprise-ready, microservices-based system for hotel operations:
- **Booking & Room Management**: CRUD for bookings, rooms, customers, and special requests
- **Analytics & Reporting**: Weekly/monthly reports, occupancy stats, predictive analytics, chatbot
- **API Gateway**: Single entry point, routing, security, rate limiting
- **Frontend**: React-based UI consuming API Gateway endpoints

Designed for scalability, security, and maintainability with containerized deployment.

## Architecture (High-level)
- Services: `ApiGateway`, `BookingService`, `AnalyticsService`
- Shared libraries: `HotelBooking.Common`, `HotelBooking.Models`
- Data: Microsoft SQL Server with schemas `booking` and `analytics`
- Deployment: Docker Compose for local/prod; Nginx reverse proxy for TLS/ingress

## Project Structure
- `src/ApiGateway/HotelBooking.ApiGateway` — API Gateway (routing, cross-cutting concerns)
- `src/Services/HotelBooking.BookingService` — Booking, Rooms, Customers, Special Requests APIs
- `src/Services/HotelBooking.AnalyticsService` — Reports, statistics, predictions, chatbot APIs
- `src/Infrastructure/HotelBooking.Data` — EF Core context, repositories, configurations
- `src/Shared/HotelBooking.Models` — Entities and DTOs; `src/Shared/HotelBooking.Common` — utilities
- `hotel-booking-frontend` — React app
- `scripts` — SQL for database initialization and sample data
- `tests` — Unit tests for services

## Prerequisites
- .NET 8 SDK
- Node.js 18+ and npm
- SQL Server (LocalDB/Express/Azure SQL)
- Docker Desktop (for containerized runs)

## Quick Start (Local Development)
Two options: run services directly, or use Docker.

### Option A: Run Services Locally
1) Restore dependencies
```bash
cd src/ApiGateway/HotelBooking.ApiGateway && dotnet restore
cd ../../Services/HotelBooking.BookingService && dotnet restore
cd ../HotelBooking.AnalyticsService && dotnet restore
```

2) Set up database
```bash
# In SSMS or sqlcmd
# Execute scripts in order:
scripts/database-setup.sql
scripts/sample-data.sql   # optional
```

3) Configure connection strings
- Update `appsettings.json` (or User Secrets) in each service with your SQL connection string

4) Run services (separate terminals)
```bash
dotnet run --project src/Services/HotelBooking.BookingService/HotelBooking.BookingService.csproj
dotnet run --project src/Services/HotelBooking.AnalyticsService/HotelBooking.AnalyticsService.csproj
dotnet run --project src/ApiGateway/HotelBooking.ApiGateway/HotelBooking.ApiGateway.csproj
```

5) Run frontend
```bash
cd hotel-booking-frontend
npm install
npm start
```

6) Access
- API Gateway: `http://localhost:5000`
- Frontend (dev): `http://localhost:3000`

### Option B: Run via Docker (Local)
```bash
docker compose up --build -d
```
Defaults:
- API Gateway: `http://localhost:5000`
- Booking Service: `http://localhost:5003`
- Analytics Service: `http://localhost:5005`
- Frontend: `http://localhost:3000`

## Configuration
Common environment variables (examples):
```bash
# API Gateway / Services
ConnectionStrings__DefaultConnection="Server=<server>;Database=hotel-booking-db;User Id=<user>;Password=<pwd>;TrustServerCertificate=true;Encrypt=true;"
JWT__SecretKey="<your-strong-secret>"
JWT__Issuer="HotelBookingSystem"
JWT__Audience="HotelBookingClients"

# Frontend
REACT_APP_API_URL="http://localhost:5000"
```

## Database Setup
Scripts are in `scripts/`:
- `database-setup.sql` — creates DB, schemas (`booking`, `analytics`) and tables
- `sample-data.sql` — optional sample dataset

## Production Deployment (Azure VM with Docker)
1) Copy files to VM: `docker-compose.external.yml`, `nginx-external.conf`, `ssl/` certs (or use Let’s Encrypt)

2) Set environment variables (securely) for DB and JWT

3) Start stack
```bash
docker compose -f docker-compose.external.yml up --build -d
```

4) Access (behind Nginx)
- HTTPS: `https://<your-domain-or-ip>` → Frontend
- HTTPS API via gateway path: `https://<your-domain-or-ip>/api/...`

5) SSL certificates (if needed)
- Place `server.crt` and `server.key` under `HotelBookingSystem/ssl/`
- Or generate self-signed certs for testing:
    - Windows: `generate-ssl-certs.bat`
    - Linux/macOS: `./generate-ssl-certs.sh`
- Reload Nginx container after updating certs: `docker restart hotel-booking-nginx`

## API Highlights
- Bookings: `GET/POST/PUT/DELETE /api/bookings`
- Rooms: `GET/POST/PUT/DELETE /api/rooms`
- Special Requests: `GET/POST/PUT/DELETE /api/special-requests`
- Reports: `GET /api/reports/weekly`, `GET /api/reports/monthly`, `POST /api/reports/custom`

## Testing
Run all tests:
```bash
dotnet test
```

## Troubleshooting
- Ports already in use: stop previous containers or processes using 3000/5000/5003/5005/80/443
    - Check: `docker ps`, `netstat -ano` (Windows), `lsof -i :PORT` (Linux/macOS)
- Database connectivity issues: verify connection string, firewall, TLS (set `TrustServerCertificate=true;Encrypt=true;` for dev)
- 401/403 responses: ensure JWT env vars set and frontend includes token
- CORS errors: confirm `nginx-external.conf` and gateway CORS settings allow your origin
- SSL problems: verify certificate/key paths and container volume mounts
- Container not starting: `docker logs <container_name>` for details

## Smoke Test Checklist (cURL)
After starting locally (Docker or direct run):

1) API health (via gateway)
```bash
curl -i http://localhost:5000/api/bookings
```

2) Create a booking (example payload)
```bash
curl -i -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "customerId":"00000000-0000-0000-0000-000000000001",
    "roomId":"00000000-0000-0000-0000-000000000002",
    "checkInDate":"2025-09-01",
    "checkOutDate":"2025-09-03",
    "numberOfGuests":2,
    "totalAmount":250.00,
    "bookingStatus":"Confirmed",
    "isRecurring":false
  }'
```

3) List rooms
```bash
curl -i http://localhost:5000/api/rooms
```

4) Weekly report
```bash
curl -i "http://localhost:5000/api/reports/weekly?startDate=2025-09-01&endDate=2025-09-07"
```

5) Nginx health (prod only)
```bash
curl -ik https://<your-domain-or-ip>/health
```