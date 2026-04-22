# Guía de Instalación (Windows)

Este documento resume los instaladores y pasos necesarios para montar el sistema en otro equipo.

## 1) Requisitos base (instaladores)
1. **Python 3.10.x**
2. **Node.js (LTS)**
3. **SQL Anywhere Client** (obligatorio para `sqlanywhere`)
4. **PostgreSQL** (DB principal de Django)

## 2) Ubicación del proyecto
Colocar el proyecto en:
```
C:\Multisoft\datos\web_informe\Web_New\webapp\multisoft_informes
```

## 3) Entorno virtual (Python)
```powershell
cd C:\Multisoft\datos\web_informe\Web_New\webapp\multisoft_informes
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

## 4) Dependencias Python
Si existe `requirements.txt`:
```powershell
pip install -r requirements.txt
```

Si no existe, instalar mínimo:
```powershell
pip install django==3.2.25 psycopg2-binary requests
```

## 5) Base de datos Postgres (Django)
Crear DB y usuario:
- **DB:** `multisoft_informes`
- **User:** `postgres`
- **Password:** `postgres`

Migrar:
```powershell
python manage.py migrate
```

## 6) Dependencias Node
```powershell
cd C:\Multisoft\datos\web_informe\Web_New\webapp\multisoft_informes\server\multisoft
npm install
```

## 7) Configuración SQL Anywhere
Editar `server/multisoft/config/local.json`:
```json
"integrado": {
  "dbConfig": {
    "host": "10.0.0.22:2638",
    "Server": "cpabancos",
    "DatabaseName": "cpabancos",
    "UserID": "dba",
    "Password": "xxx"
  }
},
"sueldo": {
  "dbConfig": {
    "host": "127.0.0.1:2639",
    "Server": "IntegSueldos",
    "DatabaseName": "integsueldos",
    "UserID": "dba",
    "Password": "xxx"
  }
}
```

## 8) Levantar todo (Django + Node)
```powershell
cd C:\Multisoft\datos\web_informe\Web_New\webapp\multisoft_informes
npm run dev
```

## 9) Crear roles y permisos
```powershell
python manage.py seed_roles
```

## 10) Configuración Email (opcional)
Ingresar:
```
http://localhost:8000/accounts/menu/?q=Admin
```
→ **Configuración de Email**

## 11) Acceso en red (opcional)
Abrir firewall:
```powershell
netsh advfirewall firewall add rule name="Django 8000" dir=in action=allow protocol=TCP localport=8000
netsh advfirewall firewall add rule name="Node 3000" dir=in action=allow protocol=TCP localport=3000
```

---

# Guía de Instalación (Linux)

## 1) Requisitos base
Instalar:
- **Python 3.10+**
- **Node.js (LTS)**
- **PostgreSQL**
- **SQL Anywhere Client** (si se usa `sqlanywhere`)

## 2) Ubicación del proyecto
Ejemplo:
```
/opt/multisoft/multisoft_informes
```

## 3) Entorno virtual (Python)
```bash
cd /opt/multisoft/multisoft_informes
python3 -m venv .venv
source .venv/bin/activate
```

## 4) Dependencias Python
Si existe `requirements.txt`:
```bash
pip install -r requirements.txt
```

Si no existe, instalar mínimo:
```bash
pip install django==3.2.25 psycopg2-binary requests
```

## 5) Base de datos Postgres (Django)
Crear DB y usuario:
- **DB:** `multisoft_informes`
- **User:** `postgres`
- **Password:** `postgres`

Migrar:
```bash
python manage.py migrate
```

## 6) Dependencias Node
```bash
cd /opt/multisoft/multisoft_informes/server/multisoft
npm install
```

## 7) Configuración SQL Anywhere
Editar `server/multisoft/config/local.json`:
```json
"integrado": {
  "dbConfig": {
    "host": "10.0.0.22:2638",
    "Server": "cpabancos",
    "DatabaseName": "cpabancos",
    "UserID": "dba",
    "Password": "xxx"
  }
},
"sueldo": {
  "dbConfig": {
    "host": "127.0.0.1:2639",
    "Server": "IntegSueldos",
    "DatabaseName": "integsueldos",
    "UserID": "dba",
    "Password": "xxx"
  }
}
```

## 8) Levantar servicios
En dos terminales:
```bash
cd /opt/multisoft/multisoft_informes
source .venv/bin/activate
python manage.py runserver 0.0.0.0:8000
```

```bash
cd /opt/multisoft/multisoft_informes/server/multisoft
node ./bin/www
```

## 9) Crear roles y permisos
```bash
cd /opt/multisoft/multisoft_informes
source .venv/bin/activate
python manage.py seed_roles
```

## 10) Configuración Email (opcional)
Ingresar:
```
http://localhost:8000/accounts/menu/?q=Admin
```
→ **Configuración de Email**

## 11) Abrir puertos (opcional)
Ejemplo con UFW:
```bash
sudo ufw allow 8000/tcp
sudo ufw allow 3000/tcp
```


## Frontend moderno (Next.js)
Se agregó una nueva base de frontend en `frontend-next/`.

### Ejecutar todo
```bash
# Linux
./start-dev-next.sh
```

```powershell
# Windows
npm run dev:next
```

### Puertos
- Django: `8000`
- Node API: `3000`
- Next.js: `3001`
