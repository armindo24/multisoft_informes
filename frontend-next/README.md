# Frontend Next.js para Multisoft Informes

Esta carpeta contiene una nueva base de frontend para migrar gradualmente el sistema desde templates clásicos de Django a una interfaz moderna con **Next.js + React + TypeScript**.

## Objetivo
- Mantener **Django** y **Node API** como backend actual.
- Rehacer el frontend por módulos, sin romper lo que ya funciona.
- Priorizar dashboard ejecutivo, ventas y stock.

## Ejecutar en desarrollo
```bash
cd frontend-next
cp .env.example .env.local
npm install
npm run dev
```

Abre:
- Front nuevo: `http://localhost:3001`
- Node API existente: `http://localhost:3000/api/v1`
- Django actual: `http://localhost:8000`

## Variables de entorno
```env
NEXT_PUBLIC_NODE_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_APP_NAME=Multisoft Informes
```

## Estrategia de migración recomendada
1. **Dashboard**
   - KPIs principales
   - alertas operativas
   - accesos por módulo
2. **Ventas**
   - resumen
   - cuentas a cobrar
   - estadísticas
3. **Stock**
   - existencias
   - valorizado
   - costo por artículo
4. **Finanzas**
   - balance general
   - flujo de fondos
   - extractos
5. **Compras**
   - órdenes
   - proveedores
   - gastos

## Integración
- `lib/api.ts` ya incluye helpers base para consultar el Node API.
- `components/dashboard/status-grid.tsx` prueba conectividad con endpoints reales.
- Podés reemplazar los datos mock por respuestas reales módulo a módulo.

## Siguiente mejora sugerida
- Agregar autenticación basada en sesión o JWT.
- Crear una tabla reusable con filtros, paginación y exportación.
- Unificar estilos con un design system interno.


## Mejoras base agregadas

- Login de demo en `/login`
- Middleware para proteger rutas del panel
- Logout por cookie HTTP-only
- Dashboard ejecutivo consolidado con métricas vivas
- Componentes reutilizables para tablas (`components/ui/data-table.tsx`)

### Acceso demo

- Usuario: `admin`
- Contraseña: `admin123`

Podés cambiar estas credenciales con variables de entorno:

```env
DEMO_LOGIN_USER=admin
DEMO_LOGIN_PASSWORD=admin123
```


## Mejoras recientes de experiencia

- Tablas avanzadas reutilizables con búsqueda, ordenamiento y paginación
- Exportación directa a CSV y JSON en Ventas, Stock, Finanzas y Compras
- Base lista para seguir con exportación PDF y autenticación real contra backend
