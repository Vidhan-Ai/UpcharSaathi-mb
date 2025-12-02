#!/bin/bash
# Backup Script

TIMESTAMP=$(date +%Y%m%d%H%M%S)
BACKUP_DIR="./backups"
mkdir -p $BACKUP_DIR

echo "Backing up database..."
docker-compose exec -T postgres pg_dump -U postgres upcharsaathi > "$BACKUP_DIR/db_backup_$TIMESTAMP.sql"

echo "Backup created at $BACKUP_DIR/db_backup_$TIMESTAMP.sql"
