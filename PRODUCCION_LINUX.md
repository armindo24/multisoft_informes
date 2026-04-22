# Manual de Instalacion y Produccion (Linux)

Este documento resume los requisitos y pasos para instalar y levantar `multisoft_informes` en Linux.

## 1. Arquitectura del sistema

El proyecto usa tres servicios:

1. `Django` en puerto `8000`
2. `Node.js legacy` en puerto `3000`
3. `Next.js` en puerto `3001`

Notas importantes:

- `Next.js` requiere `Node 20.19.0`
- la API legacy con `sqlanywhere` requiere `Node 12.22.12`
- por eso se recomienda `nvm`

## 2. Requisitos previos

Instalar:

1. `Python 3.10` o superior
2. `python3-venv`
3. `build-essential`
4. `git`
5. `curl`
6. `nvm`
7. `Node 12.22.12`
8. `Node 20.19.0`
9. `PostgreSQL`
10. `SQL Anywhere Client / librerias`

## 3. Instalacion base sugerida

Ejemplo Debian/Ubuntu:

```bash
sudo apt update
sudo apt install -y python3 python3-venv python3-pip build-essential git curl lsof
```

## 4. Instalar nvm y Node

Instalar `nvm`:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.nvm/nvm.sh
```

Instalar versiones requeridas:

```bash
nvm install 12.22.12
nvm install 20.19.0
```

## 5. Ubicacion sugerida del proyecto

Ejemplo:

```bash
/opt/multisoft/multisoft_informes
```

## 6. Entorno virtual Python

```bash
cd /opt/multisoft/multisoft_informes
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

## 7. Dependencias Node

### Frontend Next.js

```bash
cd frontend-next
source ~/.nvm/nvm.sh
nvm use 20.19.0
npm install
```

### API legacy

```bash
cd ../server/multisoft
source ~/.nvm/nvm.sh
nvm use 12.22.12
npm install
```

## 8. Base de datos PostgreSQL

Debes contar con:

1. host
2. puerto
3. base de datos
4. usuario
5. password

Luego ejecutar:

```bash
cd /opt/multisoft/multisoft_informes
source .venv/bin/activate
python manage.py migrate
```

## 9. SQL Anywhere

La API legacy depende del cliente y librerias de SQL Anywhere.

Debes validar:

1. librerias del cliente instaladas
2. variables de entorno si aplican
3. acceso a `integrado`
4. acceso a `sueldo`

Si el driver no coincide con la version de Node, veras errores como:

```text
Could not load modules for Platform ...
```

En ese caso confirma que la API legacy corre con `Node 12.22.12`.

## 10. Produccion con scripts

Se agregaron estos scripts:

1. [start-prod.sh](C:/Multisoft/datos/web_informe/Web_New/multisoft_informes_next_front/multisoft_informes/start-prod.sh)
2. [stop-prod.sh](C:/Multisoft/datos/web_informe/Web_New/multisoft_informes_next_front/multisoft_informes/stop-prod.sh)

## 11. Que hace `start-prod.sh`

1. activa `venv` o `.venv`
2. carga `nvm`
3. ejecuta migraciones con `multisoft_informes.settings.production`
4. compila Next.js con `npm run build`
5. levanta en background:
   - Django `8000`
   - Next.js `3001`
   - Node API `3000`
6. guarda PIDs en `.multisoft-prod.pids`
7. deja logs en:
   - `django-prod.log`
   - `next-prod.log`
   - `node-prod.log`

Uso:

```bash
chmod +x start-prod.sh stop-prod.sh
./start-prod.sh
```

Para detener:

```bash
./stop-prod.sh
```

## 12. Que genera Next.js en produccion

Cuando ejecutas:

```bash
cd frontend-next
npm run build
```

Next.js genera:

```bash
frontend-next/.next
```

Luego se sirve con:

```bash
npm run start
```

## 13. Recomendacion de produccion real en Linux

Para un servidor estable te recomiendo:

1. `systemd` para Django, Next.js y Node API
2. `gunicorn` para Django
3. `nginx` o `caddy` como reverse proxy
4. `pm2` como alternativa para Node/Next

## 14. Puertos

1. `8000` Django
2. `3001` Next.js
3. `3000` Node API

Abrir firewall si aplica:

```bash
sudo ufw allow 8000/tcp
sudo ufw allow 3001/tcp
sudo ufw allow 3000/tcp
```

## 15. Checklist rapido

1. Instalar Python
2. Instalar nvm
3. Instalar Node `12.22.12`
4. Instalar Node `20.19.0`
5. Instalar PostgreSQL
6. Instalar cliente SQL Anywhere
7. Crear `.venv`
8. Instalar `requirements.txt`
9. Instalar dependencias Node del frontend
10. Instalar dependencias Node del backend legacy
11. Configurar PostgreSQL
12. Configurar SQL Anywhere
13. Ejecutar migraciones
14. Probar `./start-prod.sh`
15. Probar `./stop-prod.sh`

## 16. URLs esperadas

1. Frontend: `http://localhost:3001`
2. Django: `http://localhost:8000`
3. API legacy: `http://localhost:3000`

## 17. Siguiente mejora recomendada

Si quieres, despues te puedo dejar tambien:

1. archivos `systemd`
2. configuracion `nginx`
3. configuracion `caddy`
4. despliegue con `pm2`
