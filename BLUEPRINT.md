# VerneLabs Blueprint — Arquitectura de Componentes Modulares

## Visión

VerneLabs es una plataforma de laboratorios virtuales JavaScript/HTML/CSS con arquitectura **100% modular**. Cada lab es independiente pero comparte componentes comunes reutilizables.

## Arquitectura

### Capas CSS (3-Tier Cascade)

```
┌─────────────────────────────────────────────────┐
│ /shared/assets/css/verne-theme.css              │  Nivel 1: GLOBAL
│ - Variables CSS (colores, tamaños, grid)        │
└─────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────┐
│ /shared/components/*/component.css              │  Nivel 2: COMPONENTES
│ - Estilos específicos del componente            │
│ - Auto-contenidos (no tocan estilos de otros)   │
└─────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────┐
│ /simulaciones/lab-name/lab-name.css             │  Nivel 3: LAB
│ - Solo layout y positioning                     │
│ - NO estilos de componentes                     │
└─────────────────────────────────────────────────┘
```

### Estructura de Directorios

```
verne-labs/
├── BLUEPRINT.md                          ← Este archivo
├── shared/
│   ├── assets/
│   │   └── css/
│   │       └── verne-theme.css          ← Variables CSS globales
│   ├── components/
│   │   ├── VerneMath/
│   │   │   ├── VerneMath.js             ← Compilador de expresiones
│   │   │   ├── README.md
│   │   │   └── verne-math.css
│   │   ├── GraphRenderer/
│   │   │   ├── GraphRenderer.js         ← ★ RENDERIZADOR MODULAR
│   │   │   ├── README.md
│   │   │   └── graph-renderer.css
│   │   ├── GraphDisplay/
│   │   │   ├── graph-display.css        ← Estilos base para gráficos
│   │   │   └── README.md
│   │   ├── GraphNavigator/
│   │   │   ├── GraphNavigator.js        ← Pan/zoom
│   │   │   ├── graph-navigator.css
│   │   │   └── README.md
│   │   └── [otros componentes...]
│   └── css/
│       └── labs-common.css
├── simulaciones/
│   ├── funciones-inecuaciones/
│   │   ├── index.html                   ← ★ REFACTORIZADO (usa GraphRenderer)
│   │   ├── funciones-inecuaciones.css
│   │   └── README.md
│   ├── derivadas/
│   │   ├── index.html                   ← ★ REFACTORIZADO (usa GraphRenderer)
│   │   ├── derivadas.css
│   │   └── README.md
│   └── [otros labs...]
└── index.html                           ← Portal principal
```

## Componentes Clave

### GraphRenderer — Renderizador 100% Modular

**Propósito:** Encapsular TODA la lógica de dibujo de grid y ejes. Garantizar consistencia visual 100% en todos los gráficos.

**Ubicación:** `/shared/components/GraphRenderer/`

**Uso:** Cualquier lab que dibuje gráficos XY debe usar GraphRenderer en lugar de código inline.

```javascript
const graphRenderer = new GraphRenderer(canvasOrSvgElement, {
  xMin: -10, xMax: 10,
  yMin: -10, yMax: 10,
  width: 520,
  height: 520,
  margin: 0  // Opcional: margen para etiquetas
});

graphRenderer.drawGridAndAxes();
```

**Propiedades:**
- Agnóstico de canvas/SVG
- Lee variables CSS globales (--grid-color, --grid-line-width, etc.)
- Soporta margin dinámico para labs con etiquetas de ejes
- Proporciona conversión de coordenadas: `xToPixel()`, `yToPixel()`, `pixelToX()`, `pixelToY()`

**Labs que lo usan:**
- ✅ funciones-inecuaciones (SVG)
- ✅ derivadas (Canvas con margin=52)

### VerneMath — Compilador de Expresiones

**Propósito:** Compilar y evaluar expresiones matemáticas de forma segura.

**Ubicación:** `/shared/components/VerneMath/`

**Características:**
- Soporta funciones: sin, cos, tan, sqrt, abs, log (base 10), ln (logaritmo natural), exp, ^, (), etc.
- Multiplicación implícita: `2x`, `3(x+1)`
- Validación de seguridad: bloquea identificadores peligrosos (window, document, fetch, eval, etc.)

**Bug Conocido (RESUELTO):** Conflicto entre ln() y log() debido a sustituciones regex en cascada. Solución: técnica de placeholder (`__NATURAL_LOG__`).

### GraphNavigator — Pan y Zoom

**Propósito:** Permitir navegación interactiva (arrastrar, zoom con rueda, pinch en móvil).

**Ubicación:** `/shared/components/GraphNavigator/`

## Estándares de Componentes

Cada componente debe cumplir:

1. **Auto-contenido:** JS + CSS + README en la carpeta del componente
2. **Reutilizable:** No depende de HTML específico del lab
3. **Documentado:** README explica uso y API
4. **Consistente:** Sigue el patrón de GraphRenderer como ejemplo

Ejemplo de componente bien diseñado:
```
/shared/components/MyComponent/
├── MyComponent.js        ← Lógica pura, sin HTML hardcoded
├── my-component.css      ← Estilos auto-contenidos
└── README.md             ← Guía de uso
```

## Migrando Labs Antiguos a GraphRenderer

### Checklist para refactorizar un lab:

- [ ] Agregar `<script src="../../shared/components/GraphRenderer/GraphRenderer.js"></script>`
- [ ] Crear instancia: `new GraphRenderer(element, options)`
- [ ] Llamar a `graphRenderer.drawGridAndAxes()` en la función render
- [ ] Eliminar código inline de `drawGrid()` o similar
- [ ] Verificar que el gráfico se ve idéntico
- [ ] Probar interactividad (pan, zoom, cambios de viewport)

### Labs Por Refactorizar

- [ ] cinematica-2d
- [ ] ecologia-poblaciones
- [ ] plano-inclinado
- [ ] [otros...]

## Variables CSS Globales

Definidas en `/shared/assets/css/verne-theme.css`:

```css
--grid-line-width: 0.5;     /* Ancho de línea del grid */
--grid-color: #e2e8f0;      /* Color del grid */
--axis-line-width: 1;       /* Ancho de línea de ejes */
--axis-color: #94a3b8;      /* Color de ejes */
```

**Nota:** Cambiar estas variables afecta TODOS los gráficos automáticamente.

## Notas Técnicas

### Flujo de Render en un Lab

1. `render()` se ejecuta (por interacción o cambio de viewport)
2. `graphRenderer.setViewport(...)` actualiza coordenadas
3. `graphRenderer.drawGridAndAxes()` limpia y dibuja grid
4. Funciones del lab dibujan su contenido (curvas, puntos, etc.)
5. Anotaciones se añaden si es necesario

### Margin en Canvas Labs

Algunos labs (ej: derivadas) necesitan margen para etiquetas de ejes. GraphRenderer soporta esto:

```javascript
const graphRenderer = new GraphRenderer(canvas, {
  // ... coordenadas ...
  margin: 52  // píxeles en cada lado
});
```

El margen se respeta en:
- Grid (se dibuja dentro del margen)
- Conversión de coordenadas (xToPixel, yToPixel)
- Viewport rendering

## Principios de Diseño

✅ **Modularidad extrema:** Un cambio en GraphRenderer afecta 100% de los gráficos.  
✅ **DRY (Don't Repeat Yourself):** Sin duplicación de código de grid.  
✅ **Consistencia visual:** Todos los gráficos se ven idénticos.  
✅ **Flexibility:** Labs pueden personalizar layout, no grid.  
✅ **Agnóstico:** Funciona con canvas y SVG sin cambios de lógica.  

## Roadmap

- [x] Crear GraphRenderer como componente modular
- [x] Refactorizar funciones-inecuaciones (SVG)
- [x] Refactorizar derivadas (Canvas + margin)
- [ ] Refactorizar labs restantes
- [ ] Documentación de componentes
- [ ] Tests unitarios para GraphRenderer
- [ ] Temas de color (light/dark mode)
