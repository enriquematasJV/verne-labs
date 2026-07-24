# VectorRenderer — Visualización especializada de vectores

Componente reutilizable **especializado en vectores**: flechas, descomposiciones, campos.

**Responsabilidad**: Visualizar VECTORES (magnitudes con dirección).
**NO incluye**: Primitivos gráficos decorativos (arcos, líneas generales). Usa Canvas2DRenderer para eso.

## Uso básico

```javascript
// Crear renderer
const vectorRenderer = new VectorRenderer(canvas, {
  arrowHeadSize: 10,
  arrowLineWidth: 2,
  labelFontSize: 14
});

// Dibujar una flecha
vectorRenderer.drawArrow(x1, y1, x2, y2, '#ff0000', 'F');
```

## Métodos principales

### `drawArrow(x1, y1, x2, y2, color, label)`
Dibuja una flecha (vector) desde un punto de origen a un destino.

**Parámetros:**
- `x1, y1`: Origen de la flecha (píxeles)
- `x2, y2`: Destino de la flecha (píxeles)
- `color`: Color CSS (#fff, 'red', etc.)
- `label`: Etiqueta opcional (ej: 'F', 'v', 'a')

**Ejemplo:**
```javascript
renderer.drawArrow(100, 100, 150, 150, '#0066ff', 'v');
```

---

### `drawDecomposedVector(origin, vector, axis1, axis2, scale, colors)`
Dibuja un vector descompuesto en dos componentes ortogonales.

**Parámetros:**
- `origin`: {x, y} punto de origen
- `vector`: Vector2D a descomponer
- `axis1`: Vector2D primer eje
- `axis2`: Vector2D segundo eje
- `scale`: Factor de escala (px/unidad)
- `colors`: {axis1: '#...', axis2: '#...', resultant: '#...'}

**Ejemplo (Plano Inclinado):**
```javascript
const weight = new Vector2D(0, -mg);
const axisParallel = new Vector2D(Math.cos(angle), Math.sin(angle));
const axisPerp = new Vector2D(-Math.sin(angle), Math.cos(angle));

vectorRenderer.drawDecomposedVector(
  {x: 200, y: 300},
  weight,
  axisParallel,
  axisPerp,
  50,  // escala
  {axis1: '#ff0000', axis2: '#00ff00'}
);
```

---

### `drawVectorSet(origin, vectors, scale)`
Dibuja múltiples vectores desde el mismo punto de origen.

**Parámetros:**
- `origin`: {x, y} punto común
- `vectors`: Array de {vector: Vector2D, color, label}
- `scale`: Factor de escala

**Ejemplo:**
```javascript
renderer.drawVectorSet(
  {x: 100, y: 100},
  [
    {vector: new Vector2D(50, 0), color: '#ff0000', label: 'Fx'},
    {vector: new Vector2D(0, 50), color: '#00ff00', label: 'Fy'},
    {vector: new Vector2D(50, 50), color: '#0000ff', label: 'F'}
  ],
  1
);
```

---

### `drawVectorField(vectorFunction, bounds, step, color, scale)`
Dibuja un campo de vectores (malla de flechas).

**Parámetros:**
- `vectorFunction`: f(x, y) → Vector2D
- `bounds`: {xMin, xMax, yMin, yMax, screenWidth, screenHeight}
- `step`: Espaciado de la malla (píxeles, default 20)
- `color`: Color de todos los vectores
- `scale`: Factor de escala

**Ejemplo:**
```javascript
const field = (x, y) => new Vector2D(-y, x); // Rotación
renderer.drawVectorField(
  field,
  {xMin: -10, xMax: 10, yMin: -10, yMax: 10, screenWidth: 400, screenHeight: 400},
  30,
  '#666666',
  0.3
);
```

---

### `drawMeasure(x1, y1, x2, y2, color, text, markSize)`
Dibuja una medida (línea con marcas en los extremos y etiqueta).
Útil para mostrar dimensiones como alcance, altura máxima, etc.

**Parámetros:**
- `x1, y1`: Punto inicial (píxeles)
- `x2, y2`: Punto final (píxeles)
- `color`: Color de la medida
- `text`: Etiqueta (ej: "alcance = 50 m")
- `markSize`: Tamaño de las marcas en los extremos (default 7)

**Ejemplo (Cinemática 2D):**
```javascript
renderer.drawMeasure(
  viewportLeftX, viewportBottomY,
  impactX, viewportBottomY,
  '#ff6600',
  'alcance = 45.5 m'
);
```

---

## Integración con labs

### Plano Inclinado
```javascript
// ANTES: Canvas2DRenderer.drawArrow() manual
this.renderer.drawArrow(origin.x, origin.y, ...);

// DESPUÉS: VectorRenderer genérico
const vectorRenderer = new VectorRenderer(canvas, constants);
vectorRenderer.drawArrow(origin.x, origin.y, ...);
vectorRenderer.drawDecomposedVector(origin, weight, ...);
```

### Cinemática 2D
```javascript
// ANTES: VectorRenderer específico del lab (código duplicado)
// DESPUÉS: Usa VectorRenderer compartido
const vectorRenderer = new VectorRenderer(canvas, constants);
vectorRenderer.drawArrow(...); // velocidad X
vectorRenderer.drawArrow(...); // velocidad Y
vectorRenderer.drawArrow(...); // aceleración
```

---

## Dependencias

- **Vector2D**: Para cálculos matemáticos (decompose, etc.)
- **Canvas2DRenderer**: Para primitivas de dibujo
- Canvas HTML5 estándar

---

## Notas de diseño

- **Sin animación**: El renderizado es instantáneo. Para animación, llama a `drawArrow()` en un loop.
- **Transformación de coordenadas**: El lab es responsable de convertir coordenadas matemáticas → píxeles antes de pasar a VectorRenderer.
- **Escalas independientes**: X e Y pueden tener escalas distintas (usar transformación en el lab).
- **Color y etiquetas**: Totalmente configurables por llamada.

---

## Ejemplo completo: Plano Inclinado

```javascript
class PlanoInclinadoPresenter {
  constructor(model, canvas, ...) {
    this.canvas = canvas;
    this.vectorRenderer = new VectorRenderer(canvas, {
      arrowHeadSize: 12,
      arrowLineWidth: 2.5,
      labelFontSize: 16
    });
  }

  render() {
    // ... setup ...

    // Origen de fuerzas (centro del bloque)
    const origin = { x: blockX, y: blockY };

    // Peso (vector vertical hacia abajo)
    const weight = new Vector2D(0, -mg);
    this.vectorRenderer.drawArrow(
      origin.x, origin.y,
      origin.x, origin.y - mg * scale,
      '#dc2626', 'P'
    );

    // Descomposición en plano inclinado
    const axisParallel = new Vector2D(Math.cos(angle), Math.sin(angle));
    const axisPerp = new Vector2D(-Math.sin(angle), Math.cos(angle));
    
    this.vectorRenderer.drawDecomposedVector(
      origin, weight, axisParallel, axisPerp, scale,
      {axis1: '#ff6600', axis2: '#00cc00'}
    );
  }
}
```
