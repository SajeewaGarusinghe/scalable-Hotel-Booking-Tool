@echo off
echo === Hotel Booking System HTTPS Deployment ===
echo.

:: Step 1: Generate SSL certificates
echo Step 1: Generating SSL certificates...
if not exist ssl\server.crt (
    echo Generating self-signed SSL certificates...
    if not exist ssl mkdir ssl
    
    :: Generate private key
    openssl genrsa -out ssl\server.key 2048
    
    :: Generate certificate
    openssl req -new -x509 -key ssl\server.key -out ssl\server.crt -days 365 -subj "/C=US/ST=State/L=City/O=HotelBooking/OU=IT/CN=172.214.136.108"
    
    echo ✓ SSL certificates generated
) else (
    echo ✓ SSL certificates already exist
)

:: Step 2: Stop existing containers
echo.
echo Step 2: Stopping existing containers...
docker-compose -f docker-compose.external.yml down
echo ✓ Containers stopped

:: Step 3: Build and start with HTTPS
echo.
echo Step 3: Building and starting containers with HTTPS...
docker-compose -f docker-compose.external.yml up --build -d

:: Step 4: Wait for services to start
echo.
echo Step 4: Waiting for services to start...
timeout /t 30 /nobreak >nul

:: Step 5: Check service status
echo.
echo Step 5: Checking service status...
echo Docker containers:
docker-compose -f docker-compose.external.yml ps

:: Step 6: Display final information
echo.
echo === HTTPS Deployment Complete ===
echo.
echo 🌐 Application URLs:
echo    Frontend (HTTPS): https://172.214.136.108
echo    Frontend (HTTP):  http://172.214.136.108 (redirects to HTTPS)
echo    API Gateway (HTTPS): https://172.214.136.108:5000
echo    API Gateway (HTTP):  http://172.214.136.108:5000 (redirects to HTTPS)
echo    API via Frontend: https://172.214.136.108/api
echo.
echo 🔒 SSL Certificate Info:
echo    Type: Self-signed (for development/testing)
echo    Valid for: 365 days
echo    Location: .\ssl\
echo.
echo ⚠  Important Notes:
echo    - Browsers will show a security warning for self-signed certificates
echo    - For production, replace with certificates from a trusted CA
echo    - Consider using Let's Encrypt for free trusted certificates
echo.
echo 🔧 Useful Commands:
echo    View logs: docker-compose -f docker-compose.external.yml logs -f
echo    Stop services: docker-compose -f docker-compose.external.yml down
echo    Restart services: docker-compose -f docker-compose.external.yml restart
echo.
echo Deployment completed! 🚀
echo.
pause
