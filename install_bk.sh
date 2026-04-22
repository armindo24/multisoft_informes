#!/bin/bash

echo "Iniciando entorno WEBAPP..."

# Activar entorno virtual
if [ -d "venv" ]; then
  echo "Activando entorno virtual..."
  source venv/bin/activate
else
  echo "Entorno virtual no encontrado. Creando..."
  python3 -m venv venv
  source venv/bin/activate
  pip3 install -r requirements.txt
fi

# Instalar dependencias Node
echo "Verificando dependencias de Node.js..."
cd server
if [ ! -d "node_modules" ]; then
  npm install
fi

# Iniciar servidor Node
echo "Iniciando servidor Node..."
node app.js &
NODE_PID=$!
cd ..

# Verificar servicios necesarios
echo "Verificando servicios..."

sudo systemctl start redis
sudo systemctl start nginx
sudo systemctl start gunicorn

# Iniciar Django en modo desarrollo
echo "Iniciando Django en http://127.0.0.1:8000"
python manage.py runserver

# Al cerrar Django, matamos el proceso Node
echo "Deteniendo servidor Node..."
kill $NODE_PID

