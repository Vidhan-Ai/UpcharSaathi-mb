#!/bin/bash
# Restore Script

if [ -z "$1" ]; then
  echo "Usage: ./restore.sh <backup_file>"
  exit 1
fi

BACKUP_FILE=$1

echo "Restoring database from $BACKUP_FILE..."
cat $BACKUP_FILE | docker-compose exec -T postgres psql -U postgres -d upcharsaathi

echo "Restore complete."
