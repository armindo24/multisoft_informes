# Instrucciones de Configuracion - Proyecto Next.js + Django

## Requisitos Previos

- **Node.js frontend**: v20.19.0
- **Node.js API legacy/sqlanywhere**: v12.22.12
- **Python**: 3.10+
- **npm**: compatible con ambas versiones via nvm-windows

## Iniciar el Proyecto

### Opcion 1: Script Automatico
```powershell
cd C:\Multisoft\datos\web_informe\Web_New\multisoft_informes_next_front\multisoft_informes
.\start-dev-next.ps1
```

### Opcion 2: Manual - Por Terminal

#### Terminal 1 - Django
```powershell
cd C:\Multisoft\datos\web_informe\Web_New\multisoft_informes_next_front\multisoft_informes
.\venv\Scripts\Activate.ps1
python manage.py runserver 0.0.0.0:8000
```

#### Terminal 2 - Next.js
```powershell
cd C:\Multisoft\datos\web_informe\Web_New\multisoft_informes_next_front\multisoft_informes\frontend-next
nvm use 20.19.0
npm run dev
```

#### Terminal 3 - Node.js Server
```powershell
cd C:\Multisoft\datos\web_informe\Web_New\multisoft_informes_next_front\multisoft_informes\server\multisoft
nvm use 12.22.12
node .\bin\www
```

## URLs de Acceso

- **Next.js Frontend**: http://localhost:3001
- **Django Backend**: http://localhost:8000
- **Node.js Server**: http://localhost:3000

## Dependencias Instaladas

### Backend (Python)
- Django 3.2.25
- django-environ
- gunicorn
- psycopg2-binary
- redis
- requests
- xlrd
- openpyxl

### Frontend (Node.js)
- Next.js 15.2.0
- React 19.0.0
- TailwindCSS 3.4.17
- TypeScript 5.7.3

## Solucion de Problemas

### Error: `nvm not found`
Asegurate de tener `nvm-windows` instalado y disponible en PATH.

### Error: `Could not load modules`
Si el mensaje menciona `Version: 'v20.19.0'`, el problema no es `node_modules` del frontend: es el driver nativo `sqlanywhere`, que solo soporta Node 5.x a 12.x. En ese caso ejecuta la API legacy con Node `12.22.12`.

### Instalar versiones requeridas de Node
```powershell
nvm install 12.22.12
nvm install 20.19.0
```

### Puerto en uso
```powershell
netstat -ano | findstr :3001
Stop-Process -Id <PID> -Force
```

---
**Ultima actualizacion**: 16 de abril de 2026
