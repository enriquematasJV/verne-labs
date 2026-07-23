# Arquitectura: Cinemática 2D

## Patrón: MVP (Model-View-Presenter)

Este laboratorio implementa el patrón **Model-View-Presenter** para separar física, estado y presentación en una simulación de cinemática 2D compleja.

### Componentes

#### 1. **Cinematica2DModel.js** (Model)
Lógica de física y estado puro.

**Responsabilidades:**
- Gestionar estado: modo, condiciones iniciales (altura, velocidad, ángulo, gravedad)
- Calcular componentes iniciales según el tipo de disparo
- Cinemática: posición x(t), y(t) y velocidad vx, vy(t)
- Cálculos teóricos: tiempo de vuelo, altura máxima, alcance, velocidad de impacto
- Actualizar simulación en tiempo real (updateTime)
- Gestionar milestones pedagógicos (pausas automáticas en puntos clave)
- Gestionar trayectoria (trail)
- Sin dependencias de DOM ni Canvas

**Métodos públicos:**
- `setMode(mode)` - Cambiar tipo de disparo (vertical/horizontal/parabolic)
- `setHeight(y0)` - Altura inicial
- `setSpeed(v0)` - Velocidad inicial
- `setAngle(angleDeg)` - Ángulo de lanzamiento
- `setGravity(g)` - Aceleración gravitatoria
- `getTheoretical()` - Calcular trayectoria teórica completa
- `xAt(t)`, `yAt(t)` - Posición en tiempo t
- `vxAt()`, `vyAt(t)` - Velocidad en tiempo t
- `updateTime(deltaMs)` - Avanzar simulación
- `resetSimulation()` - Reiniciar
- `checkMilestones()` - Verificar pausas pedagógicas

#### 2. **Cinematica2DPresenter.js** (Presenter)
Orquestación de interacción + renderizado + animación.

**Responsabilidades:**
- Conectar event listeners de UI (sliders, selects, botones)
- Actualizar Model en respuesta a eventos
- Sincronizar UI (labels, métricas, ecuaciones)
- Renderizar canvas (grid, trayectoria, pelota, vectores)
- Gestionar loop de animación con requestAnimationFrame
- Delegar a componentes /shared (Grid, Axes)

**Métodos públicos:**
- `setupEventListeners()` - Conectar todos eventos
- `readControls()` - Leer valores de inputs
- `applyPreset()` - Aplicar escenario predefinido
- `start()`, `pause()`, `resetSimulation()` - Control de animación
- `animate()` - Loop de animación principal
- `syncUI()` - Actualizar valores en DOM
- `draw()` - Renderizar canvas completo

#### 3. **Cinematica2DConstants.js** (Configuration)
Valores centralizados.

**Incluye:**
- `PRESETS` - 4 escenarios (vertical, horizontal, parabólico, libre)
- `INITIAL_STATE` - Estado inicial completo
- `CONTROL_RANGES` - Min/max de sliders
- `COLORS` - Paleta de colores
- `RENDERING` - Parámetros canvas (líneas, tamaños)
- `PHYSICS` - Constantes físicas (g, epsilon)
- `MILESTONE_TOLERANCE` - Tolerancia para milestones pedagógicos
- `TEXT` - Etiquetas (i18n ready)

#### 4. **View** (index.html)
HTML puro. Sin lógica.

Elementos clave:
- `#preset` - Selector de escenarios
- `#mode` - Selector tipo de disparo
- `#height`, `#speed`, `#angle`, `#gravity` - Sliders
- `#scene` - Canvas para animación
- `#timeValue`, `#positionValue`, etc - Métricas

### Componentes Reutilizables (/shared)

| Componente | Función |
|---|---|
| **Canvas 2D** | Renderizado nativo del navegador (usado indirectamente) |

### Componentes Específicos (local)

| Componente | Función |
|---|---|
| **Cinematica2DModel** | Física cinemática 2D, milestones |
| **Cinematica2DPresenter** | Animación, eventos, renderizado |
| **Cinematica2DConstants** | Configuración |

## Flujo de Datos

```
User Input (Slider, Button, Preset)
    ↓
Presenter.setupEventListeners()
    ↓
Model.setter() (actualiza state)
    ↓
Presenter.animate() [requestAnimationFrame loop]
    ↓
Model.updateTime() (avanza simulación)
    ↓
Model.checkMilestones() (pausas pedagógicas)
    ↓
Presenter.syncUI() (actualizar DOM)
    ↓
Presenter.draw() (renderizar canvas)
    ↓
Visual Update (canvas + DOM)
```

## Separación de Responsabilidades

### Model (Física pura)
```javascript
const model = new Cinematica2DModel(Cinematica2DConstants);
model.setMode('parabolic');
model.setSpeed(30);
model.setAngle(45);
const th = model.getTheoretical();
// th = { flightTime: 3.06, maxHeight: 22.95, range: 91.76, ... }
```

### Presenter (Orquestación)
```javascript
document.getElementById('startBtn').addEventListener('click', () => {
  model.setRunning(true);
  presenter.animate(); // Inicia loop requestAnimationFrame
});
```

### View (HTML puro)
```html
<input id="speed" type="range" min="0" max="500" step="1" value="25" />
<canvas id="scene" width="950" height="580"></canvas>
```

## Escalabilidad

- **Cambiar presets:** Editar Cinematica2DConstants.PRESETS
- **Cambiar colores:** Cinematica2DConstants.COLORS
- **Agregar nuevos modos de disparo:** Extender Model.getInitialComponents()
- **Mejorar renderizado:** Actualizar Presenter.draw()
- **Pedagogía:** Extender Model.checkMilestones() y getStageDescription()

## Testing

El Model es 100% testeable (sin dependencias de DOM/Canvas):
```javascript
const model = new Cinematica2DModel(Cinematica2DConstants);
model.setMode('parabolic');
model.setSpeed(20);
model.setAngle(45);
const th = model.getTheoretical();
assert(th.flightTime > 0);
assert(th.maxHeight > 0);
```

## Complejidad vs Derivadas

Este laboratorio es **significativamente más complejo**:
- ✓ Física: Cinemática 2D (vs 1D en derivadas)
- ✓ Simulación: Loop de animación continua (vs cálculos estáticos)
- ✓ Milestones: Pausas automáticas pedagógicas (vs manual)
- ✓ Presets: 4 escenarios diferentes
- ✓ Canvas: Trayectorias, vectores, grid (vs líneas simples)

---

**Última actualización:** 2026-07-24  
**Patrón:** MVP  
**Estado:** Producción  
**Refactorizado desde:** 700+ líneas monolíticas → 3 módulos MVP
