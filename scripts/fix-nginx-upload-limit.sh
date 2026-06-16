#!/usr/bin/env bash
# Run on the VPS as root to allow large reel uploads through Nginx.
# Usage: bash scripts/fix-nginx-upload-limit.sh [domain] [limit]
# Example: bash scripts/fix-nginx-upload-limit.sh admin.adlyngo.com 250M

set -euo pipefail

DOMAIN="${1:-admin.adlyngo.com}"
LIMIT="${2:-250M}"

find_nginx_conf() {
  local candidates=(
    "/www/server/panel/vhost/nginx/${DOMAIN}.conf"
    "/www/server/panel/vhost/nginx/${DOMAIN}_ssl.conf"
    "/etc/nginx/sites-available/${DOMAIN}"
    "/etc/nginx/conf.d/${DOMAIN}.conf"
  )
  for f in "${candidates[@]}"; do
    if [ -f "$f" ]; then
      echo "$f"
      return 0
    fi
  done
  return 1
}

CONF="$(find_nginx_conf)" || {
  echo "ERROR: Could not find Nginx vhost for ${DOMAIN}"
  echo "Add this line manually inside the server { } block:"
  echo "    client_max_body_size ${LIMIT};"
  exit 1
}

echo "==> Using config: $CONF"
cp "$CONF" "${CONF}.bak.$(date +%Y%m%d%H%M%S)"

if grep -q 'client_max_body_size' "$CONF"; then
  sed -i "s/client_max_body_size[^;]*;/client_max_body_size ${LIMIT};/" "$CONF"
  echo "==> Updated existing client_max_body_size to ${LIMIT}"
else
  sed -i "/^[[:space:]]*server[[:space:]]*{/a\\    client_max_body_size ${LIMIT};" "$CONF"
  echo "==> Added client_max_body_size ${LIMIT}"
fi

# Ensure proxy timeouts for large uploads (if proxy_pass is used)
if grep -q 'proxy_pass' "$CONF" && ! grep -q 'proxy_read_timeout' "$CONF"; then
  sed -i "/proxy_pass/i\\        proxy_connect_timeout 300s;\\n        proxy_send_timeout 300s;\\n        proxy_read_timeout 300s;\\n        send_timeout 300s;" "$CONF" 2>/dev/null || true
fi

if nginx -t; then
  nginx -s reload || systemctl reload nginx
  echo "==> Nginx reloaded. Upload limit is now ${LIMIT} for ${DOMAIN}"
else
  echo "ERROR: nginx -t failed. Restoring backup may be required."
  exit 1
fi

grep 'client_max_body_size' "$CONF"
