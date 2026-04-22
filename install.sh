#!/bin/bash

echo "🚀 Iniciando entorno WEBAPP  Backend..."

# Activar o crear entorno virtual
if [ -d "venv" ]; then
  echo "✅ Activando entorno virtual existente..."
  source venv/bin/activate
else
  echo "📦 Entorno virtual no encontrado. Creando..."
  python3.7 -m venv venv
  source venv/bin/activate
  pip install --upgrade pip
fi

# Instalar dependencias Python
echo "📦 Instalando dependencias de Python..."
pip install -r requirements.txt

# Verificar e instalar Redis si es necesario
if ! command -v redis-server &> /dev/null; then
  echo "⚠️ Redis no está instalado. Intentando instalar..."
  if [ -x "$(command -v apt)" ]; then
    sudo apt update && sudo apt install redis-server -y
  elif [ -x "$(command -v yum)" ]; then
    sudo yum install epel-release -y
    sudo yum install redis -y
  else
    echo "❌ No se pudo instalar Redis automáticamente."
  fi
else
  echo "✅ Redis ya está instalado."
fi

echo "▶️ Iniciando Redis..."
sudo systemctl start redis || echo "⚠️ Redis no pudo iniciarse (puede que no sea necesario)."

# Migraciones y superusuario
echo "🔧 Ejecutando migraciones..."
python manage.py makemigrations
python manage.py migrate

echo "👤 Crear superusuario (Ctrl+C para omitir)..."
python manage.py createsuperuser

# Iniciar servidor
echo "🚀 Iniciando servidor Django en http://127.0.0.1:8000 ..."
python manage.py runserver

