# Guia de Servicios - Multisoft Informes

## Iniciar todos los servicios

Para iniciar todos los servicios de desarrollo en modo red:

```powershell
.\start-all-services.ps1
```

Esto iniciara tres nuevas ventanas:
1. **Django** - Puerto 8000 (Backend API)
2. **Next.js** - Puerto 3001 (Frontend)
3. **Node.js API** - Puerto 3000 (API secundaria)

## Detener todos los servicios

Para detener todos los servicios:

```powershell
.\stop-all-services.ps1
```

## URLs de acceso

| Servicio | URL | Puerto |
|----------|-----|--------|
| Django API | http://10.0.0.22:8000 | 8000 |
| Next.js Frontend | http://10.0.0.22:3001 | 3001 |
| Node.js API | http://localhost:3000 | 3000 |

## Descripcion de servicios

### Django (Puerto 8000)
- Backend REST API
- Base de datos: PostgreSQL (localhost:5432)
- Usuario: postgres | Contrasena: postgres
- Base de datos: multisoft_informes

### Next.js (Puerto 3001)
- Frontend React/TypeScript
- Node.js: v20.19.0
- Framework: Next.js 15.2.0

### Node.js API (Puerto 3000)
- API secundaria Express.js
- Node.js: v12.22.12
- Conecta con bases de datos: Integrado, Sueldo

## Requisitos previos

- Python 3.10+ con venv activado
- Node.js v20.19.0 (Next.js, via nvm-windows)
- Node.js v12.22.12 (API legacy/sqlanywhere, via nvm-windows)
- PostgreSQL corriendo en localhost:5432
- npm/npx disponible

## Solucion de problemas

### npm no se encuentra
- Los scripts usan ejecutables directos desde `nvm-windows`
- Si falta alguna version, instala ambas:
  ```cmd
  nvm install 12.22.12
  nvm install 20.19.0
  ```
- Si falla el frontend, abre una nueva terminal cmd.exe y ejecuta:
  ```cmd
  cd frontend-next
  nvm use 20.19.0
  npx next dev
  ```

### Error `Could not load modules for Platform ... Version v20.19.0`
- Ese error viene del paquete nativo `sqlanywhere`
- `sqlanywhere@1.0.27` solo soporta Node.js 5.x a 12.x
- La API legacy debe ejecutarse con Node.js `12.22.12`
- Next.js debe ejecutarse con Node.js `20.19.0`

### Puerto en uso
- Django 8000, Next.js 3001, Node.js 3000
- Si algun puerto esta en uso, ejecuta `stop-all-services.ps1` primero

### Django no conecta a PostgreSQL
- Verifica que PostgreSQL este corriendo
- Revisa credenciales en: `multisoft_informes/settings/development.py`
- Por defecto: usuario=postgres, password=postgres

## Configuracion de bases de datos

### PostgreSQL (Desarrollo)
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'multisoft_informes',
        'USER': 'postgres',
        'PASSWORD': 'postgres',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### Sybase Anywhere (Integrado - Configurado)
- Host: 10.0.0.22
- Puerto: 2638
- Usuario: dba
- Contrasena: ownnetmasterkey
- Base de datos: integrado

Credenciales guardadas en: `multisoft_informes/settings/development.py`

## Logs

Los servicios escriben sus logs en las ventanas de consola respectivas. Manten abierta la ventana PowerShell/CMD para ver los logs en tiempo real.
