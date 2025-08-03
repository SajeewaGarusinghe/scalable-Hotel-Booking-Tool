#!/bin/bash

# Debug Frontend Environment Variables

echo "🔍 Debugging Frontend Environment Variables"
echo "==========================================="

echo ""
echo "1. Checking docker-compose environment variables:"
echo "------------------------------------------------"
docker-compose config | grep -A 5 -B 5 "REACT_APP"

echo ""
echo "2. Checking running frontend container environment:"
echo "------------------------------------------------"
docker exec hotel-booking-frontend env | grep REACT_APP || echo "No REACT_APP variables found in container"

echo ""
echo "3. Checking if frontend container is running:"
echo "-------------------------------------------"
docker ps | grep frontend

echo ""
echo "4. Testing API connectivity from container:"
echo "------------------------------------------"
docker exec hotel-booking-frontend wget -qO- http://51.21.128.214:5000/health 2>/dev/null && echo "✅ API reachable from container" || echo "❌ API not reachable from container"

echo ""
echo "5. Testing external API endpoint:"
echo "--------------------------------"
curl -s http://51.21.128.214:5000/health && echo " ✅ External API responding" || echo "❌ External API not responding"

echo ""
echo "6. Current frontend build info:"
echo "-----------------------------"
docker exec hotel-booking-frontend cat /usr/share/nginx/html/static/js/*.js 2>/dev/null | grep -o "http://[^\"]*" | head -5 || echo "Could not extract API URLs from build"

echo ""
echo "🔧 To fix API URL issues:"
echo "1. Run: chmod +x rebuild-frontend.sh && ./rebuild-frontend.sh"
echo "2. Or rebuild everything: docker-compose down && docker-compose up --build -d"
