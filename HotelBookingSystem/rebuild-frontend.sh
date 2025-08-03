#!/bin/bash

# Frontend Rebuild Script for External Access

echo "🔄 Rebuilding frontend with external API URL..."

# Stop the frontend container
echo "Stopping frontend container..."
docker-compose stop frontend

# Remove the frontend container and image
echo "Removing old frontend container and image..."
docker-compose rm -f frontend
docker rmi $(docker images | grep hotel-booking-frontend | awk '{print $3}') 2>/dev/null || true

# Rebuild frontend with new environment
echo "Rebuilding frontend with REACT_APP_API_URL=http://51.21.128.214:5000..."
docker-compose build --no-cache frontend

# Start the frontend container
echo "Starting frontend container..."
docker-compose up -d frontend

echo "✅ Frontend rebuild complete!"
echo ""
echo "🌐 Frontend should now be accessible at:"
echo "  http://51.21.128.214:3000"
echo "  http://51.21.128.214 (port 80)"
echo ""
echo "🔍 To verify the API URL is correct, check browser console or:"
echo "  docker-compose logs frontend"
