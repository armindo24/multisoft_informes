# Git y Despliegue

Esta guia explica como subir el proyecto a un repositorio Git privado y luego instalarlo desde un servidor Linux o Windows.

## 1. Antes de subir

Verifica que estos archivos locales no se suban:

- `.envariables`
- `.env`
- `db.sqlite3`
- `venv/`
- `.venv/`
- `frontend-next/.next/`
- `frontend-next/node_modules/`
- archivos `.bak` o `.bk`

Ya estan cubiertos en `.gitignore`, pero conviene revisar:

```powershell
git status
```

Si aparece un archivo sensible en staged o tracked, sacalo antes de continuar:

```powershell
git rm --cached NOMBRE_DEL_ARCHIVO
```

## 2. Crear el repositorio remoto

Puedes usar Bitbucket, GitHub o GitLab. Para este proyecto te conviene que sea privado.

Ejemplo de URL remota:

```text
https://bitbucket.org/multisoftapp/multisoft_informes.git
```

## 3. Subir el proyecto por primera vez

Desde la carpeta raiz del proyecto:

```powershell
git init
git add .
git commit -m "Version inicial del proyecto"
git branch -M main
git remote add origin https://bitbucket.org/multisoftapp/multisoft_informes.git
git push -u origin main
```

Si el repositorio remoto ya existe y ya tiene historial:

```powershell
git remote add origin https://bitbucket.org/multisoftapp/multisoft_informes.git
git fetch origin
git branch -M main
git pull origin main --allow-unrelated-histories
git push -u origin main
```

## 4. Flujo normal de trabajo

Cada vez que hagas cambios:

```powershell
git status
git add .
git commit -m "Descripcion corta del cambio"
git push
```

## 5. Clonar en un servidor Linux

Ejemplo en CentOS 9:

```bash
sudo mkdir -p /opt/multisoft
sudo chown -R multisoft:multisoft /opt/multisoft
cd /opt/multisoft
git clone https://bitbucket.org/multisoftapp/multisoft_informes.git
cd multisoft_informes
```

Despues crea tu configuracion local:

```bash
cp .envariables.example .envariables
```

Edita `.envariables` con los datos reales del servidor.

Luego ejecuta el instalador:

```bash
chmod +x install-linux.sh
./install-linux.sh
```

## 6. Actualizar una instalacion existente en Linux

Dentro de la carpeta del proyecto:

```bash
cd /opt/multisoft/multisoft_informes
git pull
```

Si hubo cambios de dependencias o build:

```bash
source .venv/bin/activate
pip install -r requirements.txt
cd frontend-next && npm install && npm run build
cd ..
```

Si usas servicios:

```bash
sudo systemctl restart multisoft-django
sudo systemctl restart multisoft-node
sudo systemctl restart multisoft-next
```

## 7. Clonar en Windows

Abre PowerShell y usa:

```powershell
cd C:\Multisoft
git clone https://bitbucket.org/multisoftapp/multisoft_informes.git
cd .\multisoft_informes
Copy-Item .envariables.example .envariables
```

Despues completa `.envariables` y ejecuta:

```powershell
.\install-windows.ps1
```

## 8. Recomendaciones de seguridad

- Usa repositorio privado.
- No subas contraseñas de base de datos.
- No subas secretos de Django.
- No subas bases SQLite locales.
- Si un secreto ya se subio, cambialo y elimina ese valor del historial si el repo ya fue compartido.

## 9. Archivos que si conviene subir

- codigo fuente Django
- codigo fuente Next.js
- API Node legacy
- scripts de instalacion
- archivos `deploy/`
- documentacion `README`
- ejemplos de configuracion como `.envariables.example`

## 10. Estructura recomendada en servidor

```text
/opt/multisoft/multisoft_informes
```

Con un usuario dedicado, por ejemplo:

```bash
sudo useradd -m -s /bin/bash multisoft
sudo passwd multisoft
sudo mkdir -p /opt/multisoft
sudo chown -R multisoft:multisoft /opt/multisoft
```

## 11. Build para produccion

En Linux:

```bash
cd /opt/multisoft/multisoft_informes/frontend-next
npm install
npm run build
```

En Windows:

```powershell
cd .\frontend-next
npm install
npm run build
```

Eso genera la compilacion optimizada de Next.js para produccion.

## 12. Nota sobre el codigo fuente

Si clonas el proyecto en `/opt/multisoft/multisoft_informes`, el codigo fuente queda dentro del servidor. Los usuarios finales no lo ven desde el navegador, pero cualquier persona con acceso al sistema operativo si podria verlo.

Por eso conviene:

- usar un usuario dedicado como `multisoft`
- dar acceso solo a administradores
- no trabajar como `root` para el uso diario
- usar permisos correctos sobre `/opt/multisoft`
