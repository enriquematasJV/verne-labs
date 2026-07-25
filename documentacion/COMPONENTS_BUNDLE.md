# VerneLabs Components Bundle v1.0

**PROPÓSITO:** Este documento contiene el código fuente de los componentes reutilizables de VerneLabs. Está diseñado para IA sin acceso directo al repositorio, permitiendo copiar/pegar componentes completos en laboratorios modulares o generar versiones standalone.

**CÓMO USAR:**
1. Localiza el componente que necesitas en el índice
2. Copia el código JavaScript y CSS asociado
3. Crea la carpeta `shared/components/ComponentName/`
4. Pega los archivos en esa carpeta
5. Carga los scripts en tu HTML: `<script src="../../shared/components/ComponentName/ComponentName.js"></script>`

**VERSIÓN:** 1.0 (2026-07-25)  
**COMPONENTES INCLUIDOS:** 10 componentes core  
**LÍNEAS DE CÓDIGO:** ~2000 líneas totales

---

## Índice de Componentes

| # | Componente | Tipo | Líneas | Dependencias | 
|---|---|---|---|---|
| 1 | Vector2D | Matemática | 101 | Ninguna |
| 2 | VerneMath | Matemática | 149 | Ninguna |
| 3 | MathUtils | Matemática | 36 | Ninguna |
| 4 | PhysicsEngine | Física | 34 | Ninguna |
| 5 | OdeSolverRK4 | Física | 53 | Ninguna |
| 6 | KinematicsEngine | Física | 92 | Vector2D |
| 7 | SimulationLifecycle | Simulación | 290 | Ninguna |
| 8 | SliderControl | UI | 58 | Ninguna |
| 9 | MathematicalModelPanel | UI | 68 | Ninguna |
| 10 | GraphRenderer | Renderización | 296 | Ninguna |

---

## 1. Vector2D

**Ubicación:** `/shared/components/Vector2D/Vector2D.js`  
**Tipo:** Clase de utilidad matemática  
**Dependencias:** Ninguna  
**Tamaño:** 101 líneas

**Uso:**
```javascript
const v1 = new Vector2D(3, 4);
const v2 = new Vector2D(1, 2);
const sum = v1.add(v2);           // Vector2D(4, 6)
const mag = v1.magnitude();       // 5
const normalized = v1.normalize(); // Vector2D(0.6, 0.8)
```

### Código

```javascript
class Vector2D {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  static from(x, y) {
    return new Vector2D(x, y);
  }

  static zero() {
    return new Vector2D(0, 0);
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

  angleTo(other) {
    return Math.atan2(other.y - this.y, other.x - this.x);
  }

  rotate(angleRad) {
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);
    return new Vector2D(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos
    );
  }

  copy() {
    return new Vector2D(this.x, this.y);
  }

  toString() {
    return `Vector2D(${this.x.toFixed(2)}, ${this.y.toFixed(2)})`;
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

  decompose(axisParallel, axisPerp) {
    return {
      parallel: this.projectOntoAxis(axisParallel),
      perpendicular: this.projectOntoAxis(axisPerp),
      parallelScalar: this.projectScalar(axisParallel),
      perpendicularScalar: this.projectScalar(axisPerp)
    };
  }

  static resultant(vectors) {
    if (vectors.length === 0) return Vector2D.zero();
    return vectors.reduce((sum, v) => sum.add(v), Vector2D.zero());
  }

  static sum(vectors) {
    return Vector2D.resultant(vectors);
  }

  static average(vectors) {
    if (vectors.length === 0) return Vector2D.zero();
    return Vector2D.resultant(vectors).scale(1 / vectors.length);
  }
}
```

---

## 2. VerneMath

**Ubicación:** `/shared/components/VerneMath/VerneMath.js`  
**Tipo:** Compilador de expresiones matemáticas  
**Dependencias:** Ninguna  
**Tamaño:** 149 líneas

**Uso:**
```javascript
const expr = VerneMath.compile('2*x**2 + 3*x - 1');
const result = VerneMath.safeEvaluate(expr, 5);  // 64
```

**Características:**
- Multiplicación implícita: `2x` → `2*x`
- Funciones: sin, cos, tan, sqrt, abs, log, ln, exp, floor, ceil, round
- Constantes: pi, e
- Seguridad: Bloquea eval, window, document, fetch, etc.

### Código (Completo)

```javascript
(function (global) {
  'use strict';

  var DEFAULT_TEST_VALUES = [-3, -2, -1, -0.5, 0.5, 1, 2, 3];
  var ALLOWED_CHARS = /[^0-9xX+\-*/().,\sMPIEabcdefghilnopqrstu]/;
  var DANGEROUS_IDENTIFIERS = /\b(window|document|alert|confirm|prompt|fetch|eval|Function|import|require|top|parent|self|globalThis|location|cookie|XMLHttpRequest|WebSocket|localStorage|sessionStorage|constructor|__proto__|process)\b/i;

  function insertImplicitMultiplication(expr) {
    var s = expr;
    s = s.replace(/(\d)([a-zA-Z(])/g, '$1*$2');
    s = s.replace(/([xX)])\(/g, '$1*(');
    s = s.replace(/\)([a-zA-Z])/g, ')*$1');
    s = s.replace(/([xX)])(\d)/g, '$1*$2');
    return s;
  }

  function substituteFunctions(expr) {
    return expr
      .replace(/\bln\s*\(/gi, '__NATURAL_LOG__')
      .replace(/\blog\s*\(/gi, 'Math.log10(')
      .replace(/__NATURAL_LOG__/g, 'Math.log(')
      .replace(/\bsin\s*\(/gi, 'Math.sin(')
      .replace(/\bcos\s*\(/gi, 'Math.cos(')
      .replace(/\btan\s*\(/gi, 'Math.tan(')
      .replace(/\bsqrt\s*\(/gi, 'Math.sqrt(')
      .replace(/\babs\s*\(/gi, 'Math.abs(')
      .replace(/\bexp\s*\(/gi, 'Math.exp(')
      .replace(/\bfloor\s*\(/gi, 'Math.floor(')
      .replace(/\bceil\s*\(/gi, 'Math.ceil(')
      .replace(/\bround\s*\(/gi, 'Math.round(')
      .replace(/\bpi\b/gi, 'Math.PI')
      .replace(/\be\b/g, 'Math.E');
  }

  function normalize(raw, options) {
    var expr = String(raw).trim().replace(/π/g, 'pi');
    if (options.decimalComma !== false) {
      expr = expr.replace(/(\d),(\d)/g, '$1.$2');
    }
    return expr;
  }

  function sanitize(raw, options) {
    var expr = normalize(raw, options);
    expr = insertImplicitMultiplication(expr);
    expr = substituteFunctions(expr);
    expr = expr.replace(/\^/g, '**');
    return expr;
  }

  function compile(raw, options) {
    options = options || {};
    var variable = options.variable || 'x';
    var expr = sanitize(raw, options);

    if (DANGEROUS_IDENTIFIERS.test(raw)) {
      throw new Error('La expresión usa un nombre no permitido.');
    }

    if (ALLOWED_CHARS.test(expr)) {
      throw new Error('La expresión contiene caracteres no admitidos.');
    }

    var fn;
    try {
      fn = new Function(
        variable,
        'var y = ' + expr + ';\n' +
        'if (!Number.isFinite(y)) return NaN;\n' +
        'return y;'
      );
    } catch (error) {
      throw new Error('No se ha podido interpretar la expresión.');
    }

    var testValues = options.testValues || DEFAULT_TEST_VALUES;
    for (var i = 0; i < testValues.length; i += 1) {
      try {
        fn(testValues[i]);
      } catch (error) {
        throw new Error('La expresión falla al evaluarla (revisa nombres de variables y funciones).');
      }
    }

    return fn;
  }

  function safeEvaluate(compiledFn, xValue) {
    try {
      return compiledFn(xValue);
    } catch (error) {
      return NaN;
    }
  }

  var VerneMath = {
    compile: compile,
    safeEvaluate: safeEvaluate
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = VerneMath;
  }

  global.VerneMath = VerneMath;
})(typeof window !== 'undefined' ? window : global);
```

---

## 3. MathUtils

**Ubicación:** `/shared/components/MathUtils/MathUtils.js`  
**Tipo:** Utilidades matemáticas  
**Dependencias:** Ninguna  
**Tamaño:** 36 líneas

**Uso:**
```javascript
MathUtils.derivativeNumerical(Math.sin, Math.PI / 4);
MathUtils.integralSimpson(Math.cos, 0, Math.PI / 2);
```

### Código

```javascript
const MathUtils = {
  // Derivada numérica usando diferencias finitas
  derivativeNumerical(fn, x, h = 1e-5) {
    return (fn(x + h) - fn(x - h)) / (2 * h);
  },

  // Integración con regla de Simpson
  integralSimpson(fn, a, b, n = 100) {
    const dx = (b - a) / n;
    let sum = fn(a) + fn(b);
    
    for (let i = 1; i < n; i += 1) {
      const x = a + i * dx;
      sum += (i % 2 === 0 ? 2 : 4) * fn(x);
    }
    
    return (dx / 3) * sum;
  },

  // Mínimo común múltiplo
  gcd(a, b) {
    return b === 0 ? a : MathUtils.gcd(b, a % b);
  },

  lcm(a, b) {
    return (a * b) / MathUtils.gcd(a, b);
  },

  // Interpolación lineal
  lerp(a, b, t) {
    return a + (b - a) * t;
  },

  // Clamping
  clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
};
```

---

## 4. PhysicsEngine

**Ubicación:** `/shared/components/PhysicsEngine/PhysicsEngine.js`  
**Tipo:** Motor de física  
**Dependencias:** Ninguna  
**Tamaño:** 34 líneas

**Uso:**
```javascript
const engine = new PhysicsEngine();
const state = engine.computeForces(mass, angle, mu);
```

### Código

```javascript
class PhysicsEngine {
  constructor(gravity = 9.81) {
    this.gravity = gravity;
  }

  computeForces(mass, angleDeg, mu) {
    const angleRad = (angleDeg * Math.PI) / 180;
    const g = this.gravity;
    
    const weight = mass * g;
    const parallel = weight * Math.sin(angleRad);
    const normal = weight * Math.cos(angleRad);
    const friction = mu * normal;
    const netForce = parallel - friction;
    const acceleration = netForce / mass;
    
    return {
      weight,
      parallel,
      normal,
      friction,
      netForce,
      acceleration
    };
  }

  canMove(parallel, friction) {
    return parallel > friction;
  }
}
```

---

## 5. OdeSolverRK4

**Ubicación:** `/shared/components/OdeSolverRK4/OdeSolverRK4.js`  
**Tipo:** Solver de ecuaciones diferenciales  
**Dependencias:** Ninguna  
**Tamaño:** 53 líneas

**Uso:**
```javascript
const solver = new OdeSolverRK4();
const nextState = solver.step(currentState, derivatives, dt);
```

### Código

```javascript
class OdeSolverRK4 {
  constructor() {}

  step(state, derivativeFn, dt) {
    const k1 = derivativeFn(state);
    
    const state2 = {};
    for (let key in state) {
      state2[key] = state[key] + k1[key] * (dt / 2);
    }
    const k2 = derivativeFn(state2);
    
    const state3 = {};
    for (let key in state) {
      state3[key] = state[key] + k2[key] * (dt / 2);
    }
    const k3 = derivativeFn(state3);
    
    const state4 = {};
    for (let key in state) {
      state4[key] = state[key] + k3[key] * dt;
    }
    const k4 = derivativeFn(state4);
    
    const result = {};
    for (let key in state) {
      result[key] = state[key] + (dt / 6) * (k1[key] + 2 * k2[key] + 2 * k3[key] + k4[key]);
    }
    
    return result;
  }
}
```

---

## 6. KinematicsEngine

**Ubicación:** `/shared/components/KinematicsEngine/KinematicsEngine.js`  
**Tipo:** Motor cinemático  
**Dependencias:** Vector2D  
**Tamaño:** 92 líneas

**Uso:**
```javascript
const engine = new KinematicsEngine();
const velocity = engine.calculateVelocity(initialVelocity, acceleration, time);
```

### Código

```javascript
class KinematicsEngine {
  constructor() {}

  // v = v₀ + at
  calculateVelocity(v0, a, t) {
    if (Array.isArray(v0)) {
      return v0.map((v, i) => v + a[i] * t);
    }
    return v0 + a * t;
  }

  // s = v₀t + 0.5at²
  calculateDisplacement(v0, a, t) {
    if (Array.isArray(v0)) {
      return v0.map((v, i) => v * t + 0.5 * a[i] * t * t);
    }
    return v0 * t + 0.5 * a * t * t;
  }

  // v² = v₀² + 2as
  calculateVelocityWithoutTime(v0, a, s) {
    if (Array.isArray(v0)) {
      return v0.map((v, i) => Math.sqrt(v * v + 2 * a[i] * s[i]));
    }
    return Math.sqrt(v0 * v0 + 2 * a * s);
  }

  // Parabolic trajectory
  parabolicTrajectory(v0, angleDeg, t) {
    const angleRad = (angleDeg * Math.PI) / 180;
    const g = 9.81;
    
    const vx = v0 * Math.cos(angleRad);
    const vy0 = v0 * Math.sin(angleRad);
    
    return {
      x: vx * t,
      y: vy0 * t - 0.5 * g * t * t,
      vx: vx,
      vy: vy0 - g * t
    };
  }

  // Time to reach maximum height
  timeToMaxHeight(v0, angleDeg) {
    const angleRad = (angleDeg * Math.PI) / 180;
    const vy0 = v0 * Math.sin(angleRad);
    return vy0 / 9.81;
  }

  // Maximum height
  maxHeight(v0, angleDeg) {
    const t = this.timeToMaxHeight(v0, angleDeg);
    const angleRad = (angleDeg * Math.PI) / 180;
    const vy0 = v0 * Math.sin(angleRad);
    return vy0 * t - 0.5 * 9.81 * t * t;
  }

  // Range (horizontal distance)
  range(v0, angleDeg) {
    const angleRad = (angleDeg * Math.PI) / 180;
    return (v0 * v0 * Math.sin(2 * angleRad)) / 9.81;
  }
}
```

---

## 7. SimulationLifecycle

**Ubicación:** `/shared/components/SimulationLifecycle/SimulationLifecycle.js`  
**Tipo:** Gestor de ciclo de vida  
**Dependencias:** Ninguna  
**Tamaño:** 290 líneas

**Uso:**
```javascript
const lifecycle = new SimulationLifecycle(canvas, {
  onRender: renderFn,
  onStateChange: stateFn
});
lifecycle.start();
```

### Código (Versión Reducida)

```javascript
class SimulationLifecycle {
  constructor(container, options = {}) {
    this.container = container;
    this.isRunning = false;
    this.isPaused = false;
    this.time = 0;
    this.deltaTime = 0;
    this.lastFrameTime = 0;
    this.maxDeltaTime = options.maxDeltaTime || 0.04;
    this.targetFPS = options.targetFPS || 60;
    this.targetFrameTime = 1000 / this.targetFPS;
    
    this.onRender = options.onRender || (() => {});
    this.onStateChange = options.onStateChange || (() => {});
    this.onStart = options.onStart || (() => {});
    this.onPause = options.onPause || (() => {});
    this.onResume = options.onResume || (() => {});
    this.onReset = options.onReset || (() => {});
    
    this.animationFrameId = null;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.isPaused = false;
    this.time = 0;
    this.lastFrameTime = performance.now();
    this.onStart();
    this._animate();
  }

  pause() {
    if (!this.isRunning || this.isPaused) return;
    this.isPaused = true;
    this.onPause();
  }

  resume() {
    if (!this.isRunning || !this.isPaused) return;
    this.isPaused = false;
    this.lastFrameTime = performance.now();
    this.onResume();
    this._animate();
  }

  reset() {
    this.isRunning = false;
    this.isPaused = false;
    this.time = 0;
    this.deltaTime = 0;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.onReset();
  }

  _animate() {
    if (!this.isRunning) return;
    
    const now = performance.now();
    const elapsed = now - this.lastFrameTime;
    
    if (!this.isPaused) {
      this.deltaTime = Math.min(elapsed / 1000, this.maxDeltaTime);
      this.time += this.deltaTime;
      this.lastFrameTime = now;
    }
    
    this.onRender(this.time, this.deltaTime);
    this.onStateChange({ time: this.time, isRunning: this.isRunning, isPaused: this.isPaused });
    
    this.animationFrameId = requestAnimationFrame(() => this._animate());
  }

  getState() {
    return {
      time: this.time,
      isRunning: this.isRunning,
      isPaused: this.isPaused,
      deltaTime: this.deltaTime
    };
  }
}
```

---

## 8. SliderControl

**Ubicación:** `/shared/components/SliderControl/SliderControl.js`  
**Tipo:** Control deslizante reutilizable  
**Dependencias:** Ninguna  
**Tamaño:** 58 líneas

**Uso:**
```javascript
const slider = new SliderControl(inputElement, valueElement, (newValue) => {
  console.log('Valor actualizado:', newValue);
});
```

### Código

```javascript
class SliderControl {
  constructor(inputElement, displayElement, callback) {
    this.input = inputElement;
    this.display = displayElement;
    this.callback = callback || (() => {});
    
    this.input.addEventListener('input', (e) => this._onInput(e));
    this.input.addEventListener('change', (e) => this._onChange(e));
    
    this.updateDisplay();
  }

  _onInput(event) {
    this.updateDisplay();
    this.callback(parseFloat(this.input.value));
  }

  _onChange(event) {
    this.callback(parseFloat(this.input.value));
  }

  updateDisplay() {
    const value = parseFloat(this.input.value);
    const step = parseFloat(this.input.step) || 1;
    const decimals = String(step).split('.')[1]?.length || 0;
    
    if (this.display) {
      this.display.textContent = value.toFixed(decimals);
    }
  }

  setValue(newValue) {
    this.input.value = newValue;
    this.updateDisplay();
    this.callback(newValue);
  }

  getValue() {
    return parseFloat(this.input.value);
  }

  setRange(min, max, step = 1) {
    this.input.min = min;
    this.input.max = max;
    this.input.step = step;
    this.updateDisplay();
  }
}
```

---

## 9. MathematicalModelPanel

**Ubicación:** `/shared/components/MathematicalModelPanel/MathematicalModelPanel.js`  
**Tipo:** Panel de modelos matemáticos  
**Dependencias:** Ninguna  
**Tamaño:** 68 líneas

**Uso:**
```javascript
const panel = new MathematicalModelPanel({
  formulas: [
    { id: 'formulaA', digits: 2 },
    { id: 'formulaB', digits: 3 }
  ],
  calculator: (state) => ({ formulaA: state.x * 2, formulaB: state.y })
});
panel.update(state);
```

### Código

```javascript
class MathematicalModelPanel {
  constructor(options = {}) {
    this.formulas = options.formulas || [];
    this.calculator = options.calculator || (() => ({}));
    this.elements = {};
    
    this.formulas.forEach(formula => {
      const el = document.getElementById(formula.id);
      if (el) {
        this.elements[formula.id] = { element: el, digits: formula.digits || 2 };
      }
    });
  }

  update(state) {
    const values = this.calculator(state);
    
    Object.keys(this.elements).forEach(id => {
      const { element, digits } = this.elements[id];
      const value = values[id];
      
      if (value !== undefined && value !== null && !isNaN(value)) {
        const formatted = typeof value === 'number' 
          ? value.toFixed(digits)
          : String(value);
        element.textContent = formatted;
      } else {
        element.textContent = '—';
      }
    });
  }

  reset() {
    Object.values(this.elements).forEach(({ element }) => {
      element.textContent = '0';
    });
  }
}
```

---

## 10. GraphRenderer

**Ubicación:** `/shared/components/GraphRenderer/GraphRenderer.js`  
**Tipo:** Renderizador modular de gráficos  
**Dependencias:** Ninguna  
**Tamaño:** 296 líneas

**Uso:**
```javascript
const renderer = new GraphRenderer(canvas, {
  xMin: -10, xMax: 10,
  yMin: -10, yMax: 10,
  width: 500, height: 500
});
renderer.drawGridAndAxes();
```

### Código (Versión Resumida - Métodos Clave)

```javascript
class GraphRenderer {
  constructor(element, options = {}) {
    this.element = element;
    this.isCanvas = element instanceof HTMLCanvasElement;
    
    this.xMin = options.xMin || -10;
    this.xMax = options.xMax || 10;
    this.yMin = options.yMin || -10;
    this.yMax = options.yMax || 10;
    
    this.width = options.width || 500;
    this.height = options.height || 500;
    this.margin = options.margin || 0;
    
    if (this.isCanvas) {
      this.ctx = element.getContext('2d');
      this.element.width = this.width;
      this.element.height = this.height;
    }
    
    this._calculatePixelScale();
  }

  _calculatePixelScale() {
    const usableWidth = this.width - 2 * this.margin;
    const usableHeight = this.height - 2 * this.margin;
    
    this.pixelsPerUnitX = usableWidth / (this.xMax - this.xMin);
    this.pixelsPerUnitY = usableHeight / (this.yMax - this.yMin);
  }

  drawGridAndAxes() {
    if (this.isCanvas) {
      this._drawGridCanvas();
      this._drawAxesCanvas();
    } else {
      this._drawGridSVG();
      this._drawAxesSVG();
    }
  }

  xToPixel(xValue) {
    return this.margin + (xValue - this.xMin) * this.pixelsPerUnitX;
  }

  yToPixel(yValue) {
    return this.height - this.margin - (yValue - this.yMin) * this.pixelsPerUnitY;
  }

  pixelToX(pixelX) {
    return this.xMin + (pixelX - this.margin) / this.pixelsPerUnitX;
  }

  pixelToY(pixelY) {
    return this.yMin + (this.height - this.margin - pixelY) / this.pixelsPerUnitY;
  }

  _drawGridCanvas() {
    const gridColor = getComputedStyle(document.documentElement).getPropertyValue('--grid-color') || '#e2e8f0';
    const gridWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--grid-line-width')) || 0.5;
    
    this.ctx.strokeStyle = gridColor;
    this.ctx.lineWidth = gridWidth;
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    const stepX = Math.pow(10, Math.floor(Math.log10((this.xMax - this.xMin) / 10)));
    const stepY = Math.pow(10, Math.floor(Math.log10((this.yMax - this.yMin) / 10)));
    
    for (let x = Math.ceil(this.xMin / stepX) * stepX; x <= this.xMax; x += stepX) {
      const px = this.xToPixel(x);
      this.ctx.beginPath();
      this.ctx.moveTo(px, this.margin);
      this.ctx.lineTo(px, this.height - this.margin);
      this.ctx.stroke();
    }
    
    for (let y = Math.ceil(this.yMin / stepY) * stepY; y <= this.yMax; y += stepY) {
      const py = this.yToPixel(y);
      this.ctx.beginPath();
      this.ctx.moveTo(this.margin, py);
      this.ctx.lineTo(this.width - this.margin, py);
      this.ctx.stroke();
    }
  }

  _drawAxesCanvas() {
    const axisColor = getComputedStyle(document.documentElement).getPropertyValue('--axis-color') || '#94a3b8';
    const axisWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--axis-line-width')) || 1;
    
    this.ctx.strokeStyle = axisColor;
    this.ctx.lineWidth = axisWidth;
    
    const x0Pixel = this.xToPixel(0);
    const y0Pixel = this.yToPixel(0);
    
    this.ctx.beginPath();
    this.ctx.moveTo(x0Pixel, this.margin);
    this.ctx.lineTo(x0Pixel, this.height - this.margin);
    this.ctx.stroke();
    
    this.ctx.beginPath();
    this.ctx.moveTo(this.margin, y0Pixel);
    this.ctx.lineTo(this.width - this.margin, y0Pixel);
    this.ctx.stroke();
  }

  setViewport(xMin, xMax, yMin, yMax) {
    this.xMin = xMin;
    this.xMax = xMax;
    this.yMin = yMin;
    this.yMax = yMax;
    this._calculatePixelScale();
  }
}
```

---

## Cómo Integrar Estos Componentes

### En un Laboratorio Modular

```html
<!-- En index.html -->
<script src="../../shared/components/Vector2D/Vector2D.js"></script>
<script src="../../shared/components/VerneMath/VerneMath.js"></script>
<script src="../../shared/components/GraphRenderer/GraphRenderer.js"></script>
<script src="../../shared/components/SimulationLifecycle/SimulationLifecycle.js"></script>

<script>
  const renderer = new GraphRenderer(canvas, options);
  const math = VerneMath.compile('2*x**2 - 3*x + 1');
  const lifecycle = new SimulationLifecycle(canvas, { onRender: render });
</script>
```

### En una Versión Standalone (Monolítica)

```html
<!DOCTYPE html>
<html>
<head>
  <title>Mi Laboratorio</title>
</head>
<body>
  <canvas id="canvas"></canvas>
  
  <script>
    // Vector2D inline
    class Vector2D { ... }
    
    // VerneMath inline
    (function (global) { ... })();
    
    // GraphRenderer inline
    class GraphRenderer { ... }
    
    // Mi código específico
    const renderer = new GraphRenderer(...);
  </script>
</body>
</html>
```

---

## Actualización de Este Bundle

Este documento se actualiza cuando:
- ✅ Se agrega un nuevo componente a `/shared/components/`
- ✅ Se modifica la API de un componente existente
- ✅ Se corrige un bug crítico en un componente
- ✅ Se incrementa la versión MAYOR de un componente

**Última actualización:** 2026-07-25  
**Versión:** 1.0.0  
**Componentes Completos:** 10/16 (los 6 restantes cumplen funciones especializadas)

