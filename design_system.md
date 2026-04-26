Usa este archivo como contexto de sistema cada vez que generes o modifiques UI del panel administrativo.


🎨 Identidad Visual
Marca: Casa Torino — Soluciones Gastronómicas
Estilo: Orgánico · Cálido · Profesional · Mediterráneo moderno
Tono visual: Refinado pero accesible. Como un restaurante de alta calidad que te hace sentir en casa.

🌈 Paleta de Colores (CSS Variables)
css:root {
  /* Fondos */
  --color-bg:           #F5F0E8; /* Crema principal — fondo de toda la app */
  --color-bg-alt:       #EDE8DA; /* Crema oscuro — cards, sidebars, inputs */
  --color-surface:      #FAF8F3; /* Crema casi blanco — modales, popovers */

  /* Marca */
  --color-primary:      #2D5016; /* Verde Casa Torino — botones, íconos activos */
  --color-primary-hover:#3D6B20; /* Verde hover */
  --color-primary-light:#4A8029; /* Verde medio — badges, tags */
  --color-primary-muted:#D4E6C3; /* Verde pálido — backgrounds de estado */

  /* Texto */
  --color-text-primary: #1E3A0F; /* Verde muy oscuro — títulos */
  --color-text-body:    #3B4A2F; /* Verde oscuro suave — párrafos */
  --color-text-muted:   #7A8C6E; /* Verde grisáceo — subtítulos, placeholders */
  --color-text-inverse: #F5F0E8; /* Crema — texto sobre fondo verde */

  /* Bordes & Separadores */
  --color-border:       #C8BFA8; /* Borde neutro cálido */
  --color-border-focus: #2D5016; /* Borde en foco — inputs activos */

  /* Estados */
  --color-success:      #3D6B20;
  --color-warning:      #A07830;
  --color-error:        #8B2E2E;
  --color-info:         #2D5016;

  /* Sombras */
  --shadow-sm:  0 1px 3px rgba(30, 58, 15, 0.08);
  --shadow-md:  0 4px 12px rgba(30, 58, 15, 0.10);
  --shadow-lg:  0 8px 24px rgba(30, 58, 15, 0.12);
}

✍️ Tipografía
css/* Títulos: serifas elegantes con carácter mediterráneo */
font-family: 'Playfair Display', 'Lora', Georgia, serif;

/* Cuerpo y UI: sans legible, no genérica */
font-family: 'DM Sans', 'Nunito', 'Outfit', sans-serif;

/* Monoespaciado (precios, códigos) */
font-family: 'DM Mono', 'Fira Code', monospace;
Escala tipográfica:
TokenTamañoUso--text-xs11pxLabels, badges--text-sm13pxTexto secundario, ayudas--text-base15pxCuerpo principal--text-md17pxSubtítulos--text-lg20pxTítulos de sección--text-xl24pxTítulos de página--text-2xl32pxHero, métricas grandes

📐 Espaciado & Grid (Sistema 8px)
Todo el espaciado debe ser múltiplo de 8px.
css--space-1:  4px;   /* Gaps mínimos entre íconos e inline */
--space-2:  8px;   /* Padding interno de badges/chips */
--space-3:  12px;  /* Gaps entre elementos inline */
--space-4:  16px;  /* Padding de inputs, padding base */
--space-5:  20px;  /* Separación entre campos de formulario */
--space-6:  24px;  /* Padding de cards */
--space-8:  32px;  /* Separación entre secciones */
--space-10: 40px;  /* Márgenes de página */
--space-12: 48px;  /* Separación entre bloques grandes */
--space-16: 64px;  /* Secciones hero */
Grid de layout:

Sidebar: 240px fijo (colapsable a 64px)
Contenido principal: fluid con max-width: 1200px
Padding de página: 32px desktop / 16px mobile
Columns internas: grid de 12 columnas, gap: 24px


🧱 Componentes — Reglas Base
Botones
Primario:   bg=--color-primary, text=--color-text-inverse, radius=8px, padding=12px 20px
Secundario: bg=transparent, border=--color-primary, text=--color-primary
Ghost:      bg=transparent, text=--color-primary, sin borde
Peligro:    bg=--color-error
Tamaño sm:  padding=8px 14px, text-sm
Tamaño lg:  padding=14px 24px, text-md
Cards
bg: --color-bg-alt
border: 1px solid --color-border
border-radius: 12px
padding: 24px
shadow: --shadow-sm
hover shadow: --shadow-md (transición 200ms ease)
Inputs & Formularios
bg: --color-surface
border: 1px solid --color-border
border-radius: 8px
padding: 10px 14px
focus: border-color=--color-border-focus, outline=none, box-shadow=0 0 0 3px rgba(45,80,22,0.15)
label: text-sm, color=--color-text-muted, margin-bottom=6px
gap entre campos: 20px
Tablas
header: bg=--color-bg-alt, text=--color-text-muted, font-weight=600, text-transform=uppercase, font-size=11px, letter-spacing=0.5px
row hover: bg=rgba(45,80,22,0.04)
border: 1px solid --color-border (solo horizontal)
padding de celda: 14px 16px
Sidebar / Navegación
bg: --color-primary
text: --color-text-inverse (opacity 0.75 normal, 1.0 activo)
item activo: bg=rgba(255,255,255,0.15), border-left=3px solid --color-text-inverse
íconos: 20px, alineados con el texto
gap entre items: 4px

📏 Reglas de Simetría y Alineación

Nunca mezclar bordes redondeados — elige un radio y úsalo consistentemente (8px para inputs/botones, 12px para cards, 16px para modales).
Alineación vertical siempre center para elementos inline (íconos + texto).
Márgenes de página uniformes — el padding horizontal del contenido debe ser idéntico arriba y abajo en cada sección.
Grids explícitos — nunca uses margin: auto como hack de alineación; usa display: grid o display: flex con gap.
Íconos — usa solo de una librería (Lucide React recomendado). Tamaño: 16px inline, 20px en navegación, 24px en heroes.
Separadores — usa gap del contenedor, nunca margin-top en el primer hijo ni margin-bottom en el último.


🚫 Prohibiciones de Diseño

❌ No usar blanco puro #FFFFFF — usar --color-surface o --color-bg
❌ No usar negro puro #000000 — usar --color-text-primary
❌ No usar grises neutros sin tono cálido (no #666666, sí #7A8C6E)
❌ No usar gradientes de colores — solo gradientes sutiles del mismo color (ej: crema → crema oscuro)
❌ No mezclar más de 2 familias tipográficas
❌ No usar px arbitrarios fuera de la escala de 8px (excepto bordes de 1px)
❌ No usar !important
❌ No usar position: absolute para centrar — usar flexbox/grid
❌ No usar fondos completamente planos en secciones hero — agregar textura sutil o patrón


✅ Checklist antes de entregar cualquier pantalla

 ¿Todos los colores usan las CSS variables definidas?
 ¿El espaciado es múltiplo de 8px?
 ¿Los bordes redondeados son consistentes (8/12/16px)?
 ¿Los íconos están alineados verticalmente con el texto?
 ¿Las cards tienen shadow-sm en reposo y shadow-md en hover?
 ¿Los estados (hover, focus, active, disabled) están definidos?
 ¿El layout es responsive (funciona en 768px y 1280px+)?
 ¿No hay colores hardcodeados fuera del sistema?