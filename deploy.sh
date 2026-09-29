#!/usr/bin/env bash
# Template deploy script - fill USER, SERVER and DOMAIN_PATH before running
USER=your_ssh_user
SERVER=yourserver.example.com
REMOTE_PATH=/home/$USER/domains/yourdomain.net/public_html

if [ "$USER" = "your_ssh_user" ]; then
  echo "Edit this script and set USER, SERVER and REMOTE_PATH before running."
  exit 1
fi

# backup remote files
ssh $USER@$SERVER "mkdir -p $REMOTE_PATH && cd $REMOTE_PATH && mkdir -p ../backup_$(date +%F_%T) && mv * ../backup_$(date +%F_%T)/ || true"

# upload dist
rsync -av --delete dist/ $USER@$SERVER:$REMOTE_PATH/
# ensure .htaccess
scp .htaccess $USER@$SERVER:$REMOTE_PATH/.htaccess

# set permissions
ssh $USER@$SERVER "cd $REMOTE_PATH && find . -type d -exec chmod 755 {} \; && find . -type f -exec chmod 644 {} \;"

echo "Deploy finished. Verify https://yourdomain.net/"
