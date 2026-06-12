#!/usr/bin/env bash
set -euo pipefail

# One-time VPS setup for the backend (run as root on Hostinger KVM)
# Usage: bash server-setup.sh

DEPLOY_DIR="${DEPLOY_DIR:-/www/wwwroot/backend}"
REPO_URL="${REPO_URL:-https://github.com/CybershieldGit/adlyngo.git}"
DEPLOY_BRANCH="${DEPLOY_BRANCH:-main}"

if [ -n "${GITHUB_TOKEN:-}" ]; then
  REPO_URL="https://${GITHUB_TOKEN}@github.com/CybershieldGit/adlyngo.git"
fi

echo "==> Installing Node.js 20 and PM2"
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

npm install -g pm2
pm2 startup systemd -u root --hp /root
pm2 save

echo "==> Cloning backend repo to $DEPLOY_DIR"
mkdir -p "$(dirname "$DEPLOY_DIR")"
if [ ! -d "$DEPLOY_DIR/.git" ]; then
  git clone --branch "$DEPLOY_BRANCH" "$REPO_URL" "$DEPLOY_DIR"
fi

cd "$DEPLOY_DIR"
chmod +x scripts/deploy.sh

if [ ! -f .env ]; then
  echo "!! Create $DEPLOY_DIR/.env before the first deploy"
  echo "   Required: MONGODB_URI, JWT_SECRET, COOKIE_SECRET, CLOUDINARY_*, CLIENT_URL, PORT=3001"
fi

echo "==> Backend server setup complete"
echo "    Next: add GitHub Actions secrets, push to main, or run: bash scripts/deploy.sh"
