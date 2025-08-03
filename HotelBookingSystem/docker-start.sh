#!/bin/bash

# Hotel Booking System Docker Startup Script

set -e

echo "🏨 Starting Hotel Booking System..."

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
    echo "🔨 Building and starting services..."
    
    # Load environment variables
    if [ -f .env.development ]; then
        export $(cat .env.development | grep -v '#' | xargs)
    fi
    
    # Build and start all services
    docker-compose up --build -d
    
    echo "⏳ Waiting for services to be ready..."
    sleep 30
    
    # Check service health
    check_services_health
}

# Function to check services health
check_services_health() {
    echo "🏥 Checking services health..."
    
    local services=("booking-service" "analytics-service" "api-gateway" "frontend")
    
    for service in "${services[@]}"; do
        echo "Checking $service..."
        if docker-compose ps $service | grep -q "Up"; then
            echo "✅ $service is running"
        else
            echo "❌ $service is not running"
        fi
    done
}

# Function to show service URLs
show_urls() {
    echo ""
    echo "🌐 Service URLs:"
    echo "Frontend: http://localhost:3000"
    echo "API Gateway: http://localhost:5000"
    echo "Booking Service: http://localhost:5003"
    echo "Analytics Service: http://localhost:5005"
    echo "Database: Azure SQL Database (External)"
    echo ""
    echo "📖 API Documentation:"
    echo "Swagger UI: http://localhost:5000/swagger"
    echo ""
}

# Function to show logs
show_logs() {
    echo "📋 To view logs, use:"
    echo "docker-compose logs -f [service_name]"
    echo ""
    echo "Available services: api-gateway, booking-service, analytics-service, frontend"
}

# Main execution
main() {
    echo "🏨 Hotel Booking System Docker Setup"
    echo "===================================="
    
    check_docker
    
    # Parse command line arguments
    case "${1:-start}" in
        "start")
            cleanup
            start_services
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
            ;;
        "logs")
            docker-compose logs -f "${2:-}"
            ;;
        "cleanup")
            cleanup
            echo "✅ Cleanup completed"
            ;;
        "status")
            check_services_health
            ;;
        *)
            echo "Usage: $0 {start|stop|restart|logs|cleanup|status}"
            echo ""
            echo "Commands:"
            echo "  start   - Build and start all services"
            echo "  stop    - Stop all services"
            echo "  restart - Restart all services"
            echo "  logs    - Show logs (optionally specify service name)"
            echo "  cleanup - Remove all containers and volumes"
            echo "  status  - Check service health"
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
