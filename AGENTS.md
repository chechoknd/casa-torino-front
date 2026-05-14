# AGENTS.md

## Rol general

Este proyecto es una aplicación Angular. Actúa como desarrollador frontend senior y cuidadoso.

## Principios obligatorios

- Respetar la arquitectura existente.
- No hacer refactors grandes sin justificación.
- No modificar archivos no relacionados con la tarea.
- Priorizar cambios pequeños, claros y revisables.
- Mantener consistencia con los patrones actuales del proyecto.
- Revisar templates, componentes, servicios, estados, rutas, estilos y tests relacionados antes de modificar.
- No romper compatibilidad con SSR si el proyecto usa Angular Universal.
- No introducir dependencias nuevas sin justificarlo.
- No dejar código muerto, logs innecesarios o comentarios basura.

## Angular

- Usar patrones idiomáticos de Angular.
- Respetar la versión actual del proyecto.
- Si el proyecto usa Angular 17+, se puede usar control flow moderno `@if`, `@for`, `@switch` solo si ya está presente en el código.
- Si el proyecto usa NgRx, respetar separación entre actions, effects, reducers/selectors y services.
- No poner lógica de negocio compleja directamente en templates.
- Evitar suscripciones manuales innecesarias.
- Si se usan subscriptions, limpiar correctamente con `takeUntilDestroyed`, `DestroyRef`, `async pipe` o patrón existente.
- Evitar mutaciones peligrosas de estado.
- Tipar correctamente inputs, outputs, servicios y modelos.
- No usar `any` salvo justificación clara.
- Evitar lógica duplicada entre componentes.

## Componentes

- Mantener componentes enfocados y legibles.
- Extraer lógica repetida a helpers, services o computed values si aplica.
- Validar estados de carga, error, vacío y éxito.
- Revisar comportamiento responsive.
- Revisar accesibilidad básica:
  - botones con texto o `aria-label`
  - imágenes con `alt` cuando aplique
  - navegación por teclado si aplica
  - foco visible en elementos interactivos

## Estilos

- **OFFICIAL SOURCE OF TRUTH:** Always refer to `/colors-and-guidelines.md` for all visual rules, colors, spacing, and typography.
- Respetar estilos existentes del proyecto.
- No romper responsive.
- Evitar `!important` salvo necesidad real.
- Validar pantallas pequeñas.
- Evitar overflow horizontal.
- Cuidar textos largos, especialmente en varios idiomas.
- **NO MODERNIZATION REFACTORS:** No cambiar diseño visual más allá del alcance solicitado ni realizar refactors de UI automáticos.

## Servicios y APIs

- Mantener separación entre componente y servicio.
- Centralizar llamadas HTTP en services o repositories existentes.
- Manejar errores HTTP.
- No duplicar endpoints.
- No hardcodear URLs, tokens o secretos.
- Revisar interceptors existentes antes de agregar lógica nueva.

## Rutas y guards

- No cambiar rutas sin revisar impacto.
- Validar navegación por idioma si el proyecto usa rutas localizadas.
- No confiar en parámetros de URL para acceso a pantallas protegidas sin validación adecuada.
- Respetar guards, resolvers y estrategias existentes.

## Tests

Cuando aplique, agregar o ajustar tests para:

- Comportamiento del componente.
- Servicios.
- Guards.
- Pipes.
- Selectors/effects si usa NgRx.
- Casos de error y estados vacíos.

## Comandos de validación

Antes de dar una tarea por terminada, ejecutar según disponibilidad del proyecto:

npm install solo si es necesario

npm run lint
npm test
npm run build

Si el proyecto usa SSR:

npm run build:ssr

Si algún comando no existe, reportarlo claramente.

## Formato de respuesta final

Al terminar una tarea, responder con:

1. Resumen del cambio.
2. Archivos modificados.
3. Validaciones ejecutadas.
4. Resultado de pruebas/build/lint.
5. Riesgos o pendientes.
6. Siguiente paso recomendado.

## Modo bug-fixer

Cuando el usuario diga "usa el modo bug-fixer", actúa como desarrollador frontend senior especializado en corrección de bugs Angular.

### Objetivo principal

Resolver bugs de manera segura, mínima y consistente con la arquitectura actual del proyecto.

---

## Reglas obligatorias

- Antes de modificar código, entender completamente el bug.
- Revisar flujo funcional completo relacionado.
- Respetar arquitectura Angular existente.
- Respetar patrones actuales del proyecto.
- No hacer refactors grandes innecesarios.
- No mezclar fixes con mejoras cosméticas.
- Hacer el cambio mínimo necesario.
- No modificar archivos no relacionados.
- Mantener compatibilidad responsive.
- Mantener compatibilidad SSR si el proyecto usa Angular Universal.
- Revisar impacto en mobile y desktop.
- Revisar impacto en i18n/traducciones si aplica.
- Revisar efectos secundarios en rutas, guards y estados globales.
- Revisar impacto en NgRx/store/effects/selectors si aplica.
- No usar `any` salvo necesidad real.
- No introducir dependencias nuevas sin justificarlo.
- Mantener tipado fuerte.
- Mantener componentes legibles y pequeños.

---

## Convención de ramas

Siempre crear ramas desde `main` actualizada.

Formato obligatorio:

fixBug/nombre-del-bug

Ejemplos:

fixBug/modal-scroll-mobile
fixBug/payment-toast-animation
fixBug/dashboard-route-validation

---

## Flujo obligatorio

### 1. Verificar estado actual

```bash
git status
