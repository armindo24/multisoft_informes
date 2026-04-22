#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cleanup() {
  if [[ -n "${DJANGO_PID:-}" ]]; then
    kill "$DJANGO_PID" 2>/dev/null || true
  fi
  if [[ -n "${NODE_PID:-}" ]]; then
    kill "$NODE_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT

cd "$ROOT"
if [[ -f ".venv/bin/activate" ]]; then
  # shellcheck disable=SC1091
  source ".venv/bin/activate"
fi

python manage.py runserver 0.0.0.0:8000 &
DJANGO_PID=$!

cd "$ROOT/server/multisoft"
node ./bin/www &
NODE_PID=$!

echo "Django PID: $DJANGO_PID"
echo "Node   PID: $NODE_PID"
wait
