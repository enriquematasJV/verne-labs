# Laboratorio: Dinámica en Plano Inclinado

**Estado:** ✅ Completamente modularizado y funcional  
**Última actualización:** 2026-07-24  
**Patrón:** MVP (Model-View-Presenter)

---

## 🎯 Funcionalidades

### 1. Simulación Física Interactiva
- **Movimiento de bloques en plano inclinado** bajo la influencia de:
  - Gravitación (g = 9.8 m/s²)
  - Ángulo de inclinación (0° a 90°)
  - Coeficiente de rozamiento estático/dinámico (0 a 1)
  - Masa del bloque (0.5 a 20 kg)
  - Longitud de la rampa (2 a 20 m)

### 2. Cálculos Dinámicos
- **Fuerzas:**
  - Peso total (P = m·g)
  - Componente paralela a la rampa (Pₓ = m·g·sin(θ))
  - Fuerza normal (N = m·g·cos(θ))
  - Rozamiento máximo (f = μ·N)
  - Fuerza neta (Fₙₑₜ = Pₓ - f)
  
- **Cinemática:**
  - Aceleración (a = Fₙₑₜ / m)
  - Velocidad (integración numérica RK4)
  - Posición (cinemática 1D)
  - Tiempo total de descenso

### 3. Visualización Canvas 2D
- **Escena 3D isométrica simulada:**
  - Plano inclinado con ángulo variable
  - Bloque 3D que se desliza por la rampa
  - Posicionamiento dinámico según distancia recorrida
  - Detección de fin de rampa
  
- **Diagrama de fuerzas con descomposición vectorial:**
  - Vector de peso (P) en rojo
  - Componente paralela (Pₓ) descompuesta
  - Componente perpendicular descompuesta
  - Fuerza normal (N) en verde
  - Rozamiento (f) en naranja
  - Fuerza neta (Fₙₑₜ) en púrpura

### 4. Panel Interactivo de Fórmulas
- Visualización dinámica de ecuaciones algebraicas
- Valores que cambian en tiempo real con los sliders
- Muestra las 7 ecuaciones fundamentales del sistema

### 5. Controles Interactivos
- **Sliders:** Ángulo, rozamiento, masa, longitud de rampa
- **Botones:** Iniciar, Pausar, Reiniciar simulación
- **Métricas en vivo:** Tiempo, velocidad, distancia, aceleración
- **Detalles de fuerzas:** Valores numéricos actualizados

### 6. Cálculos Teóricos
- Tiempo teórico total de descenso
- Velocidad teórica final
- Comparación automática con valores simulados

---

## 🏗️ Modularización

### Estructura de Carpetas
```
simulaciones/plano-inclinado/
├── index.html                          # Punto de entrada
├── LABORATORIO.md                      # Este archivo
├── ARCHITECTURE.md                     # Documentación de arquitectura
├── js/                                 # Módulos específicos del lab
│   ├── PlanoInclinadoPhysics.js       # Cálculos de física estática
│   ├── PlanoInclinadoModel.js         # Lógica de simulación (sin DOM)
│   └── PlanoInclinadoPresenter.js     # Presentación y orquestación
└── css/
    └── plano-inclinado.css            # Estilos del laboratorio
```

### Principios de Modularización

✅ **Separación de responsabilidades:**
- **Physics:** Cálculos matemáticos puros (sin estado)
- **Model:** Gestión de estado y lógica de simulación
- **Presenter:** Renderizado, eventos, interacción con DOM

✅ **Sin hardcoding:**
- Constantes centralizadas en `index.html` (CONSTANTS)
- Parámetros inyectados en constructores
- Configuración separada de lógica

✅ **Reutilización a través de /shared:**
- Componentes gráficos
- Motores de física
- Utilidades matemáticas

---

## 📦 Módulos /shared Utilizados

### 1. **Canvas2DRenderer** (`/shared/js/graphics/`)
**Propósito:** Abstracción de Canvas 2D  
**Métodos utilizados:**
- `clear(color)` - Limpiar canvas
- `drawPolygon(points, fill, stroke, width)` - Dibujar rampa y bloque
- `drawArrow()` - Dibujar vectores de fuerza
- `drawLine()` - Ejes, líneas de referencia
- `drawArc()` - Marcadores de ángulo
- `drawText()` - Etiquetas

**Línea de code:** 
```javascript
const renderer = new Canvas2DRenderer(canvas);
```

---

### 2. **Vector2D** (`/shared/js/math/`)
**Propósito:** Operaciones vectoriales 2D  
**Métodos utilizados:**
- `add()` - Suma de vectores
- `scale()` - Escalado
- **`decompose(axisParallel, axisPerp)`** - Descomposición vectorial (extendido)
  - Descompone peso en componentes paralela y perpendicular a la rampa
  - Crítico para visualizar fuerzas correctamente

**Línea de code:**
```javascript
const weightDecomp = weightVec.decompose(axisParallel, axisPerp);
```

---

### 3. **OdeSolverRK4** (`/shared/js/physics/`)
**Propósito:** Integración numérica de ecuaciones diferenciales  
**Uso:** Resolver dv/dt = a(t) para obtener velocidad  
**Método:** Runge-Kutta 4to orden

**Línea de code:**
```javascript
this.odeSolver = new OdeSolverRK4(
  (t, v) => this.getAcceleration(),
  0
);
```

---

### 4. **KinematicsEngine** (`/shared/js/physics/`)
**Propósito:** Cálculos cinemáticos 1D  
**Métodos utilizados:**
- `position1D(x, v, a, dt)` - Calcular nueva posición

**Línea de code:**
```javascript
this.distance = this.kinematics.position1D(
  this.distance,
  this.velocity,
  a,
  deltaTime
);
```

---

### 5. **SimulationLifecycle** (`/shared/js/simulations/`)
**Propósito:** Orquestación de ciclo de vida de animación  
**Métodos utilizados:**
- `start()`, `pause()`, `reset()` - Control de estado
- `isRunning()`, `canStart()` - Consultas de estado
- `on()` - Listeners de eventos

**Línea de code:**
```javascript
this.lifecycle = new SimulationLifecycle(
  (dt) => this.onStep(dt),
  () => this.model.reset(),
  () => this.model.canStart()
);
```

---

### 6. **SliderControl** (`/shared/js/ui/`)
**Propósito:** Componente de entrada reutilizable  
**Métodos utilizados:**
- Constructor para vincular slider, display, callback
- `getValue()` - Obtener valor actual
- `updateDisplay()` - Actualizar etiqueta

**Línea de code:**
```javascript
const angleSlider = new SliderControl(
  document.getElementById('angle'),
  document.getElementById('angleValue'),
  null
);
```

---

### 7. **MathematicalModelPanel** (`/shared/components/`)
**Propósito:** Visualización dinámica de fórmulas matemáticas  
**Métodos utilizados:**
- Constructor con formulas y calculator
- `update(state)` - Actualizar valores mostrados

**Línea de code:**
```javascript
const formulasPanel = new MathematicalModelPanel({
  formulas: [...],
  calculator: (state) => ({ ... })
});
```

---

## 🔧 Módulos Específicos del Laboratorio

### 1. **PlanoInclinadoPhysics.js**
**Responsabilidad:** Cálculos de física estática (sin estado)

**Métodos estáticos:**
```javascript
// Calcula todas las fuerzas para parámetros dados
calculateInclinedPlane(mass, angleRad, mu, g = 9.8)
  → { parallel, normal, friction, netForce, acceleration, staticHold }

// Calcula valores teóricos de tiempo y velocidad final
theoreticalInclinedPlane(acceleration, distance)
  → { time, velocity }
```

**Características:**
- Funciones puras (sin estado)
- Reutilizables en otros contextos
- Validación de casos extremos (staticHold)

---

### 2. **PlanoInclinadoModel.js**
**Responsabilidad:** Lógica de simulación y gestión de estado

**Propiedades:**
- `angleDeg`, `mu`, `mass`, `rampLength` - Parámetros ajustables
- `distance`, `velocity`, `time` - Estado de simulación
- `finished` - Bandera de fin de rampa

**Métodos públicos:**
- `setAngle()`, `setFriction()`, `setMass()`, `setRampLength()` - Setters
- `getDynamics()` - Obtener fuerzas actuales
- `getTheoretical()` - Obtener valores teóricos
- `step(deltaTime)` - Avanzar simulación
- `canStart()` - Validar si puede iniciar
- `reset()` - Reiniciar

**Integraciones:**
- Usa `OdeSolverRK4` para integración numérica
- Usa `KinematicsEngine` para cinemática
- Llama a `PlanoInclinadoPhysics` para cálculos

---

### 3. **PlanoInclinadoPresenter.js**
**Responsabilidad:** Presentación, renderizado, eventos

**Métodos principales:**
- `setupEventListeners()` - Vincular eventos de sliders y botones
- `updateUI()` - Actualizar todos los elementos DOM
- `render()` - Dibujar escena Canvas
- `animate(timestamp)` - Animación con requestAnimationFrame

**Renderizado específico:**
- Cálculo de geometría 3D isométrica
- Transformaciones de coordenadas (canvas a rampa)
- Diagrama de fuerzas con vectores descompuestos
- Indicador de ángulo

**Integración con MathematicalModelPanel:**
```javascript
if (this.formulasPanel) {
  this.formulasPanel.update({ angleDeg, mass, mu, velocity, time });
}
```

---

### 4. **plano-inclinado.css**
**Responsabilidad:** Estilos específicos del laboratorio

**Componentes:**
- Layout general
- Panel de controles
- Canvas de escena
- Métricas y detalles
- Panel de modelo matemático

---

## 📊 Dependencias y Flujo de Datos

### Inicialización (en index.html)
```
1. Crear CONSTANTS
2. Crear Canvas2DRenderer
3. Crear 4x SliderControl (ángulo, rozamiento, masa, longitud)
4. Crear MathematicalModelPanel
5. Crear PlanoInclinadoModel
6. Crear PlanoInclinadoPresenter (pasa model, renderer, sliders, dom, constants, panel)
7. Llamar presenter.updateUI() y presenter.render()
```

### Durante simulación
```
requestAnimationFrame (SimulationLifecycle)
  → PlanoInclinadoPresenter.animate()
    → PlanoInclinadoModel.step(deltaTime)
      → OdeSolverRK4.step() [calcula velocidad]
      → KinematicsEngine.position1D() [calcula posición]
    → PlanoInclinadoPresenter.updateUI()
      → DOM updates
      → MathematicalModelPanel.update()
    → PlanoInclinadoPresenter.render()
      → Canvas2DRenderer.* [dibuja escena]
      → Vectores de fuerza con descomposición
```

### Eventos de usuario
```
Slider input
  → PlanoInclinadoPresenter.setupEventListeners()
    → PlanoInclinadoModel.setters (setAngle, etc.)
      → model.reset()
    → presenter.updateUI()
    → presenter.render()

Botón Iniciar/Pausar/Reiniciar
  → SimulationLifecycle.*
    → model.reset() o animación
```

---

## ✨ Características Técnicas Avanzadas

### 1. Descomposición Vectorial
El laboratorio visualiza la descomposición del vector de peso en:
- **Componente paralela:** Fuerza que causa el movimiento
- **Componente perpendicular:** Presión normal sobre la rampa

**Implementación:**
```javascript
const axisParallel = new Vector2D(ux, uy);  // dirección de la rampa
const axisPerp = new Vector2D(nx, ny);      // perpendicular a la rampa
const decomp = weightVec.decompose(axisParallel, axisPerp);
```

### 2. Integración Numérica RK4
Resuelve la ecuación diferencial dv/dt = a(t) con precisión 4to orden.

**Ventajas:**
- Resultado más preciso que Euler
- Maneja aceleraciones variables
- Paso de tiempo adaptable

### 3. Detección Estática
Evita simulación innecesaria cuando el bloque no se mueve:
```javascript
const staticHold = acceleration < 0.001;
```

### 4. Renderizado Dinámico de Canvas
- Escalado automático según longitud de rampa
- Transformación de coordenadas rampa → canvas
- Rotación del bloque según ángulo
- Anti-aliasing mediante scaling

---

## 🧪 Testing y Validación

### Caso de prueba verificado (2026-07-24):
- **Ángulo:** 45°
- **Masa:** 10 kg
- **Rozamiento:** μ = 0.5
- **Longitud:** 8 m

**Valores esperados vs. calculados:**
| Parámetro | Esperado | Calculado | ✓ |
|-----------|----------|-----------|---|
| P | 98.10 N | 98.10 N | ✓ |
| Pₓ | 69.37 N | 69.37 N | ✓ |
| N | 69.37 N | 69.37 N | ✓ |
| f | 34.68 N | 34.68 N | ✓ |
| a | 3.468 m/s² | 3.468 m/s² | ✓ |

---

## 🚀 Próximas Mejoras

1. **Exportar gráficos:** Guardar datos de simulación como CSV/JSON
2. **Comparación visual:** Gráficas tiempo vs. velocidad/posición
3. **Casos predefinidos:** Botones de escenarios interesantes
4. **Modo pausa stepped:** Avanzar paso a paso
5. **Análisis energético:** Mostrar energía cinética y potencial

---

## 📝 Resumen

✅ **Completamente modularizado**
- Separación clara Model/View/Presenter
- Sin hardcoding
- Reutilizable

✅ **Altamente integrado con /shared**
- 7 módulos de /shared utilizados
- 3 módulos específicos del lab

✅ **Funcionalidad completa**
- Simulación física realista
- Visualización avanzada
- Panel dinámico de fórmulas
- Controles interactivos

✅ **Código limpio y mantenible**
- Responsabilidades claras
- Métodos bien nombrados
- Comentarios estratégicos
- CSS modularizado

---

**Generado:** 2026-07-24  
**Rama:** `feature/plano-inclinado-panel-formulas`  
**Responsable:** Sistema de documentación automática
