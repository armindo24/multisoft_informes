#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$ROOT/frontend-next"
SERVER_DIR="$ROOT/server/multisoft"
REQ_FILE="$ROOT/requirements.txt"

echo "========================================"
echo "Instalacion automatica - Multisoft"
echo "========================================"
echo

if ! command -v python3 >/dev/null 2>&1; then
  echo "ERROR: no se encontro python3"
  exit 1
fi

if [[ -s "$HOME/.nvm/nvm.sh" ]]; then
  # shellcheck disable=SC1090
  source "$HOME/.nvm/nvm.sh"
elif [[ -n "${NVM_DIR:-}" && -s "$NVM_DIR/nvm.sh" ]]; then
  # shellcheck disable=SC1090
  source "$NVM_DIR/nvm.sh"
else
  echo "ERROR: no se encontro nvm. Instala nvm antes de continuar."
  exit 1
fi

echo "[1/7] Verificando Python..."
python3 --version

echo "[2/7] Instalando versiones de Node requeridas..."
nvm install 12.22.12
nvm install 20.19.0

echo "[3/7] Creando entorno virtual Python..."
if [[ ! -d "$ROOT/.venv" ]]; then
  python3 -m venv "$ROOT/.venv"
fi

# shellcheck disable=SC1091
source "$ROOT/.venv/bin/activate"

echo "[4/7] Instalando dependencias Python..."
python -m pip install --upgrade pip
pip install -r "$REQ_FILE"

echo "[5/7] Instalando dependencias Node del frontend..."
cd "$FRONTEND_DIR"
nvm use 20.19.0 >/dev/null
npm install

echo "[6/7] Instalando dependencias Node de la API legacy..."
cd "$SERVER_DIR"
nvm use 12.22.12 >/dev/null
npm install

echo "[7/7] Ejecutando migraciones y build..."
cd "$ROOT"
python manage.py migrate --noinput
cd "$FRONTEND_DIR"
nvm use 20.19.0 >/dev/null
npm run build

echo
echo "========================================"
echo "Instalacion finalizada"
echo "========================================"
echo
echo "Siguientes pasos recomendados:"
echo "  1. Revisar PRODUCCION_LINUX.md"
echo "  2. Configurar PostgreSQL y SQL Anywhere"
echo "  3. chmod +x start-prod.sh stop-prod.sh"
echo "  4. Probar ./start-prod.sh"
