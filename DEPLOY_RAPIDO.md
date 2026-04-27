# Deploy Rapido

Guia corta para el trabajo diario con `Git`, `Windows` y `Linux`.

Para instalacion completa:

- ver [README_GIT_DEPLOY.md](C:/Multisoft/datos/web_informe/Web_New/multisoft_informes_next_front/multisoft_informes/README_GIT_DEPLOY.md)
- ver [CENTOS9_DEPLOY.md](C:/Multisoft/datos/web_informe/Web_New/multisoft_informes_next_front/multisoft_informes/CENTOS9_DEPLOY.md)

## Flujo Diario

1. Hacer cambios en Windows.
2. Probar localmente.
3. Subir a Git.
4. Entrar al servidor Linux.
5. Bajar cambios con `git pull`.
6. Reconstruir o reiniciar solo lo que cambio.

## Windows

Entrar al proyecto:

```powershell
cd "C:\Multisoft\datos\web_informe\Web_New\multisoft_informes_next_front\multisoft_informes"
```

Ver cambios:

```powershell
git status
```

Subir cambios:

```powershell
git add .
git commit -m "Descripcion breve del cambio"
git push origin main
```

Ver ultimos commits:

```powershell
git log --oneline -n 10
```

## Linux

Entrar al proyecto:

```bash
cd /opt/multisoft/multisoft_informes
```

Bajar cambios:

```bash
git pull
```

## Si Cambiaste Frontend Next

Usar cuando cambies `frontend-next`.

```bash
cd /opt/multisoft/multisoft_informes/frontend-next
source /home/multisoft/.nvm/nvm.sh
nvm use 20.20.2
npm run build
systemctl restart multisoft-next
```

Ver estado:

```bash
systemctl status multisoft-next
journalctl -u multisoft-next -n 100 --no-pager
```

## Si Cambiaste Django

Usar cuando cambies `multisoft_informes`, permisos, usuarios, vistas Django o configuracion backend.

```bash
cd /opt/multisoft/multisoft_informes
source .venv/bin/activate
export DJANGO_SETTINGS_MODULE=multisoft_informes.settings.production
python manage.py migrate --noinput
python manage.py collectstatic --noinput
systemctl restart multisoft-django
```

Ver estado:

```bash
systemctl status multisoft-django
journalctl -u multisoft-django -n 100 --no-pager
```

## Si Cambiaste Node API Legacy

Usar cuando cambies `server/multisoft`.

```bash
cd /opt/multisoft/multisoft_informes/server/multisoft
source /home/multisoft/.nvm/nvm.sh
nvm use 12.22.12
npm install
systemctl restart multisoft-node-api
```

Ver estado:

```bash
systemctl status multisoft-node-api
journalctl -u multisoft-node-api -n 100 --no-pager
```

## Si Cambiaste Nginx

Usar cuando cambies proxy, dominio, assets o rutas publicas.

```bash
cp /opt/multisoft/multisoft_informes/deploy/nginx/centos9/multisoft.conf /etc/nginx/conf.d/multisoft.conf
nginx -t
systemctl restart nginx
```

Ver estado:

```bash
systemctl status nginx
journalctl -u nginx -n 100 --no-pager
```

## Casos Comunes

Solo frontend:

```bash
cd /opt/multisoft/multisoft_informes
git pull
cd frontend-next
source /home/multisoft/.nvm/nvm.sh
nvm use 20.20.2
npm run build
systemctl restart multisoft-next
```

Frontend + Django:

```bash
cd /opt/multisoft/multisoft_informes
git pull

cd frontend-next
source /home/multisoft/.nvm/nvm.sh
nvm use 20.20.2
npm run build
systemctl restart multisoft-next

cd /opt/multisoft/multisoft_informes
source .venv/bin/activate
export DJANGO_SETTINGS_MODULE=multisoft_informes.settings.production
python manage.py migrate --noinput
python manage.py collectstatic --noinput
systemctl restart multisoft-django
```

Frontend + Node API:

```bash
cd /opt/multisoft/multisoft_informes
git pull

cd frontend-next
source /home/multisoft/.nvm/nvm.sh
nvm use 20.20.2
npm run build
systemctl restart multisoft-next

cd /opt/multisoft/multisoft_informes/server/multisoft
source /home/multisoft/.nvm/nvm.sh
nvm use 12.22.12
npm install
systemctl restart multisoft-node-api
```

## Comandos de Ayuda

Ver cambios locales:

```bash
git status
```

Ver ultimo commit:

```bash
git log --oneline -n 5
```

Ver procesos escuchando:

```bash
ss -lntp | grep 3001
ss -lntp | grep 8000
ss -lntp | grep 3000
```

## Recomendaciones

- No trabajar en produccion sin hacer `git push` primero.
- Antes de `git pull` en Linux, revisar si hay cambios locales.
- Si cambias `frontend-next`, casi siempre hay que correr `npm run build`.
- Si cambias tablas o configuracion Django, correr `migrate`.
- Si cambias solo texto o estilos del frontend, normalmente alcanza con reconstruir `Next`.
