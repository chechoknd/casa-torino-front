# agent_ux_modernizar.md

Actúa como un Senior Frontend Engineer + UI/UX Designer experto en Angular y Responsive Design.
Debes modernizar visualmente el CRM de comidas manteniendo la identidad actual de colores y mejorando especialmente la experiencia mobile/tablet.

La aplicación actualmente funciona correctamente en desktop, pero necesita una experiencia responsive mucho más profesional, organizada y usable en dispositivos móviles.

## Identidad visual obligatoria

**OFFICIAL SOURCE OF TRUTH:** Always refer to `/colors-and-guidelines.md` for all colors, spacing, typography, and component styling.

Mantener la identidad actual:
* Backgrounds beige / cream
* Verde militar como color principal
* Diseño elegante, limpio y premium tipo SaaS moderno

NO cambiar:
* Branding
* Paleta principal
* Funcionalidades existentes
* Flujos de usuario

---

# Reglas obligatorias

* Diseño **pixel perfect**
* Responsive real y consistente
* Mobile-first mindset sin romper desktop
* Usar spacing consistente (`8px`, `12px`, `16px`, `24px`, `32px`)
* Componentes reutilizables y desacoplados
* Bordes suaves (`12px - 20px`)
* Sombras modernas y sutiles
* Excelente jerarquía visual
* Tipografía limpia y moderna
* Mucho aire visual
* Evitar pantallas saturadas
* Evitar overflow horizontal
* Evitar scrolls innecesarios

---

# Responsive Design

## Objetivo principal

La aplicación debe sentirse:
* Natural en mobile
* Cómoda de usar con dedos
* Moderna
* Limpia
* Ordenada
* Rápida visualmente
* Profesional en cualquier tamaño de pantalla

---

# Navegación Mobile

Implementar experiencia mobile moderna:

## Menú hamburguesa lateral
* Side navigation moderna
* Apertura/cierre suave
* Overlay oscuro elegante
* Cierre al tocar fuera
* Mantener navegación actual
* Mantener iconos
* No afectar desktop

## Header Mobile
* Compacto
* Limpio
* Priorizando acciones importantes
* Correcta alineación visual

---

# Layout Responsive

Revisar y optimizar:

* Dashboards
* Cards
* Formularios
* Tablas
* Headers
* Sidebars
* Modales
* Inputs
* Botones
* Grids
* Toolbars
* Filtros
* Listados

## Reglas de layout

* Evitar widths fijos
* Usar flex/grid correctamente
* Usar min/max widths cuando aplique
* Mantener consistencia visual
* Correcto manejo de espacios
* Reorganizar elementos en mobile cuando sea necesario
* Mantener buena lectura y escaneo visual

---

# Tablas

Las tablas deben adaptarse correctamente a mobile:

* Evitar romper layout
* Permitir scroll controlado si es necesario
* Priorizar información importante
* Mantener buena legibilidad
* Evitar columnas imposibles de leer
* Considerar transformación a cards en mobile si aplica

---

# Formularios

Mejorar UX mobile:

* Inputs cómodos para táctil
* Labels claras
* Espaciado correcto
* Botones accesibles
* Buen manejo de errores
* Correcta alineación responsive

---

# UX/UI

Implementar estados visuales completos:

* Hover
* Focus
* Active/Pressed
* Disabled
* Loading/Skeletons
* Empty states
* Success/Error feedback

---

# Estilo visual esperado

Inspiración:

* CRM moderno
* Dashboard premium
* SaaS elegante
* Minimalismo moderno
* Cards limpias
* Tablas modernas
* Inputs refinados
* Botones con profundidad
* Transiciones fluidas (`150ms - 250ms`)
* Microinteracciones suaves
* Navegación intuitiva

---

# Angular

* Mantener arquitectura limpia
* Usar componentes reutilizables
* Centralizar variables visuales y theme tokens
* Mejorar consistencia visual global
* Evitar código duplicado
* Mantener performance
* Mantener accesibilidad
* No romper funcionalidades existentes
* No modificar lógica de negocio

---

# Breakpoints

Validar correctamente:

* 320px
* 375px
* 425px
* 768px
* 1024px+
* Desktop wide

---

# Validaciones Obligatorias

Antes de finalizar:

1. Ejecutar lint
2. Ejecutar build
3. Verificar responsive real
4. Verificar navegación mobile
5. Verificar que desktop siga intacto
6. Verificar que no exista overflow horizontal
7. Verificar accesibilidad básica
8. Verificar spacing consistente
9. Verificar alineaciones visuales

---

# Objetivo Final

Que la aplicación se vea y se sienta como un SaaS moderno, premium y profesional enfocado en gestión de comidas, pedidos y clientes, con una experiencia mobile sólida, elegante y completamente usable.
