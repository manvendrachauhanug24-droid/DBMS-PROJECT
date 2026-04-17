#!/bin/bash
# Auto-initialize the SQLite database if it doesn't exist, then start PHP server
echo "Checking database..."
if [ ! -f "nsut_attendance.db" ]; then
    echo "Initializing database..."
    php init_database.php
fi
echo "Starting PHP server on port ${PORT:-8000}..."
php -S 0.0.0.0:${PORT:-8000} -t .
