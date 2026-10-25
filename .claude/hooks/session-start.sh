#!/bin/bash
# Prepares a Claude Code cloud session: installs the Node.js version from .nvmrc and npm dependencies.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# nvm is not compatible with `set -eu`, so it runs with both turned off.
export NVM_DIR="${NVM_DIR:-/opt/nvm}"
set +eu
. "$NVM_DIR/nvm.sh"
nvm install --no-progress "$(cat .nvmrc)"
node_bin="$(dirname "$(nvm which "$(cat .nvmrc)")")"
set -eu

export PATH="$node_bin:$PATH"
echo "export PATH=\"$node_bin:\$PATH\"" >> "$CLAUDE_ENV_FILE"

npm install --no-save --no-audit --no-fund
