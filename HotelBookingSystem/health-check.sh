#!/bin/bash

# Health Check Script for Hotel Booking System
# This script checks the health of all services and provides detailed status

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check service health
check_service() {
    local service_name=$1
    local url=$2
    local expected_status=${3:-200}
    
    echo -n "Checking $service_name... "
    
    if response=$(curl -s -o /dev/null -w "%{http_code}" $url 2>/dev/null); then
        if [ "$response" -eq "$expected_status" ]; then
            echo -e "${GREEN}✓ OK${NC} (HTTP $response)"
            return 0
        else
            echo -e "${YELLOW}⚠ Warning${NC} (HTTP $response)"
            return 1
        fi
    else
        echo -e "${RED}✗ Failed${NC} (No response)"
        return 1
    fi
}

# Function to check container status
check_container() {
    local container_name=$1
    
    if docker ps --format "table {{.Names}}" | grep -q "$container_name"; then
        status=$(docker ps --filter "name=$container_name" --format "{{.Status}}")
        if [[ $status == *"Up"* ]]; then
            echo -e "${GREEN}✓${NC} $container_name is running ($status)"
            return 0
        else
            echo -e "${RED}✗${NC} $container_name has issues ($status)"
            return 1
        fi
    else
        echo -e "${RED}✗${NC} $container_name is not running"
        return 1
    fi
}

# Function to check database connectivity
check_database() {
    echo -n "Checking database connectivity (Azure SQL)... "
    
    # Since we're using external Azure SQL, we'll test through the API services
    if check_service "API Gateway" "http://localhost:5000/health" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Connected via API Gateway${NC}"
        return 0
    else
        echo -e "${RED}✗ Failed to connect via services${NC}"
        return 1
    fi
}

# Function to show system resources
show_system_resources() {
    echo ""
    echo "=== System Resources ==="
    
    # Disk usage
    echo "Disk Usage:"
    df -h / | tail -1 | awk '{print "  Used: " $3 " / " $2 " (" $5 ")"}'
    
    # Memory usage
    echo "Memory Usage:"
    free -h | grep "Mem:" | awk '{print "  Used: " $3 " / " $2}'
    
    # Docker resources
    echo "Docker Containers:"
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"
}

# Function to show service URLs
show_service_urls() {
    echo ""
    echo "=== Service URLs ==="
    echo "Frontend:          http://localhost:3000"
    echo "API Gateway:       http://localhost:5000"
    echo "Booking Service:   http://localhost:5003"
    echo "Analytics Service: http://localhost:5005"
    echo "Database:          Azure SQL Database (hotel-booking-server.database.windows.net)"
}

# Main health check
main() {
    echo "🏨 Hotel Booking System Health Check"
    echo "====================================="
    echo "Timestamp: $(date)"
    echo ""
    
    # Check Docker daemon
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}✗ Docker is not running${NC}"
        exit 1
    fi
    
    echo "=== Container Status ==="
    check_container "hotel-booking-api-gateway"
    check_container "hotel-booking-booking-service"
    check_container "hotel-booking-analytics-service"
    check_container "hotel-booking-frontend"
    
    echo ""
    echo "=== Service Health Checks ==="
    
    # Wait a moment for services to be ready
    sleep 2
    
    check_database
    check_service "API Gateway" "http://localhost:5000/health"
    check_service "Booking Service" "http://localhost:5003/health"
    check_service "Analytics Service" "http://localhost:5005/health"
    check_service "Frontend" "http://localhost:3000" 200
    
    show_system_resources
    show_service_urls
    
    echo ""
    echo "=== Logs ==="
    echo "To view logs for a specific service:"
    echo "  docker-compose logs -f [service-name]"
    echo ""
    echo "Available services: api-gateway, booking-service, analytics-service, frontend"
}

# Run health check
main "$@"
