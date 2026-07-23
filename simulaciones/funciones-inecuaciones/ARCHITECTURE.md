# Arquitectura: Funciones e Inecuaciones

## Patrón: MVP (Model-View-Presenter)

Este laboratorio implementa el patrón **Model-View-Presenter** de forma explícita, similar a `plano-inclinado`.

### Componentes

#### 1. **FuncionesInecuacionesModel.js** (Model)
Estado y lógica de negocio pura.

**Responsabilidades:**
- Gestionar estado: modo (inequalities/functions), textos de entrada, viewport
- Parsear inecuaciones y funciones (privado)
- Compilar expresiones con VerneMath
- Lazy-loading con cache: no reparsea hasta que los datos cambien

**Métodos públicos:**
- `setMode(mode)` - Cambiar entre inecuaciones/funciones
- `setInequalityText(text)` - Actualizar texto de inecuaciones
- `setFunctionText(text)` - Actualizar texto de funciones
- `setViewRange(range)` - Ajustar zoom
- `setCenter(x, y)` - Ajustar centro del viewport
- `getInequalities()` - Obtener inecuaciones parseadas
- `getFunctions()` - Obtener funciones parseadas
- `getViewport()` - Obtener rango actual (xMin, xMax, yMin, yMax)

#### 2. **FuncionesInecuacionesPresenter.js** (Presenter)
Orquestación de interacción + renderizado.

**Responsabilidades:**
- Conectar event listeners de UI (botones, sliders, textareas)
- Actualizar Model en respuesta a eventos
- Invocar render() cuando el state cambia
- Actualizar UI (labels, status, paneles visibles)
- Delegar rendering a Graph2DEngine e InequalityRegionRenderer

**Métodos públicos:**
- `setupEventListeners()` - Conectar todos los eventos
- `render()` - Renderizar el gráfico completo
- `updateModeUI()` - Cambiar paneles visibles
- `updateStatus(element, result, noun)` - Mostrar errores/aciertos de parsing

#### 3. **FuncionesInecuacionesConstants.js** (Configuration)
Valores centralizados para evitar hardcodeados.

**Incluye:**
- `STEP` - Tamaño de muestreo para regiones sombreadas
- `GRAPH_INITIAL_VIEWPORT` - Rango inicial (-10 a +10)
- `GRAPH_RENDERING` - Ancho de línea, grid, ejes
- `REGION_SHADING` - Color de sombreado
- `TEXT` - Textos de interfaz (i18n ready)
- `SLIDER_RANGE` - Min/max/step del slider de zoom

#### 4. **View** (index.html)
HTML puro con IDs estándar. Sin lógica.

Elementos clave:
- `#btnInequalities`, `#btnFunctions` - Botones de modo
- `#ineqInput`, `#funcInput` - Textareas de entrada
- `#ineqStatus`, `#funcStatus` - Estado de parsing
- `#viewRange`, `#viewRangeLabel` - Slider de zoom
- `#graph` - Canvas para el gráfico

### Componentes Reutilizables (/shared)

| Componente | Ubicación | Función |
|---|---|---|
| **Graph2DEngine** | /shared/components/Graph2DEngine | Renderizado 2D (grid, ejes, funciones) |
| **VerneGraphNavigator** | /shared/components/GraphNavigator | Pan/zoom interactivo |
| **VerneMath** | /shared/components/VerneMath | Compilación de expresiones |

### Componentes Específicos (local)

| Componente | Ubicación | Función |
|---|---|---|
| **InequalityRegionRenderer** | ./components/InequalityRegionRenderer | Sombreado de regiones (específico del lab) |

## Flujo de Datos

```
User Input (UI)
    ↓
Presenter.setupEventListeners()
    ↓
Model.setter() (actualiza state)
    ↓
Presenter.render()
    ↓
Model.getter() (parsea si es necesario, devuelve cached)
    ↓
Graph2DEngine.addFunctionPlot() (dibuja funciones/límites)
    ↓
InequalityRegionRenderer.drawRegion() (sombrear)
    ↓
Visual Update (canvas + DOM)
```

## Separación de Responsabilidades

### Model (Lógica pura)
```javascript
const model = new FuncionesInecuacionesModel();
model.setInequalityText("y < 2x + 1 ; red");
const result = model.getInequalities();
// result = { ok: [{...}], errors: [] }
```

### Presenter (Orquestación)
```javascript
this.dom.ineqInput.addEventListener("input", () => {
  this.model.setInequalityText(this.dom.ineqInput.value);
  this.render(); // Dibujar cambios
});
```

### View (HTML puro)
```html
<textarea id="ineqInput">y < log(x) ; orange</textarea>
<div id="ineqStatus" class="status ok"></div>
```

## Escalabilidad

- **Agregar modos nuevos:** Extender Model con nuevas propiedades y lógica de parsing
- **Cambiar colores/tamaños:** Actualizar FuncionesInecuacionesConstants.js
- **Mejorar internacionalizacionálización:** Expandir sección TEXT en constants
- **Reutilizar en otro lab:** Copiar Model/Presenter/Constants y adaptar

## Testing

El Model es 100% testeable (sin dependencias de DOM ni Canvas):
```javascript
const model = new FuncionesInecuacionesModel();
model.setInequalityText("y < x^2 ; red\ny > -1 ; blue");
const result = model.getInequalities();
assert(result.ok.length === 2);
```

---

**Última actualización:** 2026-07-24  
**Patrón:** MVP  
**Estado:** Producción
