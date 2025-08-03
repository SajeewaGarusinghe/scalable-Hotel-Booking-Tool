# Docker Deployment Guide for AWS EC2 Linux

This guide provides step-by-step instructions to deploy the Hotel Booking System on AWS EC2 using Docker.

## Prerequisites

- AWS Account with EC2 access
- Basic knowledge of Linux commands
- Domain name (optional, for production)

## Part 1: AWS EC2 Setup

### Step 1: Launch EC2 Instance

1. **Login to AWS Console**
   - Go to AWS Management Console
   - Navigate to EC2 Dashboard

2. **Launch Instance**
   - Click "Launch Instance"
   - **Name**: `hotel-booking-system`
   - **AMI**: Ubuntu Server 22.04 LTS (Free tier eligible)
   - **Instance Type**: t3.medium (recommended) or t2.micro (for testing)
   - **Key Pair**: Create new or use existing key pair
   - **Security Group**: Create new with following rules:

   ```
   Type            Protocol    Port Range    Source
   SSH             TCP         22           Your IP/0.0.0.0/0
   HTTP            TCP         80           0.0.0.0/0
   HTTPS           TCP         443          0.0.0.0/0
   Custom TCP      TCP         3000         0.0.0.0/0 (Frontend)
   Custom TCP      TCP         5000         0.0.0.0/0 (API Gateway)
   Custom TCP      TCP         5003         0.0.0.0/0 (Booking Service)
   Custom TCP      TCP         5005         0.0.0.0/0 (Analytics Service)
   ```

3. **Storage**: 20GB minimum (30GB recommended)
4. Click "Launch Instance"

### Step 2: Connect to EC2 Instance

```bash
# Connect via SSH (replace with your key and instance details)
ssh -i "your-key.pem" ubuntu@your-ec2-public-ip

# Update system packages
sudo apt update && sudo apt upgrade -y
```

## Part 2: Install Docker and Docker Compose

### Step 1: Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker ubuntu

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Verify installation
docker --version
```

### Step 2: Install Docker Compose

```bash
# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

### Step 3: Install Additional Tools

```bash
# Install Git, curl, and other utilities
sudo apt install -y git curl htop unzip

# Install nginx (for reverse proxy)
sudo apt install -y nginx
```

## Part 3: Deploy Application

### Step 1: Clone Repository

```bash
# Clone your repository
git clone https://github.com/your-username/scalable-Hotel-Booking-Tool.git
cd scalable-Hotel-Booking-Tool/HotelBookingSystem

# Make scripts executable
chmod +x docker-start.sh
chmod +x scripts/init-database.sh
```

### Step 2: Configure Environment

```bash
# Copy and edit environment file
cp .env.development .env

# Edit environment variables for production
nano .env
```

Update the following in `.env`:

```bash
# Production Environment Variables
ASPNETCORE_ENVIRONMENT=Production

# Database Configuration (use strong password)
SQL_SERVER_PASSWORD=YourSecurePassword123!

# Frontend Configuration (use your EC2 public IP or domain)
REACT_APP_API_BASE_URL=http://your-ec2-public-ip:5000

# Security (generate strong keys)
JWT_SECRET_KEY=your-very-long-and-secure-jwt-secret-key-here
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
```

### Step 3: Start Services

```bash
# Method 1: Using the startup script
./docker-start.sh start

# Method 2: Using docker-compose directly
docker-compose up --build -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### Step 4: Verify Deployment

```bash
# Check if all containers are running
docker ps

# Test services
curl http://localhost:5000/health  # API Gateway
curl http://localhost:5003/health  # Booking Service
curl http://localhost:5005/health  # Analytics Service
curl http://localhost:3000         # Frontend
```

## Part 4: Configure Reverse Proxy (Production)

### Step 1: Configure Nginx

```bash
# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Create new configuration
sudo nano /etc/nginx/sites-available/hotel-booking
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # API Gateway
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Step 2: Enable Site and Restart Nginx

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/hotel-booking /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

## Part 5: SSL Configuration (Optional)

### Step 1: Install Certbot

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Test automatic renewal
sudo certbot renew --dry-run
```

## Part 6: Database Management

### Step 1: Access Database

```bash
# Connect to SQL Server container
docker exec -it hotel-booking-sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'HotelBooking1234!'

# Run database setup script
docker exec -it hotel-booking-sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'HotelBooking1234!' -i /scripts/complete-database-setup.sql
```

### Step 2: Backup Database

```bash
# Create backup script
nano backup-db.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/home/ubuntu/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

docker exec hotel-booking-sqlserver /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P 'HotelBooking1234!' \
  -Q "BACKUP DATABASE HotelBookingSystem TO DISK = '/tmp/hotel_booking_$DATE.bak'"

docker cp hotel-booking-sqlserver:/tmp/hotel_booking_$DATE.bak $BACKUP_DIR/
```

```bash
chmod +x backup-db.sh
./backup-db.sh
```

## Part 7: Monitoring and Maintenance

### Step 1: Setup Monitoring

```bash
# Install monitoring tools
sudo apt install -y htop iotop

# Monitor Docker containers
docker stats

# Monitor logs
docker-compose logs -f --tail=50
```

### Step 2: Create Maintenance Scripts

**System Health Check Script** (`health-check.sh`):

```bash
#!/bin/bash

echo "=== System Health Check ==="
echo "Date: $(date)"
echo ""

echo "=== Disk Usage ==="
df -h

echo ""
echo "=== Memory Usage ==="
free -h

echo ""
echo "=== Docker Containers ==="
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "=== Service Health ==="
curl -s http://localhost:5000/health && echo " - API Gateway: OK" || echo " - API Gateway: FAILED"
curl -s http://localhost:5003/health && echo " - Booking Service: OK" || echo " - Booking Service: FAILED"
curl -s http://localhost:5005/health && echo " - Analytics Service: OK" || echo " - Analytics Service: FAILED"
curl -s http://localhost:3000 > /dev/null && echo " - Frontend: OK" || echo " - Frontend: FAILED"
```

**Auto-restart Script** (`auto-restart.sh`):

```bash
#!/bin/bash

# Check if services are running and restart if needed
if ! curl -s http://localhost:5000/health > /dev/null; then
    echo "API Gateway is down, restarting..."
    docker-compose restart api-gateway
fi

if ! curl -s http://localhost:5003/health > /dev/null; then
    echo "Booking Service is down, restarting..."
    docker-compose restart booking-service
fi

if ! curl -s http://localhost:5005/health > /dev/null; then
    echo "Analytics Service is down, restarting..."
    docker-compose restart analytics-service
fi
```

### Step 3: Setup Cron Jobs

```bash
# Edit crontab
crontab -e

# Add these lines:
# Health check every 5 minutes
*/5 * * * * /home/ubuntu/scalable-Hotel-Booking-Tool/HotelBookingSystem/health-check.sh >> /var/log/health-check.log 2>&1

# Auto-restart check every 10 minutes
*/10 * * * * /home/ubuntu/scalable-Hotel-Booking-Tool/HotelBookingSystem/auto-restart.sh >> /var/log/auto-restart.log 2>&1

# Daily backup at 2 AM
0 2 * * * /home/ubuntu/scalable-Hotel-Booking-Tool/HotelBookingSystem/backup-db.sh >> /var/log/backup.log 2>&1

# Weekly system cleanup
0 3 * * 0 docker system prune -f >> /var/log/docker-cleanup.log 2>&1
```

## Part 8: Production Deployment

### Step 1: Use Production Docker Compose

```bash
# Use production configuration
docker-compose -f docker-compose.prod.yml up --build -d

# Or with environment file
docker-compose --env-file .env.production -f docker-compose.prod.yml up --build -d
```

### Step 2: Security Hardening

```bash
# Update security groups to restrict access
# Only allow necessary ports from specific IPs

# Setup firewall
sudo ufw enable
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS

# Disable unnecessary services
sudo systemctl disable snapd
sudo systemctl disable bluetooth
```

### Step 3: Performance Optimization

```bash
# Optimize Docker
echo '{"log-driver": "json-file", "log-opts": {"max-size": "10m", "max-file": "3"}}' | sudo tee /etc/docker/daemon.json
sudo systemctl restart docker

# Optimize system
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
echo 'vm.vfs_cache_pressure=50' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

## Troubleshooting

### Common Issues

1. **Services won't start**
   ```bash
   # Check logs
   docker-compose logs [service-name]
   
   # Check disk space
   df -h
   
   # Check memory
   free -h
   ```

2. **Database connection issues**
   ```bash
   # Check SQL Server container
   docker exec -it hotel-booking-sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'HotelBooking1234!' -Q "SELECT 1"
   ```

3. **Port conflicts**
   ```bash
   # Check which process is using a port
   sudo netstat -tulpn | grep :5000
   
   # Kill process if needed
   sudo kill -9 <PID>
   ```

4. **Memory issues**
   ```bash
   # Add swap space
   sudo fallocate -l 2G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
   ```

### Useful Commands

```bash
# View all container logs
docker-compose logs -f

# Restart specific service
docker-compose restart [service-name]

# Scale services
docker-compose up --scale booking-service=2 -d

# Execute command in container
docker exec -it [container-name] bash

# View container resource usage
docker stats

# Clean up unused resources
docker system prune -af
```

## Maintenance Checklist

### Daily
- [ ] Check service health
- [ ] Review error logs
- [ ] Monitor disk space
- [ ] Check database performance

### Weekly
- [ ] Update system packages
- [ ] Clean Docker images
- [ ] Review security logs
- [ ] Test backup restore

### Monthly
- [ ] Update application dependencies
- [ ] Review and rotate logs
- [ ] Security audit
- [ ] Performance optimization review

## Support and Resources

- **Application Logs**: `/var/log/hotel-booking/`
- **Docker Logs**: `docker-compose logs`
- **System Logs**: `/var/log/syslog`
- **Nginx Logs**: `/var/log/nginx/`

For additional support, check the application documentation and monitor the system regularly for optimal performance.
