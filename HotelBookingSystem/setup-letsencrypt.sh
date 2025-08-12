#!/bin/bash

echo "=== Let's Encrypt SSL Certificate Setup ==="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "Please run this script as root (use sudo)"
    exit 1
fi

# Check if domain is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <domain-name>"
    echo "Example: $0 yourdomain.com"
    exit 1
fi

DOMAIN=$1
EMAIL="admin@${DOMAIN}"

echo "Setting up Let's Encrypt SSL for domain: $DOMAIN"
echo "Email: $EMAIL"
echo ""

# Step 1: Install Certbot
echo "Step 1: Installing Certbot..."
if ! command -v certbot &> /dev/null; then
    # Update package list
    apt update
    
    # Install snapd if not present
    if ! command -v snap &> /dev/null; then
        apt install -y snapd
        systemctl enable --now snapd.socket
        ln -s /var/lib/snapd/snap /snap
    fi
    
    # Install certbot via snap
    snap install core; snap refresh core
    snap install --classic certbot
    ln -s /snap/bin/certbot /usr/bin/certbot
    
    echo "✓ Certbot installed"
else
    echo "✓ Certbot already installed"
fi

# Step 2: Stop nginx container temporarily
echo ""
echo "Step 2: Stopping nginx container..."
docker-compose -f docker-compose.external.yml stop nginx

# Step 3: Obtain certificate
echo ""
echo "Step 3: Obtaining SSL certificate..."
certbot certonly --standalone \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    --domains "$DOMAIN" \
    --non-interactive

if [ $? -eq 0 ]; then
    echo "✓ SSL certificate obtained successfully"
else
    echo "✗ Failed to obtain SSL certificate"
    echo "Starting nginx container..."
    docker-compose -f docker-compose.external.yml start nginx
    exit 1
fi

# Step 4: Copy certificates to ssl directory
echo ""
echo "Step 4: Copying certificates..."
mkdir -p ssl
cp "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ssl/server.crt
cp "/etc/letsencrypt/live/$DOMAIN/privkey.pem" ssl/server.key
chmod 644 ssl/server.crt
chmod 600 ssl/server.key
echo "✓ Certificates copied to ssl directory"

# Step 5: Update nginx configuration for the domain
echo ""
echo "Step 5: Updating nginx configuration..."
sed -i "s/server_name _;/server_name $DOMAIN;/g" nginx-external.conf
echo "✓ Nginx configuration updated"

# Step 6: Start nginx container
echo ""
echo "Step 6: Starting nginx container..."
docker-compose -f docker-compose.external.yml start nginx
echo "✓ Nginx container started"

# Step 7: Set up automatic renewal
echo ""
echo "Step 7: Setting up automatic renewal..."
cat > /etc/cron.d/certbot-renewal << EOF
# Renew Let's Encrypt certificates twice daily
0 12 * * * root certbot renew --quiet --deploy-hook "docker-compose -f $(pwd)/docker-compose.external.yml restart nginx"
EOF

echo "✓ Automatic renewal configured"

# Step 8: Test renewal
echo ""
echo "Step 8: Testing certificate renewal..."
certbot renew --dry-run
if [ $? -eq 0 ]; then
    echo "✓ Renewal test successful"
else
    echo "⚠ Renewal test failed - please check configuration"
fi

echo ""
echo "=== Let's Encrypt Setup Complete ==="
echo ""
echo "🌐 Your application is now available at:"
echo "   https://$DOMAIN"
echo ""
echo "🔒 SSL Certificate Info:"
echo "   Type: Let's Encrypt (trusted)"
echo "   Auto-renewal: Enabled (twice daily)"
echo "   Valid for: 90 days (auto-renewed)"
echo ""
echo "🔧 Certificate Management:"
echo "   View status: certbot certificates"
echo "   Manual renewal: certbot renew"
echo "   Force renewal: certbot renew --force-renewal"
echo ""
echo "Setup completed! 🚀"
