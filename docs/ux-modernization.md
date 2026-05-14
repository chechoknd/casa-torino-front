# UX Modernization Notes

## Objetivo visual

Modernizar el CRM hacia una experiencia SaaS premium sin abandonar la identidad actual de Casa Torino.

**Refer to `/colors-and-guidelines.md` for the complete visual system (Colors, Spacing, Typography).**

- Verde militar como color principal.
- Fondos beige/cream cálidos.
- Superficies elevadas, sombras sutiles y bordes suaves.
- Jerarquía visual clara para dashboards, tablas, formularios y navegación.

## Decisiones aplicadas

- Se centralizaron tokens visuales en `src/styles.scss`: radios, sombras, transiciones, focus ring, superficies y variantes de color.
- Se mantuvo la arquitectura existente de componentes standalone y NgRx; los cambios visuales viven mayormente en estilos globales reutilizables.
- Las tablas ahora usan un tratamiento más moderno con filas amplias, hover suave y scroll horizontal controlado en pantallas pequeñas.
- Se agregó `ct-skeleton-loader` como componente compartido para estados de carga sin introducir dependencias.
- Se reforzaron estados de hover, focus, active y disabled apoyándose en Angular Material y tokens del proyecto.
- Se preservó la paleta verde/beige, ajustando contraste y profundidad para una lectura más premium.

## Alcance inicial

- Shell global: navegación, topbar, footer y microinteracciones.
- Cards y tablas compartidas.
- Dashboard con skeletons para métricas y últimos pedidos.
- Listas clave: clientes, pedidos y pagos con skeleton loader.
- Accesibilidad básica: label explícito para el botón de contraer/expandir navegación y acciones de tabla tocadas.

## Pendientes recomendados

- Extender empty states explícitos a todas las tablas.
- Llevar skeletons a productos, ingredientes y recetas para consistencia total.
- Corregir configuración de tests para validar visual states en componentes.
