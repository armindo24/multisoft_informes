# Skills Rapido

Estas skills ya quedaron creadas en tu entorno local de Codex:

- `multisoft-report-qa`
- `multisoft-deploy`
- `multisoft-diagnostics`

## Como usarlas

No hace falta un comando especial del sistema.
Al pedirme algo, nombrala en el mensaje.

Ejemplos:

```text
usa la skill multisoft-report-qa para revisar por que el PDF no coincide con la web
```

```text
usa la skill multisoft-deploy para indicarme el deploy correcto en Linux
```

```text
usa la skill multisoft-diagnostics para investigar por que multisoft-next no levanta
```

Tambien podes pedirlo de forma mas natural:

```text
revisa esto con multisoft-report-qa
```

```text
diagnostica esto con multisoft-diagnostics
```

```text
haz el deploy guiado con multisoft-deploy
```

## Para que sirve cada una

## multisoft-report-qa

Usala cuando quieras validar:

- web vs PDF
- web vs Excel
- web vs correo programado
- filtros
- rangos dinamicos
- branding
- diferencias entre pantalla y exportacion

Ejemplo:

```text
usa la skill multisoft-report-qa para revisar cartera.unificada porque el PDF sale distinto al informe en pantalla
```

## multisoft-deploy

Usala cuando quieras:

- saber que servicio reiniciar
- hacer deploy en Linux
- verificar logs post deploy
- confirmar si toca Next, Django o Node API

Ejemplo:

```text
usa la skill multisoft-deploy para actualizar este cambio en produccion
```

## multisoft-diagnostics

Usala cuando quieras investigar:

- errores de servicios
- Redis
- PostgreSQL
- Node API legacy
- sesiones
- notificaciones
- programaciones fallidas
- reportes vacios

Ejemplo:

```text
usa la skill multisoft-diagnostics para revisar por que una tarea programada envia vacio el PDF
```

## Recomendacion practica

Usa esta idea:

- si el problema es de informe: `multisoft-report-qa`
- si el problema es de despliegue: `multisoft-deploy`
- si el problema es de entorno o falla tecnica: `multisoft-diagnostics`
