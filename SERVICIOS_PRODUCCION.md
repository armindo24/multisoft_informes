# Servicios de Produccion

Este documento resume las opciones recomendadas para ejecutar `multisoft_informes` de forma estable.

## Windows

Opciones recomendadas:

1. `PM2`
2. `NSSM`
3. `Task Scheduler` como alternativa simple

### Scripts incluidos

1. [install-windows.ps1](C:/Multisoft/datos/web_informe/Web_New/multisoft_informes_next_front/multisoft_informes/install-windows.ps1)
2. [start-prod.ps1](C:/Multisoft/datos/web_informe/Web_New/multisoft_informes_next_front/multisoft_informes/start-prod.ps1)
3. [stop-prod.ps1](C:/Multisoft/datos/web_informe/Web_New/multisoft_informes_next_front/multisoft_informes/stop-prod.ps1)

## Linux

Opciones recomendadas:

1. `systemd`
2. `PM2`
3. `nginx` o `caddy` delante de la aplicacion

### Scripts incluidos

1. [install-linux.sh](C:/Multisoft/datos/web_informe/Web_New/multisoft_informes_next_front/multisoft_informes/install-linux.sh)
2. [start-prod.sh](C:/Multisoft/datos/web_informe/Web_New/multisoft_informes_next_front/multisoft_informes/start-prod.sh)
3. [stop-prod.sh](C:/Multisoft/datos/web_informe/Web_New/multisoft_informes_next_front/multisoft_informes/stop-prod.sh)

### Plantillas incluidas

1. [deploy/systemd/multisoft-django.service](C:/Multisoft/datos/web_informe/Web_New/multisoft_informes_next_front/multisoft_informes/deploy/systemd/multisoft-django.service)
2. [deploy/systemd/multisoft-next.service](C:/Multisoft/datos/web_informe/Web_New/multisoft_informes_next_front/multisoft_informes/deploy/systemd/multisoft-next.service)
3. [deploy/systemd/multisoft-node-api.service](C:/Multisoft/datos/web_informe/Web_New/multisoft_informes_next_front/multisoft_informes/deploy/systemd/multisoft-node-api.service)
4. [deploy/pm2/ecosystem.config.js](C:/Multisoft/datos/web_informe/Web_New/multisoft_informes_next_front/multisoft_informes/deploy/pm2/ecosystem.config.js)

## Observaciones

- Las rutas en `systemd` y `PM2` son plantillas. Debes adaptarlas a tu servidor.
- En Windows, la ruta del `node.exe` de `nvm-windows` puede variar por usuario.
- La API legacy debe seguir usando `Node 12.22.12`.
- El frontend Next.js debe seguir usando `Node 20.19.0`.

## Siguiente recomendacion

Despues de instalar, lo ideal es agregar:

1. reverse proxy `nginx` o `caddy`
2. certificados HTTPS
3. logs centralizados
4. reinicio automatico al boot
