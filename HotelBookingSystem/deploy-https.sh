#!/bin/bash

echo "=== Hotel Booking System HTTPS Deployment ==="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "Please run this script as root (use sudo)"
    exit 1
fi

# Step 1: Generate SSL certificates
echo "Step 1: Generating SSL certificates..."
if [ ! -f "ssl/server.crt" ] || [ ! -f "ssl/server.key" ]; then
    echo "Generating self-signed SSL certificates..."
    mkdir -p ssl
    
    # Generate private key
    openssl genrsa -out ssl/server.key 2048
    
    # Generate certificate
    openssl req -new -x509 -key ssl/server.key -out ssl/server.crt -days 365 -subj "/C=US/ST=State/L=City/O=HotelBooking/OU=IT/CN=172.214.136.108"
    
    # Set proper permissions
    chmod 600 ssl/server.key
    chmod 644 ssl/server.crt
    
    echo "✓ SSL certificates generated"
else
    echo "✓ SSL certificates already exist"
fi

# Step 2: Stop existing containers
echo ""
echo "Step 2: Stopping existing containers..."
docker-compose -f docker-compose.external.yml down
echo "✓ Containers stopped"

# Step 3: Build and start with HTTPS
echo ""
echo "Step 3: Building and starting containers with HTTPS..."
docker-compose -f docker-compose.external.yml up --build -d

# Step 4: Wait for services to start
echo ""
echo "Step 4: Waiting for services to start..."
sleep 30

# Step 5: Check service status
echo ""
echo "Step 5: Checking service status..."
echo "Docker containers:"
docker-compose -f docker-compose.external.yml ps

# Step 6: Configure firewall (if ufw is available)
echo ""
echo "Step 6: Configuring firewall..."
if command -v ufw &> /dev/null; then
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw allow 5000/tcp
    echo "✓ Firewall rules updated"
else
    echo "⚠ UFW not found. Please manually configure firewall to allow ports 80, 443, and 5000"
fi

# Step 7: Display final information
echo ""
echo "=== HTTPS Deployment Complete ==="
echo ""
echo "🌐 Application URLs:"
echo "   Frontend (HTTPS): https://172.214.136.108"
echo "   Frontend (HTTP):  http://172.214.136.108 (redirects to HTTPS)"
echo "   API Gateway (HTTPS): https://172.214.136.108:5000"
echo "   API Gateway (HTTP):  http://172.214.136.108:5000 (redirects to HTTPS)"
echo "   API via Frontend: https://172.214.136.108/api"
echo ""
echo "🔒 SSL Certificate Info:"
echo "   Type: Self-signed (for development/testing)"
echo "   Valid for: 365 days"
echo "   Location: ./ssl/"
echo ""
echo "⚠  Important Notes:"
echo "   - Browsers will show a security warning for self-signed certificates"
echo "   - For production, replace with certificates from a trusted CA"
echo "   - Consider using Let's Encrypt for free trusted certificates"
echo ""
echo "🔧 Useful Commands:"
echo "   View logs: docker-compose -f docker-compose.external.yml logs -f"
echo "   Stop services: docker-compose -f docker-compose.external.yml down"
echo "   Restart services: docker-compose -f docker-compose.external.yml restart"
echo ""

# Check if services are responding
echo "🧪 Testing HTTPS connectivity..."
if curl -k -s https://172.214.136.108/health &>/dev/null; then
    echo "✓ HTTPS endpoint is responding"
else
    echo "⚠ HTTPS endpoint test failed - services may still be starting"
fi

echo ""
echo "Deployment completed! 🚀"
