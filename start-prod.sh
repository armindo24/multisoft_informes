#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_FILE="$ROOT/.multisoft-prod.pids"
FRONTEND_DIR="$ROOT/frontend-next"
SERVER_DIR="$ROOT/server/multisoft"
VENV_ACTIVATE=""

if [[ -f "$ROOT/venv/bin/activate" ]]; then
  VENV_ACTIVATE="$ROOT/venv/bin/activate"
elif [[ -f "$ROOT/.venv/bin/activate" ]]; then
  VENV_ACTIVATE="$ROOT/.venv/bin/activate"
fi

if [[ -z "$VENV_ACTIVATE" ]]; then
  echo "ERROR: no se encontro entorno virtual en venv/ ni .venv/"
  exit 1
fi

if [[ -s "$HOME/.nvm/nvm.sh" ]]; then
  # shellcheck disable=SC1090
  source "$HOME/.nvm/nvm.sh"
elif [[ -n "${NVM_DIR:-}" && -s "$NVM_DIR/nvm.sh" ]]; then
  # shellcheck disable=SC1090
  source "$NVM_DIR/nvm.sh"
else
  echo "ERROR: no se encontro nvm. Carga nvm antes de ejecutar este script."
  exit 1
fi

echo "========================================"
echo "Iniciando Multisoft en modo produccion"
echo "========================================"
echo

cd "$ROOT"
# shellcheck disable=SC1090
source "$VENV_ACTIVATE"

echo "[1/4] Ejecutando migraciones Django..."
DJANGO_SETTINGS_MODULE=multisoft_informes.settings.production python manage.py migrate --noinput

echo "[2/4] Compilando frontend Next.js..."
cd "$FRONTEND_DIR"
nvm use 20.19.0 >/dev/null
npm run build

echo "[3/4] Levantando servicios..."

cd "$ROOT"
nohup env DJANGO_SETTINGS_MODULE=multisoft_informes.settings.production python manage.py runserver 0.0.0.0:8000 > "$ROOT/django-prod.log" 2>&1 &
DJANGO_PID=$!

cd "$FRONTEND_DIR"
nvm use 20.19.0 >/dev/null
nohup npm run start > "$ROOT/next-prod.log" 2>&1 &
NEXT_PID=$!

cd "$SERVER_DIR"
nvm use 12.22.12 >/dev/null
nohup node ./bin/www > "$ROOT/node-prod.log" 2>&1 &
NODE_PID=$!

cat > "$PID_FILE" <<EOF
DJANGO_PID=$DJANGO_PID
NEXT_PID=$NEXT_PID
NODE_PID=$NODE_PID
EOF

echo "[4/4] Servicios iniciados"
echo
echo "URLs de acceso:"
echo "  Django API:  http://localhost:8000"
echo "  Next.js:     http://localhost:3001"
echo "  Node.js API: http://localhost:3000"
echo
echo "PIDs:"
echo "  Django:   $DJANGO_PID"
echo "  Next.js:  $NEXT_PID"
echo "  Node API: $NODE_PID"
echo
echo "Archivo PID: $PID_FILE"
echo "Logs:"
echo "  $ROOT/django-prod.log"
echo "  $ROOT/next-prod.log"
echo "  $ROOT/node-prod.log"
