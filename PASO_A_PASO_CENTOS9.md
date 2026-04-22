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
DJANGO_SECRET_KEY=una-clave-segura-y-larga
DB_USER=multisoft_user
DB_PASSWORD=tu_password_real
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
cd /opt/multisoft/multisoft_informes
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
npm install
```

## 14. Ejecutar migraciones Django

```bash
cd /opt/multisoft/multisoft_informes
source .venv/bin/activate
python manage.py migrate --noinput
python manage.py collectstatic --noinput
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
