# BLUEPRINT: VerneLabs Lab-Creation Ecosystem

**Versión**: 2.1 (Mejorada)  
**Fecha**: 2026-07-25  
**Estado**: Guía arquitectónica + Especificación en progreso  
**Propósito**: Especificación para sistemas IA (ChatGPT, Claude, Gemini) que generan nuevos laboratorios educativos interactivos

**⚠️ NOTA IMPORTANTE**: Este documento es una **guía arquitectónica + referencia de patrones**, no una especificación completamente ejecutable sin acceso al repositorio real. Para crear un lab integrado, se requiere:
- Acceso al directorio `/shared/` real
- Validación numérica del modelo científico
- Tests y casos de uso conocidos

---

## 1. INTRODUCCIÓN Y FILOSOFÍA

### 1.1 ¿Qué es VerneLabs?

VerneLabs es un ecosistema de laboratorios virtuales interactivos para educación científica y matemática. Cada laboratorio es una **simulación + visualización + modelo pedagógico** que permite a estudiantes explorar conceptos mediante:

- **Simulación**: Motor físico o matemático que calcula el comportamiento del sistema
- **Visualización**: Canvas 2D interactivo con gráficos, vectores, anotaciones
- **Interactividad**: Sliders, inputs, botones que permiten variar parámetros
- **Pedagogía**: Paneles de fórmulas, métricas, y guías contextuales

### 1.2 Arquitectura General

```
┌─────────────────────────────────────────────────────┐
│          LABORATORIO (Lab Instance)                  │
├─────────────────────────────────────────────────────┤
│  HTML + CSS (layout + estilos específicos)          │
│  ↓                                                   │
│  ┌─────────────────────────────────────────────┐   │
│  │ Presenter (Orquestador MVP)                  │   │
│  │ - Conecta eventos DOM                        │   │
│  │ - Sincroniza Model ↔ View                    │   │
│  │ - Loop de renderizado                        │   │
│  └─────────────────────────────────────────────┘   │
│        ↓                ↓                 ↓          │
│    Model         View/DOM         Renderers        │
│   (lógica)      (DOM refs)      (Canvas/SVG)       │
│                                                      │
│  Usa Componentes SHARED: VerneMath, GraphRenderer,  │
│  Canvas2DRenderer, Vector2D, SimulationLifecycle    │
└─────────────────────────────────────────────────────┘
```

### 1.3 Patrones Arquitectónicos

**MVP (Model-View-Presenter)**:
- **Model**: Estado y cálculos (sin UI)
- **View**: Referencias DOM y actualizaciones UI
- **Presenter**: Orquestador que conecta ambos + lógica de rendering

**Modularización por Responsabilidad**:
- Componentes SHARED: reutilizables, bajo acoplamiento
- Módulos específicos del lab: lógica de dominio
- Constantes centralizadas: configuración visual y numérica

---

## 2. ESTRUCTURA DE DIRECTORIOS Y ARCHIVOS (ESTADO REAL)

⚠️ **Nota**: El proyecto está en transición. Hay componentes en dos ubicaciones:

```
verne-labs/
│
├── css/
│   ├── labs-common.css           [Estilos base globales]
│   └── theme.css                 [Variables CSS: colores, fuentes]
│
├── simulaciones/
│   ├── derivadas/
│   │   ├── index.html
│   │   ├── derivadas.css
│   │   └── js/
│   │       ├── DerivadaConstants.js
│   │       ├── DerivadaModel.js
│   │       └── DerivadaPresenter.js
│   │
│   ├── cinematica-2d/
│   │   ├── index.html
│   │   ├── css/cinematica-2d.css
│   │   └── js/
│   │       ├── CinematicaConstants.js
│   │       ├── CinematicaModel.js
│   │       ├── CinematicaPhysics.js
│   │       ├── SceneRenderer.js
│   │       ├── FormulasPanel.js
│   │       └── CinematicaPresenter.js
│   │
│   └── [más labs...]
│
├── shared/
│   ├── components/          [NUEVOS componentes - referencia única]
│   │   ├── VerneMath/
│   │   ├── GraphRenderer/
│   │   ├── Graph2DEngine/
│   │   ├── GraphNavigator/
│   │   ├── VectorRenderer/
│   │   ├── MathematicalModelPanel/
│   │   ├── SimulationLifecycle/
│   │   ├── OdeSolverRK4/
│   │   ├── PhysicsEngine/
│   │   ├── KinematicsEngine/
│   │   ├── SliderControl/
│   │   ├── Vector2D/
│   │   └── Canvas2DRenderer/
│   │
│   └── js/                  [VIEJOS componentes - legado, en transición]
│       ├── graphics/
│       ├── math/
│       ├── physics/
│       ├── simulations/
│       └── ui/
│
└── documentacion/
    └── BLUEPRINT-VERNE-LABS-COMPLETO.md [Este archivo]
```

### Rutas REALES en uso (observadas en labs)

**Componentes nuevos** (preferir estos):
```
../../shared/components/VerneMath/VerneMath.js
../../shared/components/GraphRenderer/GraphRenderer.js
../../shared/components/GraphNavigator/GraphNavigator.js
../../shared/components/Graph2DEngine/Graph2DEngine.js
../../shared/components/MathematicalModelPanel/MathematicalModelPanel.js
../../shared/components/VectorRenderer/VectorRenderer.js
```

**Componentes viejos** (legado, todavía en uso):
```
../../shared/js/graphics/Canvas2DRenderer.js
../../shared/js/math/Vector2D.js
../../shared/js/physics/PhysicsEngine.js
../../shared/js/physics/OdeSolverRK4.js
../../shared/js/physics/KinematicsEngine.js
../../shared/js/simulations/SimulationLifecycle.js
../../shared/js/ui/SliderControl.js
```

**Plan de migración**: Mover todos a `/shared/components/` cuando se estabilice.

---

## 3. COMPONENTES SHARED: ESPECIFICACIÓN COMPLETA

### 3.1 VerneMath — Parser de Expresiones Matemáticas

**Ubicación**: `/shared/components/VerneMath/VerneMath.js`

**Responsabilidad**: Compilar y evaluar expresiones matemáticas f(x) escritas por usuarios, con validación de seguridad.

**API**:
```javascript
VerneMath.compile(expressionString, options) 
  // → función compilada que puede evaluarse
  
VerneMath.safeEvaluate(compiledFunction, x)
  // → número (y) o NaN

VerneMath.parseExpression(line, options)
  // → {expr, color, fn, error?}
```

**Características**:
- Multiplicación implícita: `2x` → `2*x`, `3(x+1)` → `3*(x+1)`
- Funciones: `sin(x)`, `cos(x)`, `tan(x)`, `sqrt(x)`, `log(x)`, `ln(x)`, `exp(x)`
- Operadores: `+`, `-`, `*`, `/`, `^` (potencia)
- Constantes: `pi`, `e`
- Validación: whitelist de caracteres + detección de identificadores peligrosos
- Manejo de errores: try/catch con mensajes en español

**Código Fuente Abreviado**:
```javascript
(function (global) {
  'use strict';

  function compile(raw, options) {
    options = options || {};
    var variable = options.variable || 'x';
    var expr = sanitize(raw, options);
    
    if (DANGEROUS_IDENTIFIERS.test(raw)) {
      throw new Error('La expresión usa un nombre no permitido.');
    }
    
    var fn = new Function(
      variable,
      'var y = ' + expr + ';\n' +
      'if (!Number.isFinite(y)) return NaN;\n' +
      'return y;'
    );
    
    return fn;
  }

  function safeEvaluate(fn, x) {
    try {
      var y = fn(x);
      return Number.isFinite(y) ? y : NaN;
    } catch (error) {
      return NaN;
    }
  }

  global.VerneMath = {
    compile: compile,
    safeEvaluate: safeEvaluate,
    parseExpression: parseExpression,
  };
})(window);
```

---

### 3.2 Canvas2DRenderer — Primitivas Gráficas

**Ubicación**: `/shared/js/graphics/Canvas2DRenderer.js`

**Responsabilidad**: Wrapper de Canvas 2D con métodos para dibujar primitivas geométricas.

**API**:
```javascript
new Canvas2DRenderer(canvasElement)

renderer.clear(color)
renderer.drawRect(x, y, width, height, fillColor, strokeColor, lineWidth)
renderer.drawCircle(x, y, radius, fillColor, strokeColor, lineWidth)
renderer.drawLine(x1, y1, x2, y2, color, lineWidth)
renderer.drawPolygon(points, fillColor, strokeColor, lineWidth)
renderer.drawArrow(x1, y1, x2, y2, color, label, lineWidth)
renderer.drawArc(x, y, radius, startAngle, endAngle, strokeColor, lineWidth)
renderer.drawText(text, x, y, fontSize, fontWeight, color, textAlign)
renderer.drawPath(points, strokeColor, lineWidth, closed)
```

---

### 3.3 Vector2D — Matemática Vectorial

**Ubicación**: `/shared/js/math/Vector2D.js`

**Responsabilidad**: Operaciones vectoriales 2D, descomposiciones, proyecciones.

**API**:
```javascript
new Vector2D(x, y)

// Operaciones básicas
vector.add(other)           // → Vector2D
vector.subtract(other)      // → Vector2D
vector.scale(scalar)        // → Vector2D
vector.magnitude()          // → número
vector.normalize()          // → Vector2D
vector.dot(other)           // → número

// Descomposición
vector.decompose(axisParallel, axisPerp)
  // → {parallel, perpendicular, parallelScalar, perpendicularScalar}

vector.projectOntoAxis(axis)  // → Vector2D
vector.projectScalar(axis)    // → número

// Métodos estáticos
Vector2D.resultant(vectors)   // suma vectores
Vector2D.average(vectors)     // promedio vectores
```

**Código Fuente Completo**:
```javascript
class Vector2D {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  static from(x, y) {
    return new Vector2D(x, y);
  }

  add(other) {
    return new Vector2D(this.x + other.x, this.y + other.y);
  }

  subtract(other) {
    return new Vector2D(this.x - other.x, this.y - other.y);
  }

  scale(scalar) {
    return new Vector2D(this.x * scalar, this.y * scalar);
  }

  dot(other) {
    return this.x * other.x + this.y * other.y;
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    const mag = this.magnitude();
    if (mag === 0) return new Vector2D(0, 0);
    return new Vector2D(this.x / mag, this.y / mag);
  }

  decompose(axisParallel, axisPerp) {
    return {
      parallel: this.projectOntoAxis(axisParallel),
      perpendicular: this.projectOntoAxis(axisPerp),
      parallelScalar: this.projectScalar(axisParallel),
      perpendicularScalar: this.projectScalar(axisPerp)
    };
  }

  projectScalar(axis) {
    const normalized = axis.normalize();
    return this.dot(normalized);
  }

  projectOntoAxis(axis) {
    const normalized = axis.normalize();
    const scalar = this.dot(normalized);
    return normalized.scale(scalar);
  }
}
```

---

### 3.4 GraphRenderer — Ejes, Grid, Escalado

**Ubicación**: `/shared/components/GraphRenderer/GraphRenderer.js`

**Responsabilidad**: Dibujar gráfico cartesiano con ejes, grid y escalado automático.

**API**:
```javascript
new GraphRenderer(canvasElement, options)

renderer.setViewport(xMin, xMax, yMin, yMax)
renderer.drawGridAndAxes()
renderer.clear()
renderer.xToPixel(x)  // → px
renderer.yToPixel(y)  // → py
renderer.pixelToX(px) // → x
renderer.pixelToY(py) // → y
```

**Características**:
- Grid automático con pasos "bonitos" (1, 2, 5, 10, ...)
- Ejes con etiquetas
- Conversión de coordenadas matemáticas ↔ píxeles
- Soporte para diferentes tamaños de canvas
- Variables CSS para colores (--grid-color, --axis-color)

---

### 3.5 SimulationLifecycle — Máquina de Estados

**Ubicación**: `/shared/components/SimulationLifecycle/SimulationLifecycle.js`

**Responsabilidad**: Control centralizado de simulaciones (start, pause, resume, reset).

**API**:
```javascript
lifecycle = new SimulationLifecycle(onStep, onReset, canStartFn)
  // onStep: (deltaTime) → void
  // onReset: () → void
  // canStartFn: () → boolean

lifecycle.start()         // inicia simulación
lifecycle.pause()         // pausa
lifecycle.resume()        // reanuda desde pausa
lifecycle.reset()         // reinicia

lifecycle.on('onStart', callback)
lifecycle.on('onPause', callback)
lifecycle.on('onResume', callback)
lifecycle.on('onReset', callback)
```

**Estados**:
```
[STOPPED] --start--> [RUNNING] --pause--> [PAUSED]
                         ↑                      ↑
                         |----resume------------|
                         |
                         +--reset--> [STOPPED]
```

---

### 3.6 MathematicalModelPanel — Fórmulas Dinámicas

**Ubicación**: `/shared/components/MathematicalModelPanel/MathematicalModelPanel.js`

**Responsabilidad**: Panel que actualiza valores de ecuaciones en tiempo real.

**API**:
```javascript
panel = new MathematicalModelPanel({
  formulas: [
    { id: 'formulaX', digits: 2 },
    { id: 'formulaY', digits: 3 }
  ],
  calculator: (state) => ({
    formulaX: state.x * 2,
    formulaY: state.y / 3
  })
})

panel.update({x: 1.5, y: 4.5})  // actualiza fórmulas en DOM
```

---

### 3.7 VectorRenderer — Visualización de Vectores

**Ubicación**: `/shared/components/VectorRenderer/VectorRenderer.js`

**Responsabilidad**: Dibujar vectores, flechas, descomposiciones, campos vectoriales.

**API**:
```javascript
renderer = new VectorRenderer(canvas, constants)

renderer.drawArrow(x1, y1, x2, y2, color, label)
renderer.drawDecomposedVector(origin, vector, axis1, axis2, scale, colors)
renderer.drawVectorSet(origin, vectors, scale)
renderer.drawVectorField(fn, bounds, step, color, scale)
renderer.drawMeasure(x1, y1, x2, y2, color, text, markSize)
renderer.drawVelocityComponents(origin, velocity, config)
renderer.drawAcceleration(origin, magnitude, color, label)
```

---

### 3.8 PhysicsEngine — Simulación Física

**Ubicación**: `/shared/js/physics/PhysicsEngine.js`

**Responsabilidad**: Motor de física para fuerzas, gravedad, fricción, aceleración.

**API**:
```javascript
engine = new PhysicsEngine({
  gravity: 9.81,
  friction: 0.2,
  timestep: 0.016
})

engine.addForce(magnitude, angleRad)
engine.applyGravity(mass)
engine.calculateAcceleration(mass)
engine.step(state)  // actualiza velocidad/posición
```

---

### 3.9 OdeSolverRK4 — Integración Numérica

**Ubicación**: `/shared/components/OdeSolverRK4/OdeSolverRK4.js`

**Responsabilidad**: Resolver EDOs (ecuaciones diferenciales ordinarias) con Runge-Kutta 4to orden.

**Uso en Cinemática 2D**:
```javascript
solver = new OdeSolverRK4(
  (t, state) => ({
    dxdt: state.vx,
    dvxdt: 0  // sin aceleración horizontal
  })
)

const newState = solver.step(currentState, dt)
```

---

## 4. LABORATORIOS MODELO: ESPECIFICACIÓN EJECUTABLE

Cada laboratorio es un ejemplo completo y funcional. Los IAI deben estudiar su estructura y replicarla.

---

## 4.1 Laboratorio Modelo 1: DERIVADAS (Tipo: ESTÁTICO)

**Categoría**: Cálculo diferencial  
**Tipo de Simulación**: Estática (sin dinámica, solo cálculos)  
**Pedagogía**: Límite de la derivada cuando h → 0

### 4.1.1 Estructura HTML Principal

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Simulación: derivada como límite</title>
  <link rel="stylesheet" href="../../css/labs-common.css" />
  <link rel="stylesheet" href="./derivadas.css" />
</head>
<body>
  <header class="page-header">
    <h1>Simulación de Derivada en un Punto</h1>
    <p>Laboratorio virtual para visualizar la derivada como límite de la pendiente secante cuando el incremento h tiende a cero.</p>
    <a class="back-link" href="../../index.html#simulaciones">← Volver a simulaciones</a>
  </header>

  <main>
    <section class="canvas-card">
      <canvas id="graph" width="1100" height="720"></canvas>
    </section>

    <aside>
      <section class="controls-card">
        <h2>Controles</h2>
        <!-- Función de entrada -->
        <div class="control">
          <label for="functionInput">Función y = f(x)</label>
          <input id="functionInput" type="text" value="x^2" />
          <div class="button-row">
            <button class="secondary" data-fn="x^2">x²</button>
            <button class="secondary" data-fn="sin(x)">sin(x)</button>
            <button class="secondary" data-fn="cos(x)">cos(x)</button>
          </div>
          <div id="errorBox" class="error"></div>
        </div>

        <!-- Punto de evaluación -->
        <div class="control">
          <label for="xPoint">Punto x</label>
          <input id="xPoint" type="number" value="1" step="0.1" />
        </div>

        <!-- Incremento h (slider) -->
        <div class="control">
          <label for="hSlider">Incremento h</label>
          <input id="hSlider" type="range" min="-3" max="3" step="0.001" value="1.5" />
          <div class="value-line"><span>h actual</span><strong id="hValue">1.5000</strong></div>
        </div>

        <!-- Zoom y viewport -->
        <div class="control">
          <label for="zoomSlider">Escala / zoom de la vista</label>
          <input id="zoomSlider" type="range" min="2" max="30" step="0.1" value="6" />
          <div class="value-line"><span>Ventana visible</span><strong id="zoomValue">±6.0000</strong></div>
        </div>

        <!-- Botones de animación -->
        <div class="button-row">
          <button id="towardsZeroBtn">Animar h → 0</button>
          <button id="pauseBtn" class="ghost">Pausar</button>
          <button id="resetBtn" class="ghost">Reiniciar</button>
        </div>
      </section>

      <section class="info-card">
        <h2>Lectura matemática</h2>
        <div class="formula-box">
          <div>Pendiente secante: m(h) = <span id="formulaSecante">0.0000</span></div>
          <div>Derivada en el punto: f'(x) ≈ <span id="formulaTangente">0.0000</span></div>
        </div>

        <div class="metrics">
          <div class="metric"><span>x</span><strong id="metricX">1.0000</strong></div>
          <div class="metric"><span>x + h</span><strong id="metricXH">2.5000</strong></div>
          <div class="metric"><span>f(x)</span><strong id="metricFX">1.0000</strong></div>
          <div class="metric"><span>f(x+h)</span><strong id="metricFXH">6.2500</strong></div>
          <div class="metric"><span>Δx = h</span><strong id="metricDX">1.5000</strong></div>
          <div class="metric"><span>Δy</span><strong id="metricDY">5.2500</strong></div>
          <div class="metric"><span>m secante</span><strong id="metricM">3.5000</strong></div>
          <div class="metric"><span>m tangente aprox.</span><strong id="metricTangent">2.0000</strong></div>
        </div>
      </section>
    </aside>
  </main>

  <!-- SHARED: Componentes -->
  <script src="../../shared/components/VerneMath/VerneMath.js"></script>
  <script src="../../shared/components/GraphRenderer/GraphRenderer.js"></script>
  <script src="../../shared/components/GraphNavigator/GraphNavigator.js"></script>
  <script src="../../shared/components/MathematicalModelPanel/MathematicalModelPanel.js"></script>

  <!-- ESPECÍFICO: Derivadas -->
  <script src="./js/DerivadaConstants.js"></script>
  <script src="./js/DerivadaModel.js"></script>
  <script src="./js/DerivadaPresenter.js"></script>

  <script>
    // ===== INICIALIZACIÓN =====
    const canvas = document.getElementById('graph');
    const dom = {
      canvas: canvas,
      functionInput: document.getElementById('functionInput'),
      xPoint: document.getElementById('xPoint'),
      hSlider: document.getElementById('hSlider'),
      // ... más referencias DOM
    };

    const graphRenderer = new GraphRenderer(canvas);
    const model = new DerivadaModel(DerivadaConstants);
    const formulasPanel = new MathematicalModelPanel({
      formulas: [
        { id: 'formulaSecante', digits: 4 },
        { id: 'formulaTangente', digits: 4 }
      ],
      calculator: (state) => ({
        formulaSecante: (state.fxh - state.fx) / state.h,
        formulaTangente: model.derivativeApprox(state.x)
      })
    });

    const presenter = new DerivadaPresenter(
      model, canvas, dom, graphRenderer, 
      DerivadaConstants, formulasPanel
    );
    presenter.updateUI();
    presenter.render();
  </script>
</body>
</html>
```

### 4.1.2 DerivadaConstants.js — Configuración

```javascript
const DerivadaConstants = {
  COLORS: {
    function: '#2563eb',        // Azul: función f(x)
    tangent: '#059669',         // Verde: recta tangente
    secant: '#dc2626',          // Rojo: recta secante
    triangle: '#ea580c',        // Naranja: triángulo Δx, Δy
    point: '#111827',           // Negro: puntos
  },
  
  RENDERING: {
    lineWidth: 2.6,
    lineWidthSecant: 2.2,
    margin: 10,
    samples: 900,
    pointRadius: 5.5,
    pointLabelOffsetX: 8,
  },
  
  ANIMATION: {
    decayFactor: 0.94,          // Factor multiplicativo por frame
    thresholdStop: 0.01,        // Si |h| < 0.01, parar
    minH: 0.001
  },
  
  VIEWPORT_INITIAL: {
    xMin: -6, xMax: 6,
    yMin: -6, yMax: 6,
    zoomDefault: 6,
    originDefault: 0
  },
  
  TOLERANCES: {
    eps: 1e-5,
    infinityThreshold: 1e6,
  },
  
  TEXT: {
    errorDefault: 'No se ha podido interpretar la función.',
    annotationSecant: 'm secante = Δy / Δx = ',
    annotationTangent: 'm tangente aprox. = ',
  },
  
  NUMBER_FORMAT: {
    exponentialThreshold: 10000,
    decimalPlaces: 4
  }
};
```

### 4.1.3 DerivadaModel.js — Lógica

```javascript
class DerivadaModel {
  constructor(constants) {
    this.constants = constants;
    
    // Estado
    this.functionExpr = 'x^2';
    this.compiled = null;
    this.xPoint = 1;
    this.h = 1.5;
    
    // Viewport
    this.xMin = constants.VIEWPORT_INITIAL.xMin;
    this.xMax = constants.VIEWPORT_INITIAL.xMax;
    this.yMin = constants.VIEWPORT_INITIAL.yMin;
    this.yMax = constants.VIEWPORT_INITIAL.yMax;
    
    // Compilar función inicial
    this._compileFunction();
  }

  // ===== SETTERS =====
  
  setFunctionExpr(expr) {
    this.functionExpr = expr.trim() || 'x^2';
    this._compileFunction();
  }

  setXPoint(x) {
    this.xPoint = Number(x);
  }

  setH(h) {
    this.h = Number(h);
    if (Math.abs(this.h) < 0.001) {
      this.h = this.h >= 0 ? 0.001 : -0.001;
    }
  }

  // ===== CÁLCULOS =====
  
  safeEval(x) {
    if (!this.compiled) return NaN;
    return VerneMath.safeEvaluate(this.compiled, x);
  }

  derivativeApprox(x) {
    const eps = Math.max(
      this.constants.TOLERANCES.eps, 
      (this.xMax - this.xMin) / 100000
    );
    const y1 = this.safeEval(x + eps);
    const y0 = this.safeEval(x - eps);
    if (!Number.isFinite(y1) || !Number.isFinite(y0)) return NaN;
    return (y1 - y0) / (2 * eps);
  }

  calculateSecantSlope(x, h) {
    const fx = this.safeEval(x);
    const fxh = this.safeEval(x + h);
    if (!Number.isFinite(fx) || !Number.isFinite(fxh)) return NaN;
    return (fxh - fx) / h;
  }

  // ===== CONVERSIONES COORDENADAS =====
  
  toScreenX(mathX) {
    const m = this.constants.RENDERING.margin;
    return m + (mathX - this.xMin) / (this.xMax - this.xMin) * (this.canvasWidth - 2 * m);
  }

  toScreenY(mathY) {
    const m = this.constants.RENDERING.margin;
    return this.canvasHeight - m - (mathY - this.yMin) / (this.yMax - this.yMin) * (this.canvasHeight - 2 * m);
  }

  // ===== PRIVADOS =====
  
  _compileFunction() {
    try {
      this.compiled = VerneMath.compile(this.functionExpr);
    } catch (error) {
      this.compiled = null;
      throw error;
    }
  }

  // ===== ANIMACIÓN h → 0 =====
  
  stepAnimateTowardsZero() {
    const threshold = this.constants.ANIMATION.thresholdStop;
    const decay = this.constants.ANIMATION.decayFactor;
    
    if (Math.abs(this.h) <= threshold) {
      this.h = this.h > 0 ? this.constants.ANIMATION.minH : -this.constants.ANIMATION.minH;
      return false; // Animación terminada
    }
    
    this.h *= decay;
    return true; // Continuar
  }
}
```

### 4.1.4 DerivadaPresenter.js — Orquestador (Extracto)

```javascript
class DerivadaPresenter {
  constructor(model, canvas, dom, graphRenderer, constants, formulasPanel) {
    this.model = model;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.dom = dom;
    this.graphRenderer = graphRenderer;
    this.constants = constants;
    this.formulasPanel = formulasPanel;
    
    this.animationId = null;
    this.animating = false;
    
    this.setupEventListeners();
    this.render();
  }

  setupEventListeners() {
    // Entrada de función
    this.dom.functionInput.addEventListener('input', () => {
      try {
        this.model.setFunctionExpr(this.dom.functionInput.value);
        this.dom.errorBox.style.display = 'none';
        this.render();
      } catch (error) {
        this.dom.errorBox.textContent = error.message;
        this.dom.errorBox.style.display = 'block';
      }
    });

    // Slider h
    this.dom.hSlider.addEventListener('input', () => {
      this.pauseAnimation();
      this.model.setH(this.dom.hSlider.value);
      this.render();
    });

    // Punto x
    this.dom.xPoint.addEventListener('input', () => {
      this.model.setXPoint(this.dom.xPoint.value);
      this.render();
    });

    // Botones de animación
    this.dom.towardsZeroBtn.addEventListener('click', () => this.animateTowardsZero());
    this.dom.pauseBtn.addEventListener('click', () => this.pauseAnimation());
    this.dom.resetBtn.addEventListener('click', () => this.reset());
  }

  render() {
    // Actualizar viewport
    const vp = this.model.getViewport();
    this.graphRenderer.setViewport(vp.xMin, vp.xMax, vp.yMin, vp.yMax);
    
    // Limpiar y dibujar grid
    this.graphRenderer.clear();
    this.graphRenderer.drawGridAndAxes();
    
    // Dibujar función
    this._drawFunction();
    
    // Dibujar anotaciones (tangente, secante, triángulo)
    const x = this.model.getXPoint();
    const h = this.model.getH();
    const fx = this.model.safeEval(x);
    const fxh = this.model.safeEval(x + h);
    
    if (Number.isFinite(fx) && Number.isFinite(fxh)) {
      this._drawAnnotations(x, fx, h, fxh);
    }
    
    // Actualizar métricas UI
    this._updateMetrics(x, fx, h, fxh);
    
    // Actualizar panel de fórmulas
    if (this.formulasPanel) {
      this.formulasPanel.update({x, h, fx, fxh});
    }
  }

  _drawFunction() {
    const c = this.constants;
    const ctx = this.ctx;
    const m = c.RENDERING.margin;
    
    ctx.strokeStyle = c.COLORS.function;
    ctx.lineWidth = c.RENDERING.lineWidth;
    ctx.beginPath();
    
    let drawing = false;
    const samples = c.RENDERING.samples;
    for (let i = 0; i <= samples; i++) {
      const px = m + i / samples * (this.canvas.width - 2 * m);
      const x = this.model.toMathX(px);
      const y = this.model.safeEval(x);
      const py = this.model.toScreenY(y);
      
      if (!Number.isFinite(y)) {
        drawing = false;
        continue;
      }
      
      if (!drawing) {
        ctx.moveTo(px, py);
        drawing = true;
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();
  }

  _drawAnnotations(x, fx, h, fxh) {
    // Dibujar secante
    const secantSlope = (fxh - fx) / h;
    this._drawLineThroughPoint(x, fx, secantSlope, this.constants.COLORS.secant);
    
    // Dibujar tangente (aproximada)
    const tangentSlope = this.model.derivativeApprox(x);
    this._drawLineThroughPoint(x, fx, tangentSlope, this.constants.COLORS.tangent, true);
    
    // Dibujar triángulo Δx, Δy
    this._drawTriangle(x, fx, x + h, fxh);
    
    // Dibujar puntos P y Q
    this._drawPoint(x, fx, this.constants.COLORS.point, 'P');
    this._drawPoint(x + h, fxh, this.constants.COLORS.secant, 'Q');
  }

  animateTowardsZero() {
    this.animating = true;
    
    const step = () => {
      const continues = this.model.stepAnimateTowardsZero();
      this.render();
      
      if (continues) {
        this.animationId = requestAnimationFrame(step);
      } else {
        this.animating = false;
      }
    };
    
    step();
  }

  pauseAnimation() {
    this.animating = false;
    cancelAnimationFrame(this.animationId);
  }

  reset() {
    this.pauseAnimation();
    this.model.setFunctionExpr('x^2');
    this.model.setXPoint(1);
    this.model.setH(1.5);
    // ... resetear DOM
    this.render();
  }
}
```

---

## 4.2 Laboratorio Modelo 2: CINEMÁTICA 2D (Tipo: DINÁMICO-DETERMINÍSTICO)

**Categoría**: Física clásica  
**Tipo de Simulación**: Dinámica con estado temporal (x(t), y(t))  
**Pedagogía**: Descomposición del movimiento parabólico en ejes X e Y

### 4.2.1 Estructura y Flujo

```
CinematicaPresenter
├── CinematicaModel (estado: x, y, vx, vy, t)
├── SceneRenderer (dibuja ejes, trayectoria, puntos)
├── VectorRenderer (dibuja velocidad, aceleración)
├── FormulasPanel (actualiza ecuaciones x(t), y(t))
└── SimulationLifecycle (start/pause/reset)
```

**HTML (Extracto clave)**:
```html
<div class="layout">
  <div class="panel">
    <!-- Presets y controles de parámetros -->
    <select id="preset">
      <option value="parabolico" selected>Tiro parabólico (45°)</option>
      <option value="horizontal">Tiro horizontal</option>
      <option value="vertical">Lanzamiento vertical</option>
    </select>
    <input id="speed" type="range" min="1" max="60" step="1" value="25" />
    <input id="angle" type="range" min="0" max="90" step="1" value="45" />
    <input id="gravity" type="range" min="0.1" max="20" step="0.1" value="9.8" />
    
    <button id="startBtn">Iniciar</button>
    <button id="pauseBtn">Pausar</button>
    <button id="resetBtn">Reiniciar</button>
  </div>
  
  <div class="panel">
    <!-- Canvas de simulación -->
    <canvas id="scene" width="950" height="580"></canvas>
    
    <!-- Métricas en tiempo real -->
    <div class="metrics">
      <div class="metric">
        <div class="label">Tiempo actual</div>
        <div class="value" id="timeValue">0.00 s</div>
      </div>
      <div class="metric">
        <div class="label">Posición (x, y)</div>
        <div class="value" id="positionValue">0.0, 0.0 m</div>
      </div>
      <div class="metric">
        <div class="label">Velocidad (vₓ, vᵧ)</div>
        <div class="value" id="velocityValue">0.0, 0.0 m/s</div>
      </div>
    </div>
    
    <!-- Ecuaciones y resultados -->
    <div class="details">
      <div class="detail-box">
        <div class="title">Modelo matemático</div>
        <div class="formula">x(t) = v₀·cos(θ)·t = <span id="formulaX">0</span></div>
        <div class="formula">y(t) = y₀ + v₀·sin(θ)·t - ½g·t² = <span id="formulaY">0</span></div>
      </div>
    </div>
  </div>
</div>

<!-- SHARED -->
<script src="../../shared/js/simulations/SimulationLifecycle.js"></script>
<script src="../../shared/js/graphics/Canvas2DRenderer.js"></script>
<script src="../../shared/components/VectorRenderer/VectorRenderer.js"></script>
<script src="../../shared/js/math/Vector2D.js"></script>

<!-- ESPECÍFICO: Cinemática -->
<script src="./js/CinematicaConstants.js"></script>
<script src="./js/CinematicaPhysics.js"></script>
<script src="./js/CinematicaModel.js"></script>
<script src="./js/SceneRenderer.js"></script>
<script src="./js/FormulasPanel.js"></script>
<script src="./js/CinematicaPresenter.js"></script>
```

### 4.2.2 CinematicaModel.js (Extracto)

```javascript
class CinematicaModel {
  constructor(constants) {
    this.constants = constants;
    
    // Parámetros iniciales
    this.height = 0;        // y₀
    this.speed = 25;        // v₀
    this.angle = 45;        // θ
    this.gravity = 9.8;     // g
    
    // Estado durante simulación
    this.time = 0;
    this.position = {x: 0, y: 0};
    this.velocity = {vx: 0, vy: 0};
    this.trajectory = [];   // Historial de posiciones
    
    this.autoPauseMode = 'on';
    this.pausedByMilestone = false;
  }

  // ===== CÁLCULOS CINEMÁTICOS =====
  
  step(deltaTime) {
    if (!this.isRunning) return;
    
    this.time += deltaTime;
    
    // Descomponer velocidad inicial
    const angleRad = (this.angle * Math.PI) / 180;
    const v0x = this.speed * Math.cos(angleRad);
    const v0y = this.speed * Math.sin(angleRad);
    
    // Ecuaciones de movimiento uniformemente acelerado
    this.position.x = v0x * this.time;
    this.position.y = this.height + v0y * this.time - 0.5 * this.gravity * this.time * this.time;
    
    this.velocity.vx = v0x;
    this.velocity.vy = v0y - this.gravity * this.time;
    
    // Registrar trayectoria
    this.trajectory.push({
      x: this.position.x,
      y: this.position.y,
      t: this.time
    });
    
    // Detección de impacto: y <= 0
    if (this.position.y <= 0) {
      this.position.y = 0;
      this.isRunning = false;
      return;
    }
  }

  // ===== CÁLCULOS DE RESULTADOS TEÓRICOS =====
  
  getFlightTime() {
    // t = (v0·sin(θ) + √((v0·sin(θ))² + 2·g·y₀)) / g
    const angleRad = (this.angle * Math.PI) / 180;
    const v0y = this.speed * Math.sin(angleRad);
    const discriminant = v0y * v0y + 2 * this.gravity * this.height;
    return (v0y + Math.sqrt(discriminant)) / this.gravity;
  }

  getMaxHeight() {
    const angleRad = (this.angle * Math.PI) / 180;
    const v0y = this.speed * Math.sin(angleRad);
    return this.height + (v0y * v0y) / (2 * this.gravity);
  }

  getRange() {
    const angleRad = (this.angle * Math.PI) / 180;
    const v0x = this.speed * Math.cos(angleRad);
    return v0x * this.getFlightTime();
  }
}
```

### 4.2.3 CinematicaPresenter.js (Extracto)

```javascript
class CinematicaPresenter {
  constructor(constants, dom) {
    this.constants = constants;
    this.dom = dom;
    
    // Inicializar componentes
    this.model = new CinematicaModel(constants);
    this.sceneRenderer = new SceneRenderer(dom.canvas, constants);
    this.vectorRenderer = new VectorRenderer(dom.canvas, constants);
    this.formulasPanel = new FormulasPanel(dom);
    
    // Máquina de estados
    this.lifecycle = new SimulationLifecycle(
      () => {},  // onStep (vacío, se hace en animate)
      () => this._onReset(),
      () => this.model.canStart()
    );
    
    // Inicializar
    this.setupEventListeners();
    this.setupLifecycleListeners();
    this.readControls();
    this.syncUI();
    this.render();
  }

  setupEventListeners() {
    // Presets
    this.dom.presetSelect?.addEventListener('change', () => {
      this._applyPreset(this.dom.presetSelect.value);
      this.syncUI();
      this.render();
    });
    
    // Sliders
    this.dom.speedInput?.addEventListener('input', () => {
      this.model.setSpeed(this.dom.speedInput.value);
      this.syncUI();
      this.render();
    });
    
    this.dom.angleInput?.addEventListener('input', () => {
      this.model.setAngle(this.dom.angleInput.value);
      this.syncUI();
      this.render();
    });
    
    // Botones
    this.dom.startBtn?.addEventListener('click', () => this.lifecycle.start());
    this.dom.pauseBtn?.addEventListener('click', () => {
      if (this.lifecycle.isRunning()) {
        this.lifecycle.pause();
      } else if (this.lifecycle.isPaused()) {
        this.lifecycle.resume();
      }
    });
    this.dom.resetBtn?.addEventListener('click', () => this.lifecycle.reset());
  }

  setupLifecycleListeners() {
    this.lifecycle.on('onStart', () => {
      this.lastTimestamp = null;
      this.animationId = requestAnimationFrame((ts) => this.animate(ts));
    });
    
    this.lifecycle.on('onPause', () => this.syncUI());
    this.lifecycle.on('onReset', () => {
      this.model.reset();
      this.syncUI();
      this.render();
    });
  }

  animate(timestamp) {
    if (this.lastTimestamp === null) {
      this.lastTimestamp = timestamp;
    }
    
    const deltaTime = (timestamp - this.lastTimestamp) / 1000;
    this.lastTimestamp = timestamp;
    
    this.model.step(deltaTime);
    this.syncUI();
    this.render();
    
    if (this.lifecycle.isRunning()) {
      this.animationId = requestAnimationFrame((ts) => this.animate(ts));
    }
  }

  render() {
    this.sceneRenderer.clear();
    this.sceneRenderer.drawGridAndAxes();
    this.sceneRenderer.drawTrajectory(this.model.trajectory);
    
    // Dibujar vectores de velocidad
    const scale = 30;
    this.vectorRenderer.drawVelocityComponents(
      {x: this.model.screenX(this.model.position.x), 
       y: this.model.screenY(this.model.position.y)},
      new Vector2D(this.model.velocity.vx, -this.model.velocity.vy),
      {scale: scale}
    );
  }

  syncUI() {
    this.dom.timeValue.textContent = this.model.time.toFixed(2) + ' s';
    this.dom.positionValue.textContent = 
      this.model.position.x.toFixed(1) + ', ' + this.model.position.y.toFixed(1) + ' m';
    this.dom.velocityValue.textContent = 
      this.model.velocity.vx.toFixed(1) + ', ' + this.model.velocity.vy.toFixed(1) + ' m/s';
  }

  _applyPreset(presetName) {
    const presets = {
      parabolico: {speed: 25, angle: 45, height: 0},
      horizontal: {speed: 20, angle: 0, height: 10},
      vertical: {speed: 20, angle: 90, height: 0}
    };
    
    const preset = presets[presetName] || presets.parabolico;
    this.model.setSpeed(preset.speed);
    this.model.setAngle(preset.angle);
    this.model.setHeight(preset.height);
  }
}
```

---

## 4.3 Laboratorio Modelo 3: ECOLOGÍA (Tipo: DINÁMICO-ESTOCÁSTICO)

**Categoría**: Biología / Sistemas dinámicos  
**Tipo de Simulación**: Dinámica con componentes estocásticos (números aleatorios)  
**Pedagogía**: Modelo depredador-presa (Lotka-Volterra) con variabilidad

### 4.3.1 Estructura Básica

```javascript
class EcologiaModel {
  constructor(constants) {
    this.preyCount = 100;
    this.predatorCount = 20;
    this.birthRatePrey = 0.1;
    this.deathRatePrey = 0.05;
    this.huntingRate = 0.002;
    this.predatorEfficiency = 0.8;
    
    // Variabilidad estocástica
    this.randomness = 0.1;  // 10% de variación
  }

  step(deltaTime) {
    // Ecuaciones Lotka-Volterra con ruido
    const preyGrowth = this.preyCount * this.birthRatePrey;
    const preyHunting = this.preyCount * this.predatorCount * this.huntingRate;
    const predatorGrowth = preyHunting * this.predatorEfficiency;
    const predatorDeath = this.predatorCount * 0.02;
    
    // Añadir variabilidad estocástica
    const preyNoise = preyGrowth * this.randomness * (Math.random() - 0.5) * 2;
    const predatorNoise = predatorGrowth * this.randomness * (Math.random() - 0.5) * 2;
    
    this.preyCount += (preyGrowth - preyHunting + preyNoise) * deltaTime;
    this.predatorCount += (predatorGrowth - predatorDeath + predatorNoise) * deltaTime;
    
    // Clamp a valores positivos
    this.preyCount = Math.max(0, this.preyCount);
    this.predatorCount = Math.max(0, this.predatorCount);
  }
}
```

---

## 5. GUÍA DE CREACIÓN: CÓMO GENERAR UN NUEVO LABORATORIO

### 5.1 Flujo de Trabajo Recomendado

**Paso 1: Definir el laboratorio**
- ¿Qué concepto enseña? (derivadas, cinemática, ecología, etc.)
- ¿Qué tipo de simulación? (estática, dinámica-det, dinámica-estoc)
- ¿Qué interactividad? (sliders, inputs, presets, botones)

**Paso 2: Crear estructura de carpetas**
```
simulaciones/nuevo-lab/
├── index.html
├── css/nuevo-lab.css
└── js/
    ├── NuevoLabConstants.js
    ├── NuevoLabModel.js
    ├── NuevoLabPresenter.js
    └── [NuevoLabPhysics.js - si necesita motor físico]
```

**Paso 3: Escribir el HTML**
- Copiar estructura de uno de los laboratorios modelo
- Reemplazar IDs del DOM (functionInput → parámetroInput, etc.)
- Agregar secciones de controles y métricas

**Paso 4: Escribir Constants.js**
- Definir colores, renderizado, rangos de sliders
- Viewport inicial, tolerancias numéricas
- Textos en español

**Paso 5: Escribir Model.js**
- Definir estado (qué variables mantiene)
- Implementar setters para parámetros
- Implementar cálculos (lógica del dominio)
- Implementar step(dt) si es dinámico

**Paso 6: Escribir Presenter.js**
- Crear instancias de componentes SHARED
- Implementar setupEventListeners()
- Implementar render()
- Implementar animate() si es dinámico

**Paso 7: Verificar**
- Abrir HTML en navegador
- Verificar que los controles funcionan
- Verificar que el canvas se renderiza
- Verificar interactividad y animación

### 5.2 Checklist de Componentes SHARED a Usar

Según el tipo de laboratorio, usar estos componentes:

**Todos los laboratorios**:
- ✓ VerneMath (si hay parseo de funciones)
- ✓ MathematicalModelPanel (si hay ecuaciones)

**Labs con gráficos de funciones**:
- ✓ GraphRenderer (ejes y grid)
- ✓ GraphNavigator (pan/zoom interactivo)

**Labs con gráficos de trayectorias**:
- ✓ Canvas2DRenderer (primitivas)
- ✓ GraphRenderer (ejes)

**Labs dinámicos**:
- ✓ SimulationLifecycle (start/pause/reset)

**Labs con vectores**:
- ✓ VectorRenderer (flechas, descomposiciones)
- ✓ Vector2D (operaciones vectoriales)

**Labs con física**:
- ✓ PhysicsEngine (fuerzas, fricción)
- ✓ OdeSolverRK4 (integración numérica)
- ✓ KinematicsEngine (cinemática 1D)

---

## 6. TEMPLATES: HTML, CSS, JAVASCRIPT

### 6.1 Template HTML Mínimo

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Laboratorio: [Nombre]</title>
  <link rel="stylesheet" href="../../css/labs-common.css" />
  <link rel="stylesheet" href="./lab.css" />
</head>
<body>
  <header class="page-header">
    <h1>[Título del laboratorio]</h1>
    <p>[Descripción pedagógica]</p>
    <a class="back-link" href="../../index.html#simulaciones">← Volver a simulaciones</a>
  </header>

  <main>
    <section class="canvas-card">
      <canvas id="canvas" width="1200" height="700"></canvas>
    </section>

    <aside>
      <section class="controls-card">
        <h2>Controles</h2>
        <!-- Sliders y inputs -->
      </section>

      <section class="info-card">
        <h2>Información</h2>
        <!-- Métricas y fórmulas -->
      </section>
    </aside>
  </main>

  <!-- SHARED -->
  <script src="../../shared/..."></script>
  
  <!-- ESPECÍFICO -->
  <script src="./js/...Constants.js"></script>
  <script src="./js/...Model.js"></script>
  <script src="./js/...Presenter.js"></script>
  
  <script>
    const canvas = document.getElementById('canvas');
    const presenter = new [Lab]Presenter([Constants], {canvas, ...});
  </script>
</body>
</html>
```

### 6.2 Template CSS Mínimo

```css
/* Estilos específicos del lab */

.canvas-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

canvas {
  width: 100%;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.controls-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.control {
  margin-bottom: 16px;
}

.control label {
  display: block;
  font-weight: 600;
  margin-bottom: 6px;
  font-size: 14px;
  color: #1f2937;
}

.control input[type="range"] {
  width: 100%;
  cursor: pointer;
}

.button-row {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
}

button {
  flex: 1;
  min-width: 80px;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

button.primary {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

button.primary:hover {
  background: #2563eb;
  border-color: #2563eb;
}

.metrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.metric {
  background: #f8fafc;
  padding: 12px;
  border-radius: 6px;
  border-left: 3px solid #3b82f6;
}

.metric .label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.metric .value {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin-top: 4px;
  font-family: 'Monaco', 'Courier New', monospace;
}
```

---

## 7. INSTRUCCIONES PARA SISTEMAS IA (ChatGPT, Claude, Gemini)

### 7.1 Cómo Leer Este BLUEPRINT

1. **Comprende la arquitectura** (Secciones 1-2)
   - Model-View-Presenter
   - Componentes SHARED vs específicos

2. **Estudia los componentes** (Sección 3)
   - Cada uno tiene API y ejemplo de uso
   - **Críticos**: VerneMath, GraphRenderer, Canvas2DRenderer, Vector2D
   - **Para dinámicas**: SimulationLifecycle, PhysicsEngine
   - **Para gráficos**: GraphRenderer, VectorRenderer, Graph2DEngine

3. **Analiza los laboratorios modelo** (Sección 4)
   - Lee DerivadaModel + DerivadaPresenter
   - Replica la estructura para tu lab
   - Usa los mismos patterns de eventos y renderizado

4. **Sigue la guía de creación** (Sección 5)
   - Paso a paso: estructura → constants → model → presenter
   - Usa el checklist para seleccionar componentes

### 7.2 Patrón de Generación Automática

Cuando generes un nuevo laboratorio, sigue este orden:

1. **HTML** (estructura DOM)
2. **Constants.js** (configuración)
3. **Model.js** (lógica pura, sin UI)
4. **Presenter.js** (orquestación + renderizado)

Nunca:
- ✗ Mezcles UI con lógica
- ✗ Hagas cálculos en el Presenter
- ✗ Duplices código de otros labs
- ✗ Ignores los componentes SHARED

### 7.3 Validación del Lab Generado

#### Nivel 1: Funcionalidad Básica
- [ ] HTML se abre sin errores 404 ni console errors
- [ ] Canvas se renderiza y dibuja contenido
- [ ] Todos los sliders/inputs responden a entrada del usuario
- [ ] Las métricas se actualizan en tiempo real
- [ ] Los botones (Iniciar, Pausar, Reiniciar) funcionan
- [ ] El Presenter crea instancias de componentes sin errores

#### Nivel 2: Arquitectura Correcta
- [ ] Model es independiente de View (sin referencias a DOM)
- [ ] Presenter conecta Model ↔ View (modelo es el origen de verdad)
- [ ] Constants contiene todos los valores configurables
- [ ] Las rutas a componentes SHARED son correctas (sin 404)
- [ ] Usa al menos 2 componentes SHARED reutilizables

#### Nivel 3: Corrección Matemática/Científica
- [ ] **Caso de prueba 1**: Parámetro X=A → Resultado debe ser B (±tolerancia)
- [ ] **Caso de prueba 2**: [Más casos específicos del dominio]
- [ ] **Valores extremos**: Min/Max de parámetros → comportamiento esperado
- [ ] **Unidades**: Las métricas muestran unidades correctas
- [ ] **Validación manual**: Comparar resultado con cálculo manual para valores simples

#### Nivel 4: Robustez y Accesibilidad
- [ ] Navegación por teclado: Tab entre controles, Enter para activar botones
- [ ] Control de deltaTime: Pausar pestaña → Simular sin saltos bruscos
- [ ] Límites de memoria: Historial de trayectorias no crece indefinidamente
- [ ] Responsive: Se ve bien en 1200px y en 375px (mobile)
- [ ] Alto DPI: Canvas renderiza a `devicePixelRatio` correctamente
- [ ] Sin errores: Console sin warnings ni errores no controlados

#### Nivel 5: Performance y Reproducibilidad
- [ ] **Presupuesto**: Mantiene > 50 FPS en navegador moderno
- [ ] **Reproducibilidad**: Simulación estocástica usa semilla fija para tests
- [ ] **Limpieza**: Cancela animationFrames al destruir/cambiar lab
- [ ] **Memoria**: Sin memory leaks tras múltiples start/reset/pause

#### Nivel 6: Documentación y Integración
- [ ] Ficha de metadata completa (sección 10.5)
- [ ] Código comentado para lógica no obvia
- [ ] README.md con descripción pedagógica y modo de uso
- [ ] Integración confirmada: Funciona dentro del proyecto VerneLabs real
- [ ] Sin dependencias no documentadas o archivos faltantes

**Mínimo aceptable**: Niveles 1 + 2 + 3 (funcional + correcto matemáticamente)
**Recomendado**: Niveles 1-4 (lista completa para labs en producción)

---

## 8. CASOS DE USO: EJEMPLOS DE NUEVOS LABS

### 8.1 Lab: Movimiento Armónico Simple (ESTÁTICO)

**Concepto**: Oscilación sinusoidal  
**Componentes SHARED a usar**:
- GraphRenderer (gráfica x(t))
- VerneMath (si permite f(x))
- MathematicalModelPanel (ecuaciones)

**Parámetros interactivos**:
- Amplitud (A)
- Frecuencia angular (ω)
- Fase inicial (φ)

**Estructura**:
```
MASModel: {amplitude, frequency, phase, time}
MASPresenter: dibuja gráfica sinusoidal + vectores de posición/velocidad
```

---

### 8.2 Lab: Refracción de Luz (ESTÁTICO)

**Concepto**: Ley de Snell  
**Componentes SHARED a usar**:
- Canvas2DRenderer (dibujar rayos)
- VectorRenderer (normal a la interfaz)
- VerneMath (ángulos de refracción)

**Parámetros**:
- Índice de refracción n₁ y n₂
- Ángulo de incidencia θ₁

---

### 8.3 Lab: Crecimiento Exponencial (DINÁMICO)

**Concepto**: P(t) = P₀ · e^(rt)  
**Componentes SHARED a usar**:
- SimulationLifecycle (start/pause)
- GraphRenderer (gráfica temporal)
- OdeSolverRK4 (o integración simple)

**Parámetros**:
- Población inicial P₀
- Tasa de crecimiento r

---

## 9. ESTILOS Y TEMAS

### 9.1 Variables CSS Globales

```css
/* Colores */
--bg: #ffffff;
--text: #1f2937;
--border: #e5e7eb;
--panel: #f9fafb;
--muted: #6b7280;

/* Tipografía */
--font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto;

/* Geometría */
--radius: 12px;
--radius-sm: 6px;
--shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

/* Gráficos */
--grid-color: #e2e8f0;
--grid-line-width: 0.5;
--axis-color: #94a3b8;
--axis-line-width: 1;
```

---

## 10. TROUBLESHOOTING

### El canvas no aparece
- ✓ Verificar que `canvas.width` y `canvas.height` estén asignados (no solo CSS)
- ✓ Verificar que `getContext('2d')` devuelve contexto válido

### Las fórmulas no se actualizan
- ✓ Verificar que `MathematicalModelPanel.update()` se llama desde `render()`
- ✓ Verificar que los IDs en `formulas[]` coinciden con HTML

### Los eventos no responden
- ✓ Verificar que los IDs del DOM en `setupEventListeners()` existen en HTML
- ✓ Verificar que `addEventListener` se llama DESPUÉS de que el DOM esté listo

### Bajo rendimiento / lag
- ✓ Reducir número de muestras en GraphRenderer
- ✓ Reducir frecuencia de actualizaciones del DOM
- ✓ Usar `requestAnimationFrame` en lugar de loops while

---

## 10.5 PLANTILLA: Ficha de Laboratorio (Metadata)

Cada nuevo laboratorio debe completar esta ficha **antes** de comenzar el desarrollo:

```markdown
# Ficha: [Nombre del Laboratorio]

## Identificación
- **Slug**: [ej: movimiento-armonico-simple]
- **Nivel educativo**: [Bachillerato | Primero de carrera | Otros]
- **Concepto principal**: [ej: Oscilación sinusoidal]
- **Disciplina**: [Física | Matemática | Biología | Química]

## Propósito Pedagógico
- **Objetivo de aprendizaje**: [Qué debería entender el estudiante]
- **Restricciones y simplificaciones**: [Qué se omite o simplifica]

## Tipo de Simulación
- **Categoría**: Estática | Dinámica-Determinística | Dinámica-Estocástica
- **Motor físico/matemático**: [VerneMath | PhysicsEngine | OdeSolverRK4 | Propio]
- **Ecuación diferencial o modelo**: [Fórmula matemática del sistema]

## Estado Interno del Model
```javascript
// Estructura de datos principal
{
  param1: tipo,
  param2: tipo,
  state1: tipo,
  // ...
}
```

## Parámetros Interactivos
| Nombre | Tipo | Rango | Unidad | Por qué es importante |
|--------|------|-------|--------|----------------------|
| param1 | Range | [a, b] | unidad | Justificación |
| param2 | Input | — | unidad | Justificación |

## Controles de Usuario
- Sliders: [lista]
- Input numéricos: [lista]
- Selects/Presets: [lista]
- Botones: Iniciar, Pausar, Reiniciar, [otros]

## Visualización
- **Canvas**: 1200×700 px
- **Principales elementos visualizados**: [Descripción de qué se dibuja]
- **Componentes SHARED usados**: VerneMath, GraphRenderer, [...]

## Métricas y Fórmulas
| Nombre | Fórmula | Actualización |
|--------|---------|---------------|
| Métrica 1 | Formula | Cada frame |
| Métrica 2 | Formula | Cada cambio de parámetro |

## Ciclo de Simulación
- **Inicialización**: [Qué ocurre en setup]
- **Condición de inicio**: [Cuándo se puede presionar "Iniciar"]
- **Cada frame**: [Qué se recalcula con dt]
- **Pausas automáticas**: [Si hay hitos pedagógicos]
- **Condición de finalización**: [Cuándo termina]
- **Reinicio**: [Qué se resetea]

## Validación Numérica
### Casos de prueba conocidos
1. Parámetro X = A → Resultado Y debería ser B (tolerancia ±C)
2. [Más casos]

### Valores extremos
- Mínimo de parámetro → Comportamiento esperado
- Máximo de parámetro → Comportamiento esperado

### Prueba visual
- Ejecutar en navegador → [Descripción de qué debería verse]

## Requisitos Adicionales
- [ ] Accesibilidad: teclado (Tab, Enter, flechas)
- [ ] Responsive: funciona en mobile/tablet
- [ ] Alto DPI: canvas renderiza a devicePixelRatio
- [ ] Internacionalización: textos en español (¿multilengua?)
- [ ] Reproducibilidad: semilla para RNG si es estocástico
- [ ] Presupuesto: < 60 FPS en navegador moderno

## Archivo de referencia
- **Ubicación del código fuente**:  `simulaciones/[slug]/`
- **HTML principal**: `simulaciones/[slug]/index.html`
- **Model**: `simulaciones/[slug]/js/[Nombre]Model.js`
- **Presenter**: `simulaciones/[slug]/js/[Nombre]Presenter.js`
- **CSS específico**: `simulaciones/[slug]/css/[slug].css`
```

---

## 11. PATRONES ARQUITECTÓNICOS CLAVE

### Patrón 1: MVP (Model-View-Presenter)

```
            ┌─────────────┐
            │   Model     │
            │  (puro)     │
            └──────┬──────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        v                     v
    ┌──────────┐         ┌──────────┐
    │  Presenter├────────►│   View   │
    │           │         │ (DOM)    │
    └──────────┘         └──────────┘
        ↑                     │
        └─────────────────────┘
         (sincronización)
```

### Patrón 2: Componentes SHARED

```
ComponenteShared {
  constructor(options)    // opciones genéricas
  update(state)          // actualizar con nuevo estado
  render()               // dibujar/actualizar UI
  // Sin dependencias de labs específicos
}
```

### Patrón 3: Animación con requestAnimationFrame

```javascript
animate(timestamp) {
  const deltaTime = (timestamp - lastTimestamp) / 1000;
  
  // 1. Actualizar modelo
  this.model.step(deltaTime);
  
  // 2. Sincronizar UI
  this.syncUI();
  
  // 3. Renderizar
  this.render();
  
  // 4. Próximo frame
  if (this.isRunning) {
    requestAnimationFrame((ts) => this.animate(ts));
  }
}
```

---

## CONCLUSIÓN

Este BLUEPRINT es un **especificación ejecutable** para sistemas IA. Contiene:

1. **Filosofía y arquitectura**: cómo se organiza VerneLabs
2. **Componentes reutilizables**: código fuente + API de 9 componentes SHARED
3. **Laboratorios modelo**: 3 ejemplos completos + funcionales
4. **Guía paso a paso**: cómo crear un nuevo lab
5. **Patrones y templates**: boilerplate para acelerar desarrollo

Un sistema IA que lea este documento puede generar nuevos laboratorios siguiendo los mismos patrones, reutilizando componentes SHARED, y respetando la arquitectura MVP.

---

## 12. LIMITACIONES CONOCIDAS Y PLAN DE MEJORA

### Limitaciones de Esta Versión del BLUEPRINT

1. **Rutas de componentes SHARED inconsistentes**
   - El proyecto tiene componentes en dos ubicaciones (`/shared/components/` y `/shared/js/`)
   - Solución: Unificar todas a `/shared/components/` (migración en progreso)
   - **Acción IA**: Usar rutas según ficha de lab ("nuevo" o "legacy")

2. **Ejemplos de código contienen extractos, no implementación completa**
   - Derivadas y Cinemática mostraron versiones simplificadas
   - Métodos omitidos: `parseExpression()`, `sanitize()` en VerneMath
   - Sincronización incompleta mostrada en ejemplo de Cinemática
   - **Acción IA**: Leer archivos reales de `/simulaciones/*/js/` para copiar código exacto

3. **Falta validación numérica detallada**
   - No incluye casos de prueba concretos con números
   - No especifica tolerancias por componente
   - **Acción IA**: Agregar tabla de validación en ficha de lab (sección 10.5)

4. **No garantiza integración automática**
   - Requiere acceso al repositorio real para verificar contratos
   - Algunas variables internas pueden haber cambiado
   - **Acción IA**: Validar en repositorio antes de generar

### Qué Hace Falta para "Especificación Ejecutable Completa"

Para que una IA pueda generar labs SIN acceso al repositorio:

✅ **Ya documentado**:
- Arquitectura MVP
- Separación de responsabilidades
- Patrones de componentes SHARED
- Flujo de desarrollo paso a paso

❌ **Falta documentar**:
- [ ] API de cada componente con lista completa de métodos + parámetros
- [ ] Contratos formales: tipos de entrada/salida, efectos secundarios
- [ ] Código fuente COMPLETO de los 9 componentes SHARED
- [ ] Ejemplos de uso reales (copiar/pegar desde código funcionando)
- [ ] Casos de prueba numéricos con valores esperados y tolerancias
- [ ] Tests unitarios del modelo matemático (ej: f(x) = x² con x=3 → y=9)
- [ ] Checklist de accesibilidad específico de canvas
- [ ] Límites de presupuesto: máx trayectoria, máx muestras, máx frequency

### Plan de Enriquecimiento

**Fase 1 (próximo)**: Normalizar rutas
- [ ] Decidir estructura canónica (recomendación: `/shared/components/`)
- [ ] Mover componentes viejos de `/shared/js/` → `/shared/components/`
- [ ] Actualizar todos los labs

**Fase 2**: Documentación de APIs
- [ ] Para cada componente: firma completa, tipos, ejemplos
- [ ] Usar JSDoc o similiar para que sea procesable
- [ ] Validar contra código real

**Fase 3**: Casos de prueba
- [ ] Derivadas: f(x)=x², x=1, h=0.1 → pendiente secante = ?
- [ ] Cinemática: v₀=20, θ=45°, g=9.8 → tiempo vuelo = ?
- [ ] Cada lab: 3-5 casos con números y tolerancia

---

## 13. CÓMO USAR ESTE BLUEPRINT (GUÍA PARA IA)

### Escenario 1: Crear Lab Prototipo Independiente
**Caso**: "Quiero crear un lab completamente independiente basándome en el blueprint"

1. Leer secciones 1-2 (entender filosofía y estructura)
2. Elegir laboratorio modelo similar al tuyo (sección 4)
3. Copiar su HTML + Constants + Model + Presenter
4. Adaptar: reemplazar nombres, parámetros, cálculos
5. Implementar componentes SHARED necesarios (sección 3) usando el código mostrado
6. Validar localmente (sin repositorio)

**Limitación**: El lab funcionará, pero no usará componentes reales de VerneLabs (los tendrás que reimplementar)

### Escenario 2: Crear Lab Integrado en VerneLabs
**Caso**: "Quiero crear un lab que funcione dentro del proyecto VerneLabs real"

1. Completar ficha de metadata (sección 10.5)
2. Verificar rutas REALES de componentes en repositorio (sección 2)
3. Leer código real desde `/simulaciones/derivadas/js/` (no extractos)
4. Leer código real desde `/shared/components/` y `/shared/js/`
5. Copiar estructura de lab modelo + adaptar
6. Validar numéricamente (sección 7.3, Nivel 3+)
7. Integrar en repositorio real

**Requisito**: Acceso a la carpeta `/shared/` auténtica

### Checklist para IA Generadora

Cuando generes un nuevo lab, verifica:

**Antes de comenzar**:
- [ ] ¿Tengo acceso al repositorio real de VerneLabs?
- [ ] ¿Cuál es el lab modelo MÁS similar al que voy a crear?
- [ ] ¿Qué componentes SHARED necesita?

**Durante el desarrollo**:
- [ ] ¿Las rutas a componentes existen? (verificar en repositorio)
- [ ] ¿El Model es puro (sin DOM)? 
- [ ] ¿El Presenter solo orquesta (no calcula)?
- [ ] ¿Tengo al menos 3 casos de prueba numérica?

**Antes de entregar**:
- [ ] ¿Pasa validación Nivel 1 (funcional)?
- [ ] ¿Pasa validación Nivel 2 (arquitectura)?
- [ ] ¿Pasa validación Nivel 3 (matemática correcta)?
- [ ] ¿Completé la ficha de metadata?

---

**Versión**: 2.1 (Mejorada - Guía + Especificación parcial)  
**Última actualización**: 2026-07-25  
**Estado**: Guía arquitectónica validada; especificación en progreso (necesita código real completo)
**Feedback**: Basado en evaluación de ChatGPT (2026-07-25)
