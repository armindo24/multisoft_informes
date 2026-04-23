# Despliegue en CentOS 9

Esta guia deja `multisoft_informes` funcionando en `CentOS 9` con:

1. `Django` por `gunicorn`
2. `Next.js` en modo produccion
3. `Node API legacy`
4. `nginx` como reverse proxy
5. `systemd` para arranque automatico

## 1. Paquetes base

```bash
sudo dnf update -y
sudo dnf install -y git curl nginx python3 python3-pip gcc gcc-c++ make lsof
```

Si necesitas entorno virtual:

```bash
sudo dnf install -y python3-devel
```

## 2. Crear usuario de servicio

```bash
sudo useradd -m -s /bin/bash multisoft
sudo passwd multisoft
```

## 3. Copiar proyecto

Ruta sugerida:

```bash
sudo mkdir -p /opt/multisoft
sudo chown -R multisoft:multisoft /opt/multisoft
```

Luego copiar el proyecto a:

```bash
/opt/multisoft/multisoft_informes
```

## 4. Instalar nvm y Node para el usuario

Entrar con el usuario:

```bash
sudo su - multisoft
```

Instalar `nvm`:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.nvm/nvm.sh
```

Instalar Node:

```bash
nvm install 12.22.12
nvm install 20.19.0
```

## 5. Instalar dependencias del proyecto

```bash
cd /opt/multisoft/multisoft_informes
chmod +x install-linux.sh start-prod.sh stop-prod.sh
./install-linux.sh
```

## 6. Verificar base de datos

Antes de seguir, confirmar:

1. configuracion PostgreSQL de Django
2. configuracion SQL Anywhere de `integrado`
3. configuracion SQL Anywhere de `sueldo`
4. SMTP si usaras recuperacion de password

## 7. Probar arranque manual

```bash
cd /opt/multisoft/multisoft_informes
./start-prod.sh
```

Probar:

1. `http://IP_DEL_SERVIDOR:3001`
2. `http://IP_DEL_SERVIDOR:8000`
3. `http://IP_DEL_SERVIDOR:3000`

Luego detener:

```bash
./stop-prod.sh
```

## 8. Configurar systemd

Copiar servicios:

```bash
sudo cp deploy/systemd/centos9/multisoft-django.service /etc/systemd/system/
sudo cp deploy/systemd/centos9/multisoft-next.service /etc/systemd/system/
sudo cp deploy/systemd/centos9/multisoft-node-api.service /etc/systemd/system/
```

Recargar:

```bash
sudo systemctl daemon-reload
```

Habilitar:

```bash
sudo systemctl enable multisoft-django
sudo systemctl enable multisoft-next
sudo systemctl enable multisoft-node-api
```

Iniciar:

```bash
sudo systemctl start multisoft-django
sudo systemctl start multisoft-next
sudo systemctl start multisoft-node-api
```

Ver estado:

```bash
sudo systemctl status multisoft-django
sudo systemctl status multisoft-next
sudo systemctl status multisoft-node-api
```

Logs:

```bash
sudo journalctl -u multisoft-django -f
sudo journalctl -u multisoft-next -f
sudo journalctl -u multisoft-node-api -f
```

## 9. Configurar nginx

Instalar si aun no esta:

```bash
sudo dnf install -y nginx
```

Copiar config:

```bash
sudo cp deploy/nginx/centos9/multisoft.conf /etc/nginx/conf.d/multisoft.conf
```

Crear carpeta publica para logos y favicons del cliente:

```bash
sudo mkdir -p /opt/multisoft/assets
sudo chown -R multisoft:multisoft /opt/multisoft/assets
sudo chmod 755 /opt/multisoft/assets
```

Copiar archivos, por ejemplo:

```bash
cp logo-cliente.png /opt/multisoft/assets/
cp favicon-cliente.ico /opt/multisoft/assets/
```

Las URLs quedaran asi:

```text
http://IP_DEL_SERVIDOR/assets/logo-cliente.png
http://IP_DEL_SERVIDOR/assets/favicon-cliente.ico
```

Validar:

```bash
sudo nginx -t
```

Iniciar y habilitar:

```bash
sudo systemctl enable nginx
sudo systemctl restart nginx
```

Luego en `Configuracion > Marca Corporativa` puedes pegar:

```text
URL de logo
http://IP_DEL_SERVIDOR/assets/logo-cliente.png

URL de favicon
http://IP_DEL_SERVIDOR/assets/favicon-cliente.ico
```

## 10. Firewall

Abrir HTTP:

```bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --reload
```

Si quieres probar puertos internos temporalmente:

```bash
sudo firewall-cmd --permanent --add-port=8000/tcp
sudo firewall-cmd --permanent --add-port=3001/tcp
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload
```

Luego idealmente dejas expuesto solo `80` o `443`.

## 11. SELinux

Si `nginx` no puede conectar a los puertos internos:

```bash
sudo setsebool -P httpd_can_network_connect 1
```

## 12. HTTPS

Si luego vas a publicar con dominio, lo ideal es agregar:

1. `certbot`
2. certificado SSL
3. redireccion `80 -> 443`

## 13. Build de Next.js

Cuando quieras regenerar el frontend:

```bash
cd /opt/multisoft/multisoft_informes/frontend-next
source /home/multisoft/.nvm/nvm.sh
nvm use 20.19.0
npm run build
sudo systemctl restart multisoft-next
```

El servicio de Next necesita variables `AUTH_DB_*` para validar el login contra PostgreSQL. Revisa `/etc/systemd/system/multisoft-next.service` y confirma:

```ini
Environment=AUTH_DB_HOST=localhost
Environment=AUTH_DB_PORT=5432
Environment=AUTH_DB_NAME=multisoft_informes
Environment=AUTH_DB_USER=multisoft_user
Environment=AUTH_DB_PASSWORD=Socio123!
```

Si cambias estos valores:

```bash
sudo systemctl daemon-reload
sudo systemctl restart multisoft-next
```

## 14. Update del sistema

Si actualizas codigo:

```bash
cd /opt/multisoft/multisoft_informes
git pull
./install-linux.sh
sudo systemctl restart multisoft-django
sudo systemctl restart multisoft-next
sudo systemctl restart multisoft-node-api
```

## 15. Checklist final

1. Usuario `multisoft` creado
2. Proyecto en `/opt/multisoft/multisoft_informes`
3. `nvm` instalado en `/home/multisoft/.nvm`
4. Node `12.22.12` y `20.19.0` instalados
5. `.venv` creado
6. `install-linux.sh` ejecutado
7. PostgreSQL configurado
8. SQL Anywhere configurado
9. `systemd` activo
10. `nginx` activo
11. `firewalld` abierto
12. `SELinux` ajustado si hace falta

## 16. Archivos usados

1. [install-linux.sh](C:/Multisoft/datos/web_informe/Web_New/multisoft_informes_next_front/multisoft_informes/install-linux.sh)
2. [start-prod.sh](C:/Multisoft/datos/web_informe/Web_New/multisoft_informes_next_front/multisoft_informes/start-prod.sh)
3. [stop-prod.sh](C:/Multisoft/datos/web_informe/Web_New/multisoft_informes_next_front/multisoft_informes/stop-prod.sh)
4. [deploy/systemd/centos9/multisoft-django.service](C:/Multisoft/datos/web_informe/Web_New/multisoft_informes_next_front/multisoft_informes/deploy/systemd/centos9/multisoft-django.service)
5. [deploy/systemd/centos9/multisoft-next.service](C:/Multisoft/datos/web_informe/Web_New/multisoft_informes_next_front/multisoft_informes/deploy/systemd/centos9/multisoft-next.service)
6. [deploy/systemd/centos9/multisoft-node-api.service](C:/Multisoft/datos/web_informe/Web_New/multisoft_informes_next_front/multisoft_informes/deploy/systemd/centos9/multisoft-node-api.service)
7. [deploy/nginx/centos9/multisoft.conf](C:/Multisoft/datos/web_informe/Web_New/multisoft_informes_next_front/multisoft_informes/deploy/nginx/centos9/multisoft.conf)
