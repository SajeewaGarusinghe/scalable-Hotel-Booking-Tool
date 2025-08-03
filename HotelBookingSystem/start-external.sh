#!/bin/bash

# Hotel Booking System Docker Startup Script for External Access

set -e

echo "🏨 Starting Hotel Booking System for External Access..."
echo "Server IP: 51.21.128.214"

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo "❌ Docker is not running. Please start Docker and try again."
        exit 1
    fi
    echo "✅ Docker is running"
}

# Function to clean up previous containers
cleanup() {
    echo "🧹 Cleaning up previous containers..."
    docker-compose down -v 2>/dev/null || true
    docker system prune -f 2>/dev/null || true
}

# Function to build and start services
start_services() {
    echo "🔨 Building and starting services for external access..."
    
    # Build and start all services
    docker-compose up --build -d
    
    echo "⏳ Waiting for services to be ready..."
    sleep 45
    
    # Check service status
    check_services_status
}

# Function to check services status
check_services_status() {
    echo "🏥 Checking services status..."
    
    local services=("api-gateway" "booking-service" "analytics-service" "frontend")
    
    for service in "${services[@]}"; do
        echo "Checking $service..."
        if docker-compose ps $service | grep -q "Up"; then
            echo "✅ $service is running"
        else
            echo "❌ $service is not running"
            echo "Logs for $service:"
            docker-compose logs --tail=10 $service
        fi
    done
}

# Function to test external connectivity
test_external_access() {
    echo "🌐 Testing external access..."
    
    # Test local endpoints
    echo "Testing local endpoints:"
    curl -s http://localhost:5000/health && echo "✅ API Gateway: OK" || echo "❌ API Gateway: Failed"
    curl -s http://localhost:5003/health && echo "✅ Booking Service: OK" || echo "❌ Booking Service: Failed"
    curl -s http://localhost:5005/health && echo "✅ Analytics Service: OK" || echo "❌ Analytics Service: Failed"
    curl -s http://localhost:3000 > /dev/null && echo "✅ Frontend: OK" || echo "❌ Frontend: Failed"
    
    # Test external endpoints
    echo ""
    echo "Testing external endpoints:"
    curl -s http://51.21.128.214:5000/health && echo "✅ External API Gateway: OK" || echo "❌ External API Gateway: Failed"
    curl -s http://51.21.128.214:3000 > /dev/null && echo "✅ External Frontend: OK" || echo "❌ External Frontend: Failed"
}

# Function to show service URLs
show_urls() {
    echo ""
    echo "🌐 Service URLs:"
    echo "================================"
    echo "LOCAL ACCESS:"
    echo "  Frontend: http://localhost:3000"
    echo "  API Gateway: http://localhost:5000"
    echo "  Booking Service: http://localhost:5003"
    echo "  Analytics Service: http://localhost:5005"
    echo ""
    echo "EXTERNAL ACCESS:"
    echo "  Frontend: http://51.21.128.214:3000"
    echo "  Frontend (port 80): http://51.21.128.214"
    echo "  API Gateway: http://51.21.128.214:5000"
    echo "  Booking Service: http://51.21.128.214:5003"
    echo "  Analytics Service: http://51.21.128.214:5005"
    echo ""
    echo "📖 API Documentation:"
    echo "  Swagger UI: http://51.21.128.214:5000/swagger"
    echo ""
}

# Function to show logs
show_logs() {
    echo "📋 To view logs, use:"
    echo "docker-compose logs -f [service_name]"
    echo ""
    echo "Available services: api-gateway, booking-service, analytics-service, frontend"
    echo ""
    echo "To check specific service logs:"
    echo "docker-compose logs -f api-gateway"
    echo "docker-compose logs -f booking-service"
    echo "docker-compose logs -f analytics-service"
    echo "docker-compose logs -f frontend"
}

# Main execution
main() {
    echo "🏨 Hotel Booking System External Access Setup"
    echo "=============================================="
    
    check_docker
    
    # Parse command line arguments
    case "${1:-start}" in
        "start")
            cleanup
            start_services
            test_external_access
            show_urls
            show_logs
            ;;
        "stop")
            echo "🛑 Stopping services..."
            docker-compose down
            ;;
        "restart")
            echo "🔄 Restarting services..."
            docker-compose restart
            sleep 30
            test_external_access
            ;;
        "logs")
            docker-compose logs -f "${2:-}"
            ;;
        "cleanup")
            cleanup
            echo "✅ Cleanup completed"
            ;;
        "status")
            check_services_status
            test_external_access
            ;;
        "test")
            test_external_access
            ;;
        *)
            echo "Usage: $0 {start|stop|restart|logs|cleanup|status|test}"
            echo ""
            echo "Commands:"
            echo "  start   - Build and start all services for external access"
            echo "  stop    - Stop all services"
            echo "  restart - Restart all services"
            echo "  logs    - Show logs (optionally specify service name)"
            echo "  cleanup - Remove all containers and volumes"
            echo "  status  - Check service status"
            echo "  test    - Test external connectivity"
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
