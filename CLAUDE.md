# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es

Landing page estática de una sola página para "Grúas Chuyín", servicio de grúas 24/7 en Tijuana. Todo el contenido está en español (`lang="es-MX"`).

No hay build, ni gestor de paquetes, ni tests, ni linter. Son tres archivos servidos tal cual: `index.html`, `styles.css`, `script.js`, más las imágenes `1.jpeg`–`6.jpeg` en la raíz. (`Info.jpeg` no se referencia desde ningún archivo.)

## Cómo correrlo

Abrir `index.html` en el navegador, o servirlo:

```bash
python -m http.server 8000
```

Las rutas de imágenes son relativas a la raíz del repo, así que el servidor debe arrancar ahí.

## Presupuesto de rendimiento

La única dependencia externa es Google Fonts, con **cinco pesos exactos** (Barlow 400/500/600 + Barlow Condensed 600/700). No agregar pesos ni familias sin quitar otros.

Los iconos son un **sprite SVG inline** al inicio de `<body>` (`<symbol id="i-*">`), consumido con `<svg class="ico"><use href="#i-tow"/></svg>`. Esto reemplazó a Font Awesome por CDN, que era render-blocking. **No reintroducir una librería de iconos**: para un icono nuevo, agregar un `<symbol>` al sprite.

`.ico` aplica `fill:none; stroke:currentColor` por defecto; los iconos sólidos (WhatsApp) necesitan además la clase `.ico-fill`.

## Sistema visual

Definido en `:root` de `styles.css`. Reglas que sostienen el estilo:

- **El rojo (`--red: #e10600`) es acento, no fondo.** Se usa en el botón primario, el panel CTA de servicios, los índices de sección y subrayados de 1–2px. No hay resplandores, blobs desenfocados ni gradientes radiales rojos — se eliminaron a propósito. Todo lo demás es negro (`--bg`) con superficies planas (`--surface`) separadas por hairlines (`--line`).
- **Separación por bordes, no por sombras.** El tema oscuro no lleva `box-shadow` decorativa; la jerarquía viene de bordes de 1px y del contraste entre `--bg` y `--surface`.
- **Radios pequeños** (`--radius: 4px`). Nada de esquinas redondeadas grandes.
- **Cada bloque llena la pantalla.** `.hero`, `.section` y `.cta-band` comparten `min-height: 100svh` + flex column centrado, para que el scroll no deje media sección a la vista. Es un piso, no una altura fija: si el contenido no cabe (servicios en móvil, cualquier sección en pantallas bajas) la sección crece. Se usa `svh` y no `vh` por la barra de direcciones móvil. Por eso `.gallery-grid` dimensiona sus filas con `clamp(px, vh, px)` en vez de píxeles fijos: así la retícula cabe en pantalla. El footer queda fuera de esta regla.
- Display en `--font-display` (Barlow Condensed, mayúsculas, `line-height: .98`); cuerpo en `--font-body`.
- `.services-grid` simula sus divisores con `gap: 1px` sobre un fondo `--line`; por eso las tarjetas no llevan borde propio.

## Contrato CSS/JS

No hay framework. `script.js` solo agrega y quita clases que `styles.css` define:

- `.header.scrolled` — se activa con `scrollY > 12`, leído dentro de `requestAnimationFrame`.
- `.nav-links.open` / `.menu-toggle.open` — menú móvil; cierra con clic fuera, Escape, clic en un enlace, y al pasar de 768px vía `matchMedia`. Ese breakpoint debe coincidir con la media query de `styles.css`.
- `.nav-links a.is-active` — scrollspy por IntersectionObserver sobre `main section[id]`.
- `body.loaded` — dispara la animación escalonada de entrada del hero.
- `.floating-buttons.is-visible` — acciones flotantes de escritorio.
- `.reveal` → `.reveal.visible` — para animar un elemento nuevo al entrar en viewport, basta con ponerle la clase `reveal`.

**Retrasos escalonados:** `script.js` recorre `.services-grid .card, .coverage-list li, .gallery-grid .gallery-item` y les fija `--reveal-delay`. Ese selector está acoplado al DOM — si cambian los contenedores hay que actualizarlo.

**El contenido nunca debe poder quedar oculto.** Hay tres salvaguardas que cualquier cambio de animación debe conservar: un timeout de 1800ms que revela todo, una rama sin IntersectionObserver, y `prefers-reduced-motion` que desactiva `.reveal` en CSS.

## CTA duplicados

El teléfono **664 334 8126** aparece en nueve lugares de `index.html`, en tres formatos: `tel:+526643348126`, el texto visible `664 334 8126`, y `wa.me/526643348126` con mensaje pre-cargado (hay dos mensajes distintos: el genérico de grúa y el de cotización de compra). Un cambio de número o de mensaje debe aplicarse en todos.

Los puntos de conversión son: nav, hero, panel CTA de servicios, enlaces de tarjeta, banda `.cta-band`, footer, y las acciones fijas. **Las acciones fijas son dos componentes excluyentes por breakpoint**: `.floating-buttons` (botones cuadrados, solo escritorio) y `.action-bar` (barra inferior a ancho completo, solo ≤768px). El `padding-bottom` de `body` en móvil reserva el alto de `.action-bar` — si cambia el alto de la barra, hay que cambiar ese padding.
