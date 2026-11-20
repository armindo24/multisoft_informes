# Paso a Paso CentOS 9

Guia corta para instalar `multisoft_informes` desde GitHub en un servidor CentOS 9.

## 1. Entrar como root

```bash
sudo -i
```

## 2. Instalar paquetes base

```bash
dnf update -y
dnf install -y git curl wget tar gcc gcc-c++ make openssl-devel bzip2-devel libffi-devel zlib-devel sqlite-devel postgresql postgresql-server postgresql-devel
```

## 3. Crear usuario de trabajo

```bash
useradd -m -s /bin/bash multisoft
passwd multisoft
mkdir -p /opt/multisoft
chown -R multisoft:multisoft /opt/multisoft
chown -R multisoft:multisoft /home/multisoft
```

## 4. Entrar con el usuario multisoft

```bash
su - multisoft
```

## 5. Clonar el proyecto

```bash
cd /opt/multisoft
git clone https://github.com/armindo24/multisoft_informes.git
cd multisoft_informes
```

## 6. Crear archivo de variables

```bash
cp .envariables.example .envariables
nano .envariables
```


Ejemplo basico:

```env
DJANGO_SECRET_KEY=reemplazar-por-una-clave-segura-y-larga
DB_USER=multisoft_user
DB_PASSWORD=REEMPLAZAR_PASSWORD
REDIS_SOCK=/var/run/redis/redis.sock
# Ejemplo de configuracion (reemplazar los valores antes de usar)
DJANGO_SECRET_KEY=reemplazar-por-una-clave-segura-y-larga
DB_NAME=multisoft_informes
DB_USER=multisoft_user
DB_PASSWORD=REEMPLAZAR_PASSWORD
DB_HOST=localhost
DB_PORT=5432
REDIS_SOCK=/var/run/redis/redis.sock

```

## 7. Instalar NVM

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

Cargar NVM en la sesion actual:

```bash
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"
```

## 8. Instalar Node.js 20

```bash
nvm install 20
nvm use 20
node -v
npm -v
```

## 9. Verificar Python recomendado

```bash
python3.9 --version
```

Si responde con version, crear entorno virtual:

```bash
cd /opt/multisoft/multisoft_informes
python3.9 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip setuptools wheel
```

Si `python3.9` no existe, instalalo antes de continuar.

## 10. Instalar dependencias Python

```bash
cd /opt/multisoft/multisoft_informes
source .venv/bin/activate
pip install -r requirements.txt
pip install requests xlrd openpyxl
```

## 11. Instalar dependencias Node en la raiz

```bash
Tiene que tener instalado el sqlanywhere12 >ASA12


cd /opt/multisoft/multisoft_informes
cd frontend-next
source /home/multisoft/.nvm/nvm.sh
nvm use 20.20.2
npm install
```

## 12. Instalar dependencias del frontend Next.js

```bash
cd /opt/multisoft/multisoft_informes/frontend-next
npm install
npm run build
```

## 13. Instalar dependencias de la API Node legacy

```bash
cd /opt/multisoft/multisoft_informes/server/multisoft
source /home/multisoft/.nvm/nvm.sh
nvm install 12.22.12
nvm use 12.22.12
npm install --unsafe-perm
--entrar como root y ejecutar: /// importante
dnf groupinstall -y "Development Tools"
--Después volver como multisoft:
nvm use 12.22.12
npm install
```

## 14. Ejecutar migraciones Django

```bash
-- configurar Postgresql
postgresql-setup --initdb
systemctl start postgresql
systemctl enable postgresql
--) Base de datos Postgres (Django)
sudo -u postgres psql
postgres= CREATE DATABASE multisoft_informes;
postgres= CREATE USER multisoft_user WITH PASSWORD 'REEMPLAZAR_PASSWORD';
postgres= ALTER ROLE multisoft_user SET client_encoding TO 'utf8';
postgres= ALTER ROLE multisoft_user SET default_transaction_isolation TO 'read committed';
postgres= ALTER ROLE multisoft_user SET timezone TO 'America/Asuncion';
postgres= GRANT ALL PRIVILEGES ON DATABASE multisoft_informes TO multisoft_user;
ALTER USER postgres WITH PASSWORD 'REEMPLAZAR_PASSWORD_POSTGRES';
vim  /var/lib/pgsql/data/pg_hba.conf /// md5 a las conexiones

-- con el usuario su - multisoft
cd /opt/multisoft/multisoft_informes
source .venv/bin/activate
python manage.py migrate --noinput
--python manage.py collectstatic --noinput
```

## 15. Crear superusuario Django

```bash
cd /opt/multisoft/multisoft_informes
source .venv/bin/activate
python manage.py createsuperuser
```

## 16. Probar Django manualmente

```bash
cd /opt/multisoft/multisoft_informes
source .venv/bin/activate
python manage.py runserver 0.0.0.0:8000
```

## 17. Probar frontend Next.js manualmente

```bash
cd /opt/multisoft/multisoft_informes/frontend-next
npm run start
```

## 18. Probar API Node legacy manualmente

-- copiar los archivos
cp /opt/multisoft/multisoft_informes/deploy/systemd/centos9/multisoft-django.service /etc/systemd/system/
cp /opt/multisoft/multisoft_informes/deploy/systemd/centos9/multisoft-next.service /etc/systemd/system/
cp /opt/multisoft/multisoft_informes/deploy/systemd/centos9/multisoft-node-api.service /etc/systemd/system
systemctl daemon-reload

vim /etc/systemd/system/multisoft-node-api.service -- revisar en "production" tiene que ser "development"

```bash
cd /opt/multisoft/multisoft_informes/server/multisoft
npm start
```

## 19. Actualizar el proyecto despues

```bash
cd /opt/multisoft/multisoft_informes
git pull
source .venv/bin/activate
pip install -r requirements.txt
cd frontend-next && npm install && npm run build
cd ../server/multisoft && npm install
cd ../..
python manage.py migrate --noinput
python manage.py collectstatic --noinput
```

## 20. Si algo falla con Python 3.6

No uses Python 3.6 para este proyecto si puedes evitarlo. Si ves errores de modulos o compatibilidad, recrea el entorno con Python 3.9:

```bash
cd /opt/multisoft/multisoft_informes
rm -rf .venv
python3.9 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
pip install requests xlrd openpyxl
```

## 21. Si ya existe el proyecto en el servidor

```bash
cd /opt/multisoft/multisoft_informes
git pull
```

Y luego:

```bash
source .venv/bin/activate
pip install -r requirements.txt
cd frontend-next && npm install && npm run build
cd ../server/multisoft && npm install
cd ../..
python manage.py migrate --noinput
python manage.py collectstatic --noinput
```
