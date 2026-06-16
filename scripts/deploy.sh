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

NGINX_CONF="/www/server/panel/vhost/nginx/admin.adlyngo.com.conf"
if [ -f "$NGINX_CONF" ] && ! grep -qE 'client_max_body_size[[:space:]]+250[Mm]' "$NGINX_CONF"; then
  echo ""
  echo "!! WARNING: Nginx upload limit is NOT set to 250M"
  echo "   Large reel uploads will fail with 413 on production."
  echo "   Run on the VPS: bash scripts/fix-nginx-upload-limit.sh admin.adlyngo.com 250M"
  echo ""
fi

echo "==> Backend deploy complete"
