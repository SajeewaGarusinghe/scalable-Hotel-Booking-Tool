# Docker Setup for Hotel Booking System

This document provides quick setup instructions for running the Hotel Booking System using Docker.

## Quick Start

### Prerequisites
- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Docker Compose
- Git

### 1. Clone Repository
```bash
git clone https://github.com/your-username/scalable-Hotel-Booking-Tool.git
cd scalable-Hotel-Booking-Tool/HotelBookingSystem
```

### 2. Start Services
```bash
# Using the startup script (Linux/Mac)
chmod +x docker-start.sh
./docker-start.sh start

# Or using docker-compose directly
docker-compose up --build -d
```

### 3. Access Services
- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:5000
- **Swagger UI**: http://localhost:5000/swagger
- **Booking Service**: http://localhost:5003
- **Analytics Service**: http://localhost:5005

### 4. Check Status
```bash
# Check container status
docker-compose ps

# Run health check
chmod +x health-check.sh
./health-check.sh

# View logs
docker-compose logs -f
```

## Services Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │
│   (React)       │───▶│   (Port 5000)   │
│   Port 3000     │    └─────────┬───────┘
└─────────────────┘              │
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
┌───────▼───────┐    ┌───────────▼─────────┐    ┌─────────▼────────┐
│ Booking       │    │ Analytics           │    │ Azure SQL        │
│ Service       │    │ Service             │    │ Database         │
│ (Port 5003)   │    │ (Port 5005)         │    │ (External)       │
└───────────────┘    └─────────────────────┘    └──────────────────┘
```

## Docker Files

### Service Dockerfiles
- `src/ApiGateway/HotelBooking.ApiGateway/Dockerfile` - API Gateway
- `src/Services/HotelBooking.BookingService/Dockerfile` - Booking Service
- `src/Services/HotelBooking.AnalyticsService/Dockerfile` - Analytics Service
- `hotel-booking-frontend/Dockerfile` - React Frontend

### Compose Files
- `docker-compose.yml` - Development environment
- `docker-compose.prod.yml` - Production environment

### Configuration Files
- `.env.development` - Development environment variables
- `.env.production` - Production environment variables
- `.dockerignore` - Files to exclude from Docker build

## Environment Variables

Key environment variables in `.env` file:

```bash
# Database (Azure SQL Database)
CONNECTION_STRING=Server=hotel-booking-server.database.windows.net;Database=HotelBookingSystem;User Id=dbadmin;Password=HotelBooking1234;TrustServerCertificate=true;Encrypt=true;

# Frontend
REACT_APP_API_BASE_URL=http://localhost:5000

# Authentication (update with your credentials)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
JWT_SECRET_KEY=your-jwt-secret-key
```

## Common Commands

### Development
```bash
# Start all services
docker-compose up --build -d

# Stop all services
docker-compose down

# Restart specific service
docker-compose restart [service-name]

# View logs
docker-compose logs -f [service-name]

# Execute command in container
docker exec -it [container-name] bash
```

### Production
```bash
# Start production environment
docker-compose -f docker-compose.prod.yml up --build -d

# Use production environment file
docker-compose --env-file .env.production -f docker-compose.prod.yml up -d
```

### Maintenance
```bash
# Check system health
./health-check.sh

# Clean up unused Docker resources
docker system prune -af

# View container resource usage
docker stats

# Backup database
./backup-db.sh
```

## Database Access

### Connect to Azure SQL Database
```bash
# Using external client (SSMS, Azure Data Studio, etc.)
Server: hotel-booking-server.database.windows.net
Username: dbadmin
Password: HotelBooking1234
Database: HotelBookingSystem
Encryption: Required
```

### Database is Pre-configured
The system uses an existing Azure SQL Database. The database schema and sample data should already be set up as per the deployment guide.

## Troubleshooting

### Common Issues

1. **Port conflicts**
   ```bash
   # Check what's using a port
   netstat -tulpn | grep :5000
   
   # Change ports in docker-compose.yml if needed
   ```

2. **Services won't start**
   ```bash
   # Check logs
   docker-compose logs [service-name]
   
   # Check Docker daemon
   docker info
   ```

3. **Database connection issues**
   ```bash
   # Test database connection through API services
   curl http://localhost:5000/health
   curl http://localhost:5003/health
   
   # Check Azure SQL Database connectivity from your machine
   # Use SSMS or Azure Data Studio to verify connection
   ```

4. **Frontend can't reach backend**
   - Check `REACT_APP_API_BASE_URL` in environment
   - Verify API Gateway is running on correct port
   - Check network connectivity between containers

### Health Checks
```bash
# API Gateway
curl http://localhost:5000/health

# Booking Service
curl http://localhost:5003/health

# Analytics Service
curl http://localhost:5005/health

# Frontend
curl http://localhost:3000
```

## AWS Deployment

For detailed AWS EC2 deployment instructions, see [DOCKER_DEPLOYMENT_GUIDE.md](./DOCKER_DEPLOYMENT_GUIDE.md).

## Development Tips

1. **Hot Reload**: Frontend supports hot reload, but backend services need restart for code changes
2. **Debugging**: Use VS Code with Docker extension for debugging
3. **Testing**: Run tests before building Docker images
4. **Logs**: Use centralized logging for production environments

## Security Notes

1. **Passwords**: Change default passwords in production
2. **Secrets**: Use Docker secrets or environment files for sensitive data
3. **Network**: Use custom Docker networks for service isolation
4. **Updates**: Regularly update base images and dependencies

## Support

- Check container logs: `docker-compose logs -f`
- Monitor system resources: `docker stats`
- Run health checks: `./health-check.sh`
- For AWS deployment issues, see the detailed deployment guide
