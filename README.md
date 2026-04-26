# Casa Torino Frontend

Frontend MVP para la operación de Casa Torino construido con Angular standalone, Angular Material y NgRx.

## Stack

- Angular 20 con componentes standalone
- NgRx Store + Effects + Selectors
- Angular Material
- RxJS
- TypeScript estricto
- SCSS

## Scripts

```bash
npm install
npm start
npm run build
npm test
```

## Configuración

La URL base del backend se configura en:

- `src/environments/environment.ts`
- `src/environments/environment.development.ts`
- `src/environments/environment.prod.ts`

Valores por entorno:

```ts
// environment.development.ts
export const environment = {
  production: false,
  apiUrl: '/api'
};

// environment.ts / environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'http://localhost:8000'
};
```

En desarrollo, `npm start` usa `proxy.conf.json` para redirigir `/api` hacia `http://localhost:8000` y evitar errores CORS del navegador.
En build de producción, Angular reemplaza el environment de desarrollo y usa `http://localhost:8000` directamente.

## Arquitectura

```text
src/
  app/
    core/
      guards/
      interceptors/
      models/
      services/
    shared/
      components/
      pipes/
      validators/
    store/
    features/
      dashboard/
      customers/
      products/
      ingredients/
      recipes/
      orders/
      payments/
```

## Principios implementados

- El store es la fuente principal del estado de UI y datos.
- Los componentes despachan acciones; la comunicación HTTP vive en effects y servicios de `core`.
- Rutas lazy por feature.
- Formularios reactivos con validaciones.
- Soft delete modelado mediante `is_active`.
- Layout global con sidebar, topbar, spinner y snackbars.

## Cobertura MVP

- Dashboard con métricas básicas y últimos pedidos.
- CRUD para clientes, productos e ingredientes.
- Creación y consulta de recetas con costo calculado por API.
- Gestión de pedidos con creación, detalle y cambio de estado.
- Registro y consulta de pagos por pedido.

## Notas

- La build fue validada con `npm run build`.
- El entorno local actual usa Node `v25.9.0`; Angular compila, pero sigue siendo recomendable usar una versión LTS de Node en desarrollo continuo.
