#!/bin/bash

# Create SSL directory
mkdir -p ssl

# Generate private key
openssl genrsa -out ssl/server.key 2048

# Generate certificate signing request
openssl req -new -key ssl/server.key -out ssl/server.csr -subj "/C=US/ST=State/L=City/O=Organization/OU=OrgUnit/CN=172.214.136.108"

# Generate self-signed certificate (valid for 365 days)
openssl x509 -req -days 365 -in ssl/server.csr -signkey ssl/server.key -out ssl/server.crt

# Set proper permissions
chmod 600 ssl/server.key
chmod 644 ssl/server.crt

# Clean up CSR file
rm ssl/server.csr

echo "SSL certificates generated successfully!"
echo "Certificate: ssl/server.crt"
echo "Private Key: ssl/server.key"
echo ""
echo "Note: This is a self-signed certificate for development/testing."
echo "For production, use certificates from a trusted CA or Let's Encrypt."
