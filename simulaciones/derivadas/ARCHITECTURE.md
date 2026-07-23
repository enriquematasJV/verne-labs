# Arquitectura: Derivada como Límite

## Patrón: MVP (Model-View-Presenter)

Este laboratorio implementa el patrón **Model-View-Presenter** de forma explícita para separar lógica, estado y presentación.

### Componentes

#### 1. **DerivadaModel.js** (Model)
Estado y lógica de negocio pura.

**Responsabilidades:**
- Gestionar estado: función, punto x, incremento h, viewport
- Compilar expresiones con VerneMath
- Calcular derivadas aproximadas
- Gestionar viewport (zoom, pan)
- Auto-ajuste de rango Y según función
- Conversión de coordenadas (math ↔ screen)
- Sin dependencias de DOM ni Canvas

**Métodos públicos:**
- `setFunctionExpr(expr)` - Cambiar función
- `setXPoint(x)` - Punto de análisis
- `setH(h)` - Incremento
- `setViewRange(zoom)` - Zoom
- `setOrigin(origin)` - Desplazamiento horizontal
- `setViewport(xMin, xMax, yMin, yMax)` - Viewport manual (pan/zoom)
- `safeEval(x)` - Evaluar función en punto
- `derivativeApprox(x)` - Derivada aproximada
- `calculateSecantSlope(x, h)` - Pendiente secante
- `autoFitY()` - Auto-ajustar Y
- `formatNumber(value)` - Formatar para UI
- `stepAnimateTowardsZero()` - Paso de animación

#### 2. **DerivadaPresenter.js** (Presenter)
Orquestación de interacción + renderizado.

**Responsabilidades:**
- Conectar event listeners de UI (input, sliders, botones)
- Actualizar Model en respuesta a eventos
- Invocar render() cuando el state cambia
- Delegar grid/ejes a GraphRenderer
- Dibujar función, líneas (secante/tangente), triángulo
- Dibujar anotaciones y métricas
- Gestionar animación h→0

**Métodos públicos:**
- `setupEventListeners()` - Conectar todos eventos
- `render()` - Renderizar gráfico completo
- `animateTowardsZero()` - Iniciar animación
- `pauseAnimation()` - Parar animación
- `reset()` - Reiniciar a valores iniciales
- `syncSlidersFromView()` - Sincronizar controles

#### 3. **DerivadaConstants.js** (Configuration)
Valores centralizados para evitar hardcodeados.

**Incluye:**
- `COLORS` - Función, tangente, secante, triángulo, puntos
- `RENDERING` - Ancho línea, márgenes, samples, radio puntos
- `ANIMATION` - Factor decaimiento, threshold
- `VIEWPORT_INITIAL` - Rango inicial (-6 a +6)
- `SLIDER_RANGE` - Min/max de controles
- `TOLERANCES` - Epsilón, thresholds numéricos
- `TEXT` - Etiquetas, unidades (i18n ready)

#### 4. **View** (index.html)
HTML puro con estructura y IDs. Sin lógica.

Elementos clave:
- `#graph` - Canvas para gráfico
- `#functionInput` - Entrada de función
- `#xPoint` - Punto x
- `#hSlider` - Slider incremento h
- `#zoomSlider` - Slider zoom
- `#originSlider` - Slider pan horizontal
- `#metricX`, `#metricFX`, etc - Métricas

### Componentes Reutilizables (/shared)

| Componente | Ubicación | Función |
|---|---|---|
| **VerneMath** | /shared/components/VerneMath | Compilación y evaluación de expresiones |
| **GraphRenderer** | /shared/components/GraphRenderer | Renderizado de grid, ejes |
| **VerneGraphNavigator** | /shared/components/GraphNavigator | Pan/zoom interactivo con mouse |

### Componentes Específicos (local)

| Componente | Ubicación | Función |
|---|---|---|
| **DerivadaModel** | ./js/DerivadaModel.js | Lógica de derivada, estado, cálculos |
| **DerivadaPresenter** | ./js/DerivadaPresenter.js | Renderizado de gráfico, anotaciones, eventos |
| **DerivadaConstants** | ./js/DerivadaConstants.js | Configuración centralizada |

## Flujo de Datos

```
User Input (Slider, Button, Input)
    ↓
Presenter.setupEventListeners()
    ↓
Model.setter() (actualiza state)
    ↓
Presenter.render()
    ↓
Model.getter() (calcula si es necesario, devuelve)
    ↓
GraphRenderer.drawGridAndAxes() (grid + ejes)
    ↓
Presenter._drawFunction() (función azul)
    ↓
Presenter._drawLineThroughPoint() (secante + tangente)
    ↓
Presenter._drawTriangle() (triángulo Δx, Δy)
    ↓
Presenter._drawAnnotations() (caja de anotaciones)
    ↓
Presenter._updateMetrics() (valores en UI)
    ↓
Visual Update (canvas + DOM)
```

## Separación de Responsabilidades

### Model (Lógica pura)
```javascript
const model = new DerivadaModel(DerivadaConstants);
model.setFunctionExpr('sin(x)');
model.setXPoint(2);
const derivative = model.derivativeApprox(2);
// derivativa = aprox ~-0.4161
```

### Presenter (Orquestación)
```javascript
this.dom.functionInput.addEventListener('input', () => {
  this.model.setFunctionExpr(this.dom.functionInput.value);
  this.render(); // Dibujar cambios
});
```

### View (HTML puro)
```html
<input id="functionInput" type="text" value="x^2" />
<canvas id="graph" width="1100" height="720"></canvas>
```

## Escalabilidad

- **Cambiar función inicial:** Editar DerivadaConstants.VIEWPORT_INITIAL
- **Cambiar colores:** Actualizar DerivadaConstants.COLORS
- **Cambiar rangos de sliders:** DerivadaConstants.SLIDER_RANGE
- **Agregar nuevas métricas:** Extender Model.formatNumber() y Presenter._updateMetrics()
- **Cambiar algoritmo de derivada:** Reemplazar Model.derivativeApprox()

## Testing

El Model es 100% testeable (sin dependencias de DOM ni Canvas):
```javascript
const model = new DerivadaModel(DerivadaConstants);
model.setFunctionExpr('x^2');
model.setXPoint(3);
const deriv = model.derivativeApprox(3);
assert(Math.abs(deriv - 6) < 0.01); // Derivada de x² en x=3 es 6
```

## Modulación: Antes vs Después

### Antes (480+ líneas en 1 script)
- ❌ Estado global `state{}`
- ❌ Funciones sueltas sin clase
- ❌ 10 valores hardcodeados (colores, márgenes, etc)
- ❌ 30+ event listeners enredados
- ❌ Lógica y presentación mezcladas
- ❌ No testeable

### Después (3 módulos, 380 líneas)
- ✓ Estado encapsulado en Model
- ✓ Métodos organizados en clases
- ✓ 0 hardcodeados, todo en Constants
- ✓ Event listeners centralizados en Presenter.setupEventListeners()
- ✓ Lógica en Model, presentación en Presenter
- ✓ Model 100% testeable

---

**Última actualización:** 2026-07-24  
**Patrón:** MVP  
**Estado:** Producción  
**Refactorizado desde:** Single monolithic script → 3 módulos MVP
