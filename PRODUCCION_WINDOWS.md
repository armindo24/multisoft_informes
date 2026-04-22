# Manual de Instalacion y Produccion (Windows)

Este documento resume los requisitos y los pasos para instalar y dejar operativo el proyecto `multisoft_informes` en Windows.

## 1. Arquitectura del sistema

El proyecto usa tres servicios:

1. `Django` en puerto `8000`
2. `Node.js legacy` en puerto `3000`
3. `Next.js` en puerto `3001`

Notas importantes:

- `Next.js` necesita `Node 20.19.0`
- La API legacy con `sqlanywhere` necesita `Node 12.22.12`
- Por eso se recomienda `nvm-windows`

## 2. Requisitos previos

Instalar en la maquina:

1. `Python 3.10` o superior
2. `nvm-windows`
3. `Node.js 12.22.12`
4. `Node.js 20.19.0`
5. `PostgreSQL`
6. `SQL Anywhere Client / drivers`
7. `Git` opcional, pero recomendado

Comandos recomendados para Node:

```powershell
nvm install 12.22.12
nvm install 20.19.0
```

## 3. Ubicacion recomendada del proyecto

```powershell
C:\Multisoft\datos\web_informe\Web_New\multisoft_informes_next_front\multisoft_informes
```

## 4. Preparacion inicial

Entrar a la carpeta del proyecto:

```powershell
cd C:\Multisoft\datos\web_informe\Web_New\multisoft_informes_next_front\multisoft_informes
```

## 5. Entorno Python

Crear el entorno virtual si todavia no existe:

```powershell
python -m venv venv
```

Activarlo:

```powershell
.\venv\Scripts\Activate.ps1
```

Instalar dependencias Python:

```powershell
pip install --upgrade pip
pip install -r requirements.txt
```

## 6. Dependencias Node

### Frontend Next.js

```powershell
cd frontend-next
C:\Users\%USERNAME%\AppData\Roaming\nvm\v20.19.0\npm.cmd install
```

### API legacy

```powershell
cd ..\server\multisoft
C:\Users\%USERNAME%\AppData\Roaming\nvm\v12.22.12\npm.cmd install
```

Si la ruta de `nvm` cambia en tu equipo, usa la correspondiente.

## 7. Base de datos PostgreSQL

Debes contar con una base PostgreSQL accesible para Django.

Verificar:

1. host
2. puerto
3. nombre de base
4. usuario
5. password

Luego ejecutar migraciones:

```powershell
cd C:\Multisoft\datos\web_informe\Web_New\multisoft_informes_next_front\multisoft_informes
.\venv\Scripts\Activate.ps1
python manage.py migrate
```

## 8. Configuracion de SQL Anywhere

La API legacy depende de la conexion a SQL Anywhere.

Verificar la configuracion correspondiente para:

1. `integrado`
2. `sueldo`

Debes tener correctamente definidos:

1. `host`
2. `Server`
3. `DatabaseName`
4. `UserID`
5. `Password`

Si el driver no soporta la version de Node, la API legacy fallara con errores del tipo:

```text
Could not load modules for Platform: 'win32', Process Arch: 'x64'
```

En ese caso confirma que realmente este corriendo con `Node 12.22.12`.

## 9. Variables y settings

Revisar que el proyecto tenga definidos:

1. settings de `development`
2. settings de `production`
3. conexion PostgreSQL
4. correo SMTP
5. credenciales SQL Anywhere

Para produccion, el login ya no muestra el bloque `Modo desarrollo: admin / admin`.

## 10. Modo desarrollo

Para desarrollo puedes usar:

```powershell
.\start-all-services.ps1
```

o

```powershell
.\start-dev-next.ps1
```

## 11. Modo produccion

Se agrego este script:

```powershell
.\start-prod.ps1
```

Ese script hace lo siguiente:

1. verifica `venv`
2. verifica Node `12.22.12` y `20.19.0`
3. ejecuta migraciones Django con settings de produccion
4. compila Next.js con `npm run build`
5. levanta:
   `Django 8000`
   `Next.js start 3001`
   `Node API 3000`

## 12. Que genera Next.js en produccion

Cuando ejecutas:

```powershell
cd frontend-next
npm run build
```

Next.js genera la carpeta:

```powershell
frontend-next\.next
```

Esa carpeta contiene el build optimizado de produccion.

Luego se levanta con:

```powershell
npm run start
```

En desarrollo no se usa ese build, porque se ejecuta:

```powershell
npm run dev
```

## 13. Recomendacion para produccion real

El script `start-prod.ps1` sirve para una puesta en marcha simple, pero para produccion estable te recomiendo:

1. `PM2` para Node/Next
2. `NSSM` para crear servicios Windows
3. `Task Scheduler` solo como opcion basica
4. `Caddy`, `Nginx` o `IIS` como reverse proxy

## 14. Puertos usados

1. `8000` Django
2. `3001` Next.js
3. `3000` Node API

Si hace falta abrir firewall:

```powershell
netsh advfirewall firewall add rule name="Multisoft Django 8000" dir=in action=allow protocol=TCP localport=8000
netsh advfirewall firewall add rule name="Multisoft Next 3001" dir=in action=allow protocol=TCP localport=3001
netsh advfirewall firewall add rule name="Multisoft Node 3000" dir=in action=allow protocol=TCP localport=3000
```

## 15. Checklist rapido de instalacion

1. Instalar Python
2. Instalar nvm-windows
3. Instalar Node `12.22.12`
4. Instalar Node `20.19.0`
5. Instalar PostgreSQL
6. Instalar SQL Anywhere Client
7. Crear `venv`
8. Instalar `requirements.txt`
9. Instalar dependencias Node del frontend
10. Instalar dependencias Node del backend legacy
11. Configurar PostgreSQL
12. Configurar SQL Anywhere
13. Ejecutar migraciones
14. Probar `start-all-services.ps1`
15. Probar `start-prod.ps1`

## 16. URLs esperadas

1. Frontend: `http://localhost:3001`
2. Django: `http://localhost:8000`
3. API legacy: `http://localhost:3000`

## 17. Observacion final

Si vas a instalar esto en otro servidor y quieres, en el siguiente paso puedo prepararte tambien:

1. `stop-prod.ps1`
2. un script de instalacion automatica
3. una guia para `PM2`
4. una guia para `NSSM`
