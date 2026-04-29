# Trabajo En Equipo

Guia recomendada para trabajar varias personas sobre `multisoft_informes` sin pisarse cambios ni romper produccion.

## Objetivo

Separar claramente:

- desarrollo local de cada persona
- integracion del equipo
- testing
- produccion

## Estructura recomendada

## 1. Repositorio central

Usar un repositorio unico en GitHub.

Ejemplo:

```text
main
develop
feature/...
fix/...
```

## 2. Ambientes

Tener estos ambientes:

- `local`
- `testing`
- `produccion`

Regla:

- cada desarrollador prueba primero en local
- luego se valida en testing
- solo despues pasa a produccion

## 3. Workspace por persona

Cada persona debe tener su propio clon del proyecto.

No trabajar todos sobre la misma carpeta compartida.

Ejemplo Windows:

```text
C:\Proyectos\multisoft_informes
```

Ejemplo Linux:

```text
/opt/proyectos/multisoft_informes
```

## Flujo recomendado

## 1. Clonar el proyecto

Cada persona:

```bash
git clone <url-del-repo>
```

## 2. Mantener ramas claras

Usar:

- `main`: estable para produccion
- `develop`: integracion del equipo
- `feature/...`: nuevas funciones
- `fix/...`: correcciones

Ejemplos:

```text
feature/cartera-unificada
feature/informes-programados
fix/pdf-costo-full
fix/notificaciones-badge
```

## 3. Empezar una tarea

Antes de trabajar:

```bash
git checkout develop
git pull
git checkout -b feature/nombre-corto
```

## 4. Guardar cambios

Durante el trabajo:

```bash
git status
git add .
git commit -m "Descripcion clara del cambio"
```

## 5. Subir al repositorio

```bash
git push origin feature/nombre-corto
```

## 6. Integrar al equipo

Cuando la tarea esta lista:

- crear Pull Request hacia `develop`
- revisar
- probar
- mergear

## 7. Pasar a testing

Servidor de testing:

```bash
git checkout develop
git pull
```

Luego reconstruir solo lo que cambie.

### Si cambio `frontend-next`

```bash
cd /opt/multisoft/multisoft_informes/frontend-next
source /home/multisoft/.nvm/nvm.sh
nvm use 20.20.2
npm install
rm -rf .next
npm run build
systemctl restart multisoft-next
```

### Si cambio Django

```bash
cd /opt/multisoft/multisoft_informes
source .venv/bin/activate
export DJANGO_SETTINGS_MODULE=multisoft_informes.settings.production
python manage.py migrate --noinput
python manage.py collectstatic --noinput
systemctl restart multisoft-django
```

### Si cambio Node API legacy

```bash
cd /opt/multisoft/multisoft_informes/server/multisoft
source /home/multisoft/.nvm/nvm.sh
nvm use 12.22.12
npm install
systemctl restart multisoft-node-api
```

## 8. Pasar a produccion

Solo cuando testing este validado.

Recomendacion:

- mergear `develop` a `main`
- en produccion actualizar desde `main`

## Reglas importantes

## No trabajar directo en `main`

Evita errores y hace mas facil volver atras.

## No compartir una sola carpeta entre varios

Cada persona con su clon local.

## No usar la base de produccion para desarrollo

Tener:

- base de desarrollo
- base de testing
- base de produccion

## Siempre probar antes de merge

Validar:

- web
- PDF
- Excel
- correo programado
- permisos
- notificaciones

## Mantener mensajes de commit claros

Ejemplos:

```text
Corregir PDF de cartera programada
Agregar consolidacion de sucursales en ventas
Sincronizar contador de notificaciones
```

## Recomendacion de roles

Si el equipo crece, ayuda dividir:

- `frontend`
- `backend`
- `reportes`
- `deploy/testing`

No tiene que ser rigido, pero ayuda a ordenar.

## Flujo rapido diario

## Desarrollador

```bash
git checkout develop
git pull
git checkout -b feature/mi-cambio
```

Trabaja, prueba, luego:

```bash
git add .
git commit -m "Mi cambio"
git push origin feature/mi-cambio
```

## Integracion

- Pull Request a `develop`
- validacion funcional
- deploy a testing

## Produccion

- merge a `main`
- deploy controlado
- revisar logs

## Comandos utiles

Ver rama actual:

```bash
git branch
```

Ver cambios:

```bash
git status
```

Ver historial corto:

```bash
git log --oneline -n 10
```

Actualizar rama:

```bash
git pull
```

## Recomendacion final para tu proyecto

Lo mejor para ustedes hoy es:

- un repo GitHub central
- una rama `develop`
- una rama `main`
- ramas por tarea
- un servidor de `testing`
- produccion separada
- cada persona con su clon local

Eso ya les da una base mucho mas profesional para crecer sin desorden.
