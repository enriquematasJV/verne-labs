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
│   ├── components/                      ← ★ ÚNICO LUGAR PARA COMPONENTES
│   │   ├── Canvas2DRenderer/
│   │   │   ├── Canvas2DRenderer.js      ← Renderizador 2D con canvas
│   │   │   ├── canvas-2d-renderer.css
│   │   │   └── README.md
│   │   ├── ChartRenderer/
│   │   │   ├── ChartRenderer.js         ← Renderizador de gráficos
│   │   │   └── README.md
│   │   ├── Graph2DEngine/
│   │   │   ├── Graph2DEngine.js         ← Motor gráfico 2D
│   │   │   └── README.md
│   │   ├── GraphDisplay/
│   │   │   ├── graph-display.css        ← Estilos base para gráficos
│   │   │   └── README.md
│   │   ├── GraphNavigator/
│   │   │   ├── GraphNavigator.js        ← Pan/zoom
│   │   │   ├── graph-navigator.css
│   │   │   └── README.md
│   │   ├── GraphRenderer/
│   │   │   ├── GraphRenderer.js         ← ★ RENDERIZADOR MODULAR
│   │   │   ├── README.md
│   │   │   └── graph-renderer.css
│   │   ├── KinematicsEngine/
│   │   │   ├── KinematicsEngine.js      ← Motor cinemático
│   │   │   └── README.md
│   │   ├── MathUtils/
│   │   │   ├── MathUtils.js             ← Utilidades matemáticas
│   │   │   └── README.md
│   │   ├── MathematicalModelPanel/
│   │   │   ├── MathematicalModelPanel.js ← Panel de modelos matemáticos
│   │   │   ├── mathematical-model-panel.css
│   │   │   └── README.md
│   │   ├── OdeSolverRK4/
│   │   │   ├── OdeSolverRK4.js          ← Solver ODE Runge-Kutta 4
│   │   │   └── README.md
│   │   ├── PhysicsEngine/
│   │   │   ├── PhysicsEngine.js         ← Motor de física
│   │   │   └── README.md
│   │   ├── SimulationLifecycle/
│   │   │   ├── SimulationLifecycle.js   ← Ciclo de vida de simulaciones
│   │   │   ├── simulation-lifecycle.css
│   │   │   └── README.md
│   │   ├── SliderControl/
│   │   │   ├── SliderControl.js         ← Control deslizante reutilizable
│   │   │   ├── slider-control.css
│   │   │   └── README.md
│   │   ├── Vector2D/
│   │   │   ├── Vector2D.js              ← Clase vector 2D
│   │   │   └── README.md
│   │   ├── VectorRenderer/
│   │   │   ├── VectorRenderer.js        ← Renderizador de vectores
│   │   │   └── README.md
│   │   └── VerneMath/
│   │       ├── VerneMath.js             ← ★ Compilador de expresiones
│   │       ├── README.md
│   │       └── verne-math.css
│   └── css/
│       └── labs-common.css
├── simulaciones/
│   ├── funciones-inecuaciones/
│   │   ├── index.html                   ← ★ REFACTORIZADO (usa /components)
│   │   ├── funciones-inecuaciones.css
│   │   └── README.md
│   ├── derivadas/
│   │   ├── index.html                   ← ★ REFACTORIZADO (usa /components)
│   │   ├── derivadas.css
│   │   └── README.md
│   ├── cinematica-2d/
│   │   ├── index.html                   ← ✅ REFACTORIZADO (usa /components)
│   │   ├── cinematica-2d.css
│   │   └── README.md
│   ├── plano-inclinado/
│   │   ├── index.html                   ← ✅ REFACTORIZADO (usa /components)
│   │   ├── plano-inclinado.css
│   │   └── README.md
│   └── [otros labs...]
└── index.html                           ← Portal principal
```

## Consolidación de Componentes

**ESTADO: ✅ COMPLETADO (2026-07-25)**

Todos los componentes reutilizables están centralizados en `/shared/components/`. La carpeta legacy `/shared/js/` ha sido **eliminada completamente**.

### Componentes Actuales (16 componentes)

| Componente | Tipo | Descripción |
|---|---|---|
| **VerneMath** | Matemática | Compilador seguro de expresiones (2x, sin(x), etc.) |
| **Vector2D** | Matemática | Clase vector 2D con operaciones básicas |
| **MathUtils** | Matemática | Utilidades matemáticas generales |
| **PhysicsEngine** | Física | Motor de física para simulaciones |
| **OdeSolverRK4** | Física | Solver ODE Runge-Kutta orden 4 |
| **KinematicsEngine** | Física | Motor cinemático para movimientos |
| **SimulationLifecycle** | Simulación | Gestor del ciclo de vida de simulaciones |
| **Canvas2DRenderer** | Renderización | Renderizador 2D con canvas |
| **GraphRenderer** | Renderización | Renderizador modular de gráficos XY |
| **Graph2DEngine** | Renderización | Motor completo para gráficos 2D |
| **ChartRenderer** | Renderización | Renderizador de gráficos/charts |
| **VectorRenderer** | Renderización | Renderizador de vectores |
| **GraphDisplay** | UI | Estilos base para elementos gráficos |
| **GraphNavigator** | UI | Control de pan y zoom para gráficos |
| **SliderControl** | UI | Control deslizante reutilizable |
| **MathematicalModelPanel** | UI | Panel para mostrar modelos matemáticos |

### Labs Completamente Refactorizados (4/4)

| Lab | Estado | Componentes |
|---|---|---|
| **Derivadas** | ✅ 100% | 4 componentes, todos en /components/ |
| **Funciones-Inecuaciones** | ✅ 100% | 4 componentes, todos en /components/ |
| **Cinemática 2D** | ✅ 100% | 6 componentes, todos en /components/ |
| **Plano Inclinado** | ✅ 100% | 8 componentes, todos en /components/ |

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
- [x] Refactorizar labs restantes (Cinemática 2D, Plano Inclinado)
- [x] Consolidar todos los componentes en /shared/components/
- [x] Eliminar /shared/js/ (legacy)
- [ ] Documentación de componentes (en progreso)
- [ ] Tests unitarios para GraphRenderer
- [ ] Temas de color (light/dark mode)
