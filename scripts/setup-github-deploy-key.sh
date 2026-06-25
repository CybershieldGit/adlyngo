#!/usr/bin/env bash
set -euo pipefail

# One-time: create SSH key for GitHub Actions deploy.
# Run on VPS as root: bash scripts/setup-github-deploy-key.sh

KEY_PATH="${KEY_PATH:-/root/.ssh/github_actions_deploy}"

if [ -f "$KEY_PATH" ]; then
  echo "Key already exists at $KEY_PATH"
else
  echo "==> Generating deploy key (no passphrase)"
  ssh-keygen -t ed25519 -C "github-actions-deploy" -f "$KEY_PATH" -N ""
fi

mkdir -p /root/.ssh
chmod 700 /root/.ssh
touch /root/.ssh/authorized_keys
chmod 600 /root/.ssh/authorized_keys

if ! grep -qF "$(cat "${KEY_PATH}.pub")" /root/.ssh/authorized_keys 2>/dev/null; then
  cat "${KEY_PATH}.pub" >> /root/.ssh/authorized_keys
  echo "==> Public key added to /root/.ssh/authorized_keys"
else
  echo "==> Public key already in authorized_keys"
fi

echo ""
echo "=========================================="
echo "Copy EVERYTHING below into GitHub secret:"
echo "  Name: VPS_SSH_KEY"
echo "  Location: Repository secrets AND/OR"
echo "            Settings → Environments → production → Secrets"
echo "=========================================="
cat "$KEY_PATH"
echo "=========================================="
echo ""
echo "Also set these secrets:"
echo "  VPS_HOST     = your server IP"
echo "  VPS_USER     = root"
echo "  VPS_FRONTEND_PATH = /www/wwwroot/frontend"
echo "  VPS_BACKEND_PATH  = /www/wwwroot/backend"
