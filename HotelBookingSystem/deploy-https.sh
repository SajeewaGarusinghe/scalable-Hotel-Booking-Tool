#!/bin/bash

echo "=== Hotel Booking System HTTPS Testing ==="
echo ""

IP="172.214.136.108"

# Check which docker compose command is available
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
elif docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    echo "❌ Neither 'docker-compose' nor 'docker compose' found!"
    exit 1
fi

echo "Using: $DOCKER_COMPOSE"
echo ""

echo "🧪 Testing HTTPS Configuration..."
echo ""

# Test 1: Frontend HTTPS
echo "1. Testing Frontend HTTPS (Port 443)..."
if curl -k -s -o /dev/null -w "%{http_code}" https://$IP | grep -q "200"; then
    echo "   ✓ Frontend HTTPS is responding"
else
    echo "   ✗ Frontend HTTPS test failed"
fi

# Test 2: API Gateway Direct HTTPS
echo "2. Testing API Gateway Direct HTTPS (Port 5000)..."
if curl -k -s -o /dev/null -w "%{http_code}" https://$IP:5000/health | grep -q "200"; then
    echo "   ✓ API Gateway HTTPS is responding"
else
    echo "   ✗ API Gateway HTTPS test failed"
fi

# Test 3: API via Frontend
echo "3. Testing API via Frontend (Port 443/api)..."
if curl -k -s -o /dev/null -w "%{http_code}" https://$IP/api/health | grep -q "200"; then
    echo "   ✓ API via Frontend is responding"
else
    echo "   ✗ API via Frontend test failed"
fi

# Test 4: HTTP to HTTPS Redirects
echo "4. Testing HTTP to HTTPS Redirects..."

# Test frontend redirect
FRONTEND_REDIRECT=$(curl -s -o /dev/null -w "%{http_code}" http://$IP)
if [[ "$FRONTEND_REDIRECT" == "301" ]]; then
    echo "   ✓ Frontend HTTP to HTTPS redirect working"
else
    echo "   ✗ Frontend HTTP redirect failed (got $FRONTEND_REDIRECT)"
fi

# Test API gateway redirect
API_REDIRECT=$(curl -s -o /dev/null -w "%{http_code}" http://$IP:5000)
if [[ "$API_REDIRECT" == "301" ]]; then
    echo "   ✓ API Gateway HTTP to HTTPS redirect working"
else
    echo "   ✗ API Gateway HTTP redirect failed (got $API_REDIRECT)"
fi

# Test 5: SSL Certificate Information
echo ""
echo "5. SSL Certificate Information..."
echo "   Certificate details for $IP:443:"
echo | openssl s_client -servername $IP -connect $IP:443 2>/dev/null | openssl x509 -noout -issuer -subject -dates 2>/dev/null

echo ""
echo "   Certificate details for $IP:5000:"
echo | openssl s_client -servername $IP -connect $IP:5000 2>/dev/null | openssl x509 -noout -issuer -subject -dates 2>/dev/null

# Test 6: Security Headers
echo ""
echo "6. Testing Security Headers..."
HEADERS=$(curl -k -s -I https://$IP)

if echo "$HEADERS" | grep -q "Strict-Transport-Security"; then
    echo "   ✓ HSTS header present"
else
    echo "   ✗ HSTS header missing"
fi

if echo "$HEADERS" | grep -q "X-Frame-Options"; then
    echo "   ✓ X-Frame-Options header present"
else
    echo "   ✗ X-Frame-Options header missing"
fi

if echo "$HEADERS" | grep -q "X-Content-Type-Options"; then
    echo "   ✓ X-Content-Type-Options header present"
else
    echo "   ✗ X-Content-Type-Options header missing"
fi

# Test 7: Container Status
echo ""
echo "7. Container Status..."
$DOCKER_COMPOSE -f docker-compose.external.yml ps

# Test 8: Port Accessibility
echo ""
echo "8. Testing Port Accessibility..."
for port in 80 443 5000; do
    if nc -z $IP $port 2>/dev/null; then
        echo "   ✓ Port $port is accessible"
    else
        echo "   ✗ Port $port is not accessible"
    fi
done

# Test 9: Performance Test
echo ""
echo "9. Basic Performance Test..."
echo "   Frontend response time:"
curl -k -s -o /dev/null -w "   Time: %{time_total}s, Size: %{size_download} bytes\n" https://$IP

echo "   API response time:"
curl -k -s -o /dev/null -w "   Time: %{time_total}s, Size: %{size_download} bytes\n" https://$IP:5000/health

echo ""
echo "=== Test Summary ==="
echo "If all tests show ✓, your HTTPS setup is working correctly!"
echo ""
echo "🔗 Access URLs:"
echo "   Frontend: https://$IP"
echo "   API Gateway: https://$IP:5000"
echo "   API via Frontend: https://$IP/api"
echo ""
echo "⚠️  Note: Self-signed certificates will show browser warnings."
echo "   For production, use Let's Encrypt or purchased SSL certificates."