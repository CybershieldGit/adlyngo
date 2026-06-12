#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$APP_DIR"

echo "==> Deploying backend from $APP_DIR"

git fetch origin
git reset --hard "origin/${DEPLOY_BRANCH:-main}"

npm install
npm run build

UPLOAD_ROOT="${UPLOAD_ROOT:-/www/wwwroot/uploads}"
APP_USER="${APP_USER:-www}"
mkdir -p "$UPLOAD_ROOT/images" "$UPLOAD_ROOT/videos"
chown -R "$APP_USER:$APP_USER" "$UPLOAD_ROOT" 2>/dev/null || true
chmod -R 755 "$UPLOAD_ROOT"

if pm2 describe backend >/dev/null 2>&1; then
  pm2 reload ecosystem.config.cjs --update-env
else
  pm2 start ecosystem.config.cjs
fi

pm2 save
echo "==> Backend deploy complete"
