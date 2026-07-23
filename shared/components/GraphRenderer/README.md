# GraphRenderer — Renderizador modular 100% de gráficos

Componente que encapsula **TODA la lógica de dibujo de gráficos**:
- Grid y ejes (coordenadas)
- Conversión de coordenadas (matemática ↔ píxeles)
- Limpieza y redibujo
- Agnóstico de canvas/SVG

## Propósito

Eliminar **código duplicado** de dibujo de grid en cada laboratorio.
Garantizar **consistencia visual 100%** en todos los gráficos.

## Uso

```javascript
// Importar
<script src="../../shared/components/GraphRenderer/GraphRenderer.js"></script>

// Crear renderer
const graph = new GraphRenderer(canvasOrSvgElement, {
  xMin: -10, xMax: 10,
  yMin: -10, yMax: 10,
  width: 520,      // Opcional, se detecta del elemento
  height: 520,
  margin: 0        // Opcional: margen en píxeles (para labs con etiquetas)
});

// Dibujar grid y ejes (MODULAR)
graph.drawGridAndAxes();

// Actualizar viewport dinámicamente
graph.setViewport(-8, 8, -6, 6);
graph.drawGridAndAxes();

// El lab dibuja el resto (funciones, puntos, etc.)
// usando los métodos de conversion:
const px = graph.xToPixel(x);
const py = graph.yToPixel(y);
```

## API completa

### Constructor
```javascript
new GraphRenderer(element, options)
```

**options:**
- `xMin`, `xMax`, `yMin`, `yMax`: Rango del sistema de coordenadas
- `width`, `height`: Dimensiones (se detectan del elemento si omiten)
- `margin` (opcional): Margen en píxeles alrededor del área de dibujo (default: 0)

### Métodos

**`drawGridAndAxes()`** - Dibuja grid y ejes automáticamente (también limpia el canvas)

**`clear()`** - Limpia todo el contenido y rellena con fondo blanco

**`updateDimensions()`** - Actualiza ancho y alto desde el canvas real (para canvas que se redimensiona)

**`setViewport(xMin, xMax, yMin, yMax)`** - Actualiza el rango de coordenadas para vistas dinámicas

**Conversión de coordenadas:**
- `xToPixel(x)` - Coordenada X matemática → píxeles
- `yToPixel(y)` - Coordenada Y matemática → píxeles
- `pixelToX(px)` - Píxeles → coordenada X matemática
- `pixelToY(py)` - Píxeles → coordenada Y matemática

**Para canvas:**
- `getContext()` - Obtener contexto 2D para dibujar

**Para SVG:**
- `createSVGElement(tag, attrs)` - Crear elemento SVG
- `appendElement(element)` - Añadir elemento al gráfico

## Variables CSS globales

El componente lee automáticamente estas variables de `verne-theme.css`:
```css
--grid-line-width: 0.5;     /* Ancho de línea del grid */
--grid-color: #e2e8f0;      /* Color del grid */
--axis-line-width: 1;       /* Ancho de línea de ejes */
--axis-color: #94a3b8;      /* Color de ejes */
```

Si cambias estas variables, **TODOS los gráficos cambian automáticamente**.

## Ventajas

✅ **100% modular**: Sin código duplicado de grid en labs  
✅ **Consistencia garantizada**: Todos los gráficos iguales  
✅ **Agnóstico**: Funciona con canvas y SVG  
✅ **Flexible**: Labs pueden personalizar el layout, no el grid  
✅ **Mantenible**: Un cambio en GraphRenderer afecta todos los labs  

## Ejemplo: Labs refactorizados

**funciones-inecuaciones.html (SVG, sin margin):**
```javascript
const graphRenderer = new GraphRenderer(graph, {
  xMin: -10, xMax: 10,
  yMin: -10, yMax: 10,
  width: 520,
  height: 520
});
graphRenderer.drawGridAndAxes();
```

**derivadas.html (Canvas con margin):**
```javascript
const graphRenderer = new GraphRenderer(canvas, {
  xMin: -6, xMax: 6,
  yMin: -6, yMax: 6,
  width: 1100,
  height: 720,
  margin: 52  // Espacio para etiquetas de ejes
});
graphRenderer.setViewport(state.xMin, state.xMax, state.yMin, state.yMax);
graphRenderer.drawGridAndAxes();
```

**Resultado:** Ambos labs dibujan grid y ejes de forma idéntica, usando el mismo componente.
