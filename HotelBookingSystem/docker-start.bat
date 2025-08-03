@echo off
setlocal enabledelayedexpansion

echo 🏨 Hotel Booking System Docker Setup (Windows)
echo ================================================

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker Desktop and try again.
    pause
    exit /b 1
)
echo ✅ Docker is running

REM Parse command line arguments
set "COMMAND=%1"
if "%COMMAND%"=="" set "COMMAND=start"

if "%COMMAND%"=="start" goto start
if "%COMMAND%"=="stop" goto stop
if "%COMMAND%"=="restart" goto restart
if "%COMMAND%"=="logs" goto logs
if "%COMMAND%"=="cleanup" goto cleanup
if "%COMMAND%"=="status" goto status
goto usage

:start
echo 🔨 Building and starting services...
echo.

REM Load environment variables if file exists
if exist ".env.development" (
    echo Loading environment variables...
    for /f "usebackq tokens=1,2 delims==" %%a in (".env.development") do (
        if not "%%a"=="" if not "%%a:~0,1%%"=="#" (
            set "%%a=%%b"
        )
    )
)

REM Clean up previous containers
echo 🧹 Cleaning up previous containers...
docker-compose down -v 2>nul

REM Build and start all services
docker-compose up --build -d

REM Wait for services to be ready
echo ⏳ Waiting for services to be ready...
timeout /t 30 /nobreak >nul

echo.
echo 🌐 Service URLs:
echo Frontend: http://localhost:3000
echo API Gateway: http://localhost:5000
echo Booking Service: http://localhost:5003
echo Analytics Service: http://localhost:5005
echo SQL Server: localhost:1433
echo.
echo 📖 API Documentation:
echo Swagger UI: http://localhost:5000/swagger
echo.
echo 📋 To view logs, use:
echo docker-start.bat logs [service_name]
echo.
echo Available services: sqlserver, api-gateway, booking-service, analytics-service, frontend
goto end

:stop
echo 🛑 Stopping services...
docker-compose down
goto end

:restart
echo 🔄 Restarting services...
docker-compose restart
goto end

:logs
if "%2"=="" (
    docker-compose logs -f
) else (
    docker-compose logs -f %2
)
goto end

:cleanup
echo 🧹 Cleaning up containers and volumes...
docker-compose down -v
docker system prune -f
echo ✅ Cleanup completed
goto end

:status
echo 🏥 Checking services health...
docker-compose ps
echo.
echo Testing service endpoints...
curl -s http://localhost:5000/health >nul 2>&1 && echo ✅ API Gateway: OK || echo ❌ API Gateway: FAILED
curl -s http://localhost:5003/health >nul 2>&1 && echo ✅ Booking Service: OK || echo ❌ Booking Service: FAILED
curl -s http://localhost:5005/health >nul 2>&1 && echo ✅ Analytics Service: OK || echo ❌ Analytics Service: FAILED
curl -s http://localhost:3000 >nul 2>&1 && echo ✅ Frontend: OK || echo ❌ Frontend: FAILED
goto end

:usage
echo Usage: docker-start.bat {start^|stop^|restart^|logs^|cleanup^|status}
echo.
echo Commands:
echo   start   - Build and start all services
echo   stop    - Stop all services
echo   restart - Restart all services
echo   logs    - Show logs (optionally specify service name)
echo   cleanup - Remove all containers and volumes
echo   status  - Check service health
goto end

:end
if "%COMMAND%"=="start" (
    echo.
    echo Press any key to exit...
    pause >nul
)
endlocal
