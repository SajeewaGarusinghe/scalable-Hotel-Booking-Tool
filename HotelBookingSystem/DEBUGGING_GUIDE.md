# Debugging Guide for Docker Services

## Current Issue Analysis

Based on the output you provided, the services are showing as "unhealthy". This is typically due to:

1. **Missing Health Check Endpoints**: The services might not have `/health` endpoints implemented
2. **Database Connection Issues**: Services can't connect to Azure SQL Database
3. **Missing Dependencies**: Required packages or configurations missing

## Immediate Actions to Take

### 1. Remove Health Checks (Temporary Fix)
The health checks in Docker Compose are causing the "unhealthy" status. I've already removed them from the docker-compose.yml file.

### 2. Check Service Logs
```bash
# Check logs for each service to see what's failing
docker-compose logs booking-service
docker-compose logs analytics-service
docker-compose logs api-gateway
docker-compose logs frontend
```

### 3. Test Database Connection
```bash
# Test if you can connect to Azure SQL from the server
sudo apt-get update
sudo apt-get install -y mssql-tools unixodbc-dev

# Test connection
/opt/mssql-tools/bin/sqlcmd -S hotel-booking-server.database.windows.net -U dbadmin -P HotelBooking1234 -d HotelBookingSystem -Q "SELECT 1"
```

### 4. Restart Services
```bash
# Stop all services
docker-compose down

# Clean up
docker system prune -f

# Start with the new configuration
chmod +x start-external.sh
./start-external.sh start
```

## External Access Setup

### Current Configuration:
- **Frontend**: http://172.214.136.108:3000 and http://172.214.136.108:80
- **API Gateway**: http://172.214.136.108:5000
- **Booking Service**: http://172.214.136.108:5003
- **Analytics Service**: http://172.214.136.108:5005

### Firewall Requirements:
Make sure your AWS Security Group allows inbound traffic on:
- Port 80 (HTTP)
- Port 3000 (Frontend)
- Port 5000 (API Gateway)
- Port 5003 (Booking Service)
- Port 5005 (Analytics Service)

### Test External Access:
```bash
# From your local machine, test:
curl http://172.214.136.108:3000
curl http://172.214.136.108:5000/health
curl http://172.214.136.108:5003/health
curl http://172.214.136.108:5005/health
```

## Database Connection Troubleshooting

### 1. Check Azure SQL Firewall
Ensure Azure SQL Database firewall allows connections from your EC2 instance:
1. Go to Azure Portal → SQL Databases → HotelBookingSystem
2. Go to "Set server firewall"
3. Add your EC2 instance's public IP (172.214.136.108)
4. Or temporarily set "Allow Azure services" to ON

### 2. Test Connection String
```bash
# Create test connection script
cat > test-db.sh << 'EOF'
#!/bin/bash
/opt/mssql-tools/bin/sqlcmd \
  -S hotel-booking-server.database.windows.net \
  -U dbadmin \
  -P HotelBooking1234 \
  -d HotelBookingSystem \
  -Q "SELECT GETDATE() AS CurrentTime, DB_NAME() AS DatabaseName"
EOF

chmod +x test-db.sh
./test-db.sh
```

## Quick Fix Commands

### 1. Complete Restart
```bash
# Stop everything
docker-compose down -v

# Clean up
docker system prune -af

# Rebuild and start
docker-compose up --build -d

# Wait and check status
sleep 60
docker-compose ps
```

### 2. Check Individual Services
```bash
# Check if services are responding
curl -v http://localhost:5000/health
curl -v http://localhost:5003/health
curl -v http://localhost:5005/health
curl -v http://localhost:3000
```

### 3. Manual Service Testing
```bash
# Test each service individually
docker-compose up api-gateway
# In another terminal: curl http://localhost:5000

docker-compose up booking-service
# In another terminal: curl http://localhost:5003

docker-compose up analytics-service
# In another terminal: curl http://localhost:5005
```

## Expected Behavior After Fix

1. All containers should show "Up" status (no "unhealthy")
2. Health checks should pass (if endpoints exist)
3. External access should work from internet
4. Frontend should load and connect to API

## Next Steps

1. **Run the updated start script**: `./start-external.sh start`
2. **Check logs**: `docker-compose logs -f`
3. **Test external access**: Open http://172.214.136.108:3000 in browser
4. **Verify API**: Open http://172.214.136.108:5000/swagger

If services are still failing, the issue is likely in the application code itself (missing health endpoints, database connection code, etc.).
