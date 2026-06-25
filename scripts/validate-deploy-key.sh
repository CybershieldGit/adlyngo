#!/usr/bin/env bash
set -euo pipefail

# Validates VPS_SSH_KEY from GitHub Actions and writes ~/.ssh/deploy_key

if [ -z "${SSH_PRIVATE_KEY:-}" ]; then
  echo "::error::VPS_SSH_KEY is empty."
  echo "Add it under Settings → Secrets → Actions (Repository secrets)."
  echo "If using the production environment, also add it under Settings → Environments → production → Secrets."
  exit 1
fi

if echo "$SSH_PRIVATE_KEY" | grep -qE 'BEGIN (OPENSSH |RSA )?PUBLIC KEY'; then
  echo "::error::You pasted a PUBLIC key (.pub). GitHub needs the PRIVATE key file."
  echo "On the server run: bash scripts/setup-github-deploy-key.sh"
  echo "Then copy the output that starts with -----BEGIN OPENSSH PRIVATE KEY-----"
  exit 1
fi

if ! echo "$SSH_PRIVATE_KEY" | grep -qE 'BEGIN (OPENSSH |RSA )?PRIVATE KEY'; then
  echo "::error::VPS_SSH_KEY does not look like a private key."
  echo "It must start with -----BEGIN OPENSSH PRIVATE KEY----- or -----BEGIN RSA PRIVATE KEY-----"
  echo "Do NOT paste your SSH login password here."
  exit 1
fi

install -m 700 -d ~/.ssh

printf '%s' "$SSH_PRIVATE_KEY" \
  | sed 's/\\n/\n/g' \
  | tr -d '\r' \
  > ~/.ssh/deploy_key

[ -n "$(tail -c1 ~/.ssh/deploy_key 2>/dev/null || true)" ] && echo >> ~/.ssh/deploy_key

chmod 600 ~/.ssh/deploy_key

if ! ssh-keygen -y -f ~/.ssh/deploy_key > /dev/null 2>&1; then
  echo "::error::VPS_SSH_KEY could not be parsed. Re-create the secret:"
  echo "1. SSH to server: ssh root@YOUR_IP"
  echo "2. Run: bash scripts/setup-github-deploy-key.sh"
  echo "3. Copy the ENTIRE private key block into VPS_SSH_KEY (all lines)."
  exit 1
fi

echo "SSH private key is valid."
