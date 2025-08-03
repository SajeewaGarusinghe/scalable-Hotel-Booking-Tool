#!/bin/bash

# Hotel Booking System Docker Startup Script

set -e

echo "🚀 Starting Hotel Booking System..."

# Stop any existing containers
echo "📋 Stopping existing containers..."
docker-compose down

# Build and start all services
echo "🔨 Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Show status
echo "📊 Container Status:"
docker-compose ps

echo ""
echo "✅ Hotel Booking System is now running!"
echo ""
echo "🌐 Access URLs:"
echo "   Frontend: http://localhost:3000 or http://localhost:80"
echo "   API Gateway: http://localhost:5000"
echo "   Booking Service: http://localhost:5003"
echo "   Analytics Service: http://localhost:5005"
echo ""
echo "📋 To view logs: docker-compose logs -f [service-name]"
echo "📋 To stop all services: docker-compose down"
