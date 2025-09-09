#!/bin/bash

# Directory to backup
SOURCE_DIR="$HOME/Documents/30DaysBackendChallenge/data"

# Backup destination
BACKUP_DIR="$HOME/Documents/30DaysBackendChallenge/backups"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Backup filename with timestamp
BACKUP_FILE="$BACKUP_DIR/backup_$(date +'%Y%m%d_%H%M%S').tar.gz"

# Check if source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
  echo "Error: Source directory '$SOURCE_DIR' does not exist."
  exit 1
fi

# Create the backup
tar -czf "$BACKUP_FILE" -C "$SOURCE_DIR" .

echo "Backup completed: $BACKUP_FILE"
