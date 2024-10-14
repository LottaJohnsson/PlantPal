#!/bin/bash

# Define variables
ROOT_PASSWORD="StrongPassword123!"
DB_USER="plantpal"
DB_PASSWORD="StrongPassword123!"
DB_NAME="plantpalDB"

# Install MySQL using Homebrew
echo "Installing MySQL..."
brew install mysql

# Start MySQL services
echo "Starting MySQL services..."
brew services start mysql

# Wait for MySQL to start
sleep 5

# Run MySQL secure installation commands
echo "Securing MySQL installation..."
mysql -u root <<EOF
ALTER USER 'root'@'localhost' IDENTIFIED BY '${ROOT_PASSWORD}';
DELETE FROM mysql.user WHERE User='';
DROP DATABASE IF EXISTS test;
DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%';
FLUSH PRIVILEGES;
EOF

# Set up the database and user
echo "Setting up database and user..."
mysql -u root -p${ROOT_PASSWORD} <<EOF
CREATE USER '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
CREATE DATABASE ${DB_NAME};
EOF

echo "MySQL setup completed."