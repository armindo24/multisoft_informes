#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_FILE="$ROOT/.multisoft-prod.pids"

stop_pid() {
  local name="$1"
  local pid="$2"
  if kill -0 "$pid" 2>/dev/null; then
    kill "$pid" 2>/dev/null || true
    sleep 1
    kill -9 "$pid" 2>/dev/null || true
    echo "Detenido $name (PID $pid)"
  else
    echo "$name (PID $pid) ya no estaba ejecutandose"
  fi
}

echo "========================================"
echo "Deteniendo Multisoft en modo produccion"
echo "========================================"
echo

if [[ -f "$PID_FILE" ]]; then
  # shellcheck disable=SC1090
  source "$PID_FILE"
  [[ -n "${DJANGO_PID:-}" ]] && stop_pid "Django" "$DJANGO_PID"
  [[ -n "${NEXT_PID:-}" ]] && stop_pid "Next.js" "$NEXT_PID"
  [[ -n "${NODE_PID:-}" ]] && stop_pid "Node API" "$NODE_PID"
  rm -f "$PID_FILE"
else
  echo "No se encontro archivo PID. Intentando detener por puertos..."
  for port in 8000 3001 3000; do
    pids="$(lsof -t -i :"$port" 2>/dev/null || true)"
    if [[ -n "$pids" ]]; then
      for pid in $pids; do
        stop_pid "puerto-$port" "$pid"
      done
    fi
  done
fi

echo
echo "Proceso de detencion finalizado"
