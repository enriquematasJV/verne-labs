# Vector2D — Clase para cálculos vectoriales 2D

Clase matemática para vectores bidimensionales con operaciones aritméticas, geometría y proyecciones.

## Operaciones básicas

```javascript
<script src="../../shared/components/Vector2D/Vector2D.js"></script>

const v1 = new Vector2D(3, 4);
const v2 = new Vector2D(1, 2);

// Operaciones aritméticas
const sum = v1.add(v2);        // (4, 6)
const diff = v1.subtract(v2);  // (2, 2)
const scaled = v1.scale(2);    // (6, 8)

// Magnitud y normalización
const mag = v1.magnitude();    // 5
const unit = v1.normalize();   // (0.6, 0.8)

// Producto punto
const dot = v1.dot(v2);        // 3*1 + 4*2 = 11

// Rotación (en radianes)
const rotated = v1.rotate(Math.PI / 4);

// Descomposición en ejes
const xAxis = new Vector2D(1, 0);
const yAxis = new Vector2D(0, 1);
const decomp = v1.decompose(xAxis, yAxis);
// {parallel: Vector2D, perpendicular: Vector2D, parallelScalar: 3, ...}
```

## Métodos

**Construcción:**
- `new Vector2D(x, y)` — Constructor
- `Vector2D.from(x, y)` — Alias para constructor
- `Vector2D.zero()` — Vector cero (0, 0)
- `copy()` — Copia profunda
- `toString()` — Representación string

**Aritmética:**
- `add(other)` — Suma vectorial → Vector2D
- `subtract(other)` — Resta vectorial → Vector2D
- `scale(scalar)` — Multiplicación escalar → Vector2D
- `dot(other)` — Producto punto → number

**Magnitud:**
- `magnitude()` — Longitud del vector → number
- `normalize()` — Vector unitario → Vector2D

**Geometría:**
- `rotate(angleRad)` — Rotación en radianes → Vector2D
- `angleTo(other)` — Ángulo a otro vector → number (radianes)

**Proyecciones:**
- `projectScalar(axis)` — Componente escalar sobre eje → number
- `projectOntoAxis(axis)` — Vector proyectado → Vector2D
- `decompose(axisParallel, axisPerp)` — Retorna `{parallel, perpendicular, parallelScalar, perpendicularScalar}`

**Operaciones de conjunto (static):**
- `Vector2D.resultant(vectors)` — Suma vectorial de array → Vector2D
- `Vector2D.sum(vectors)` — Alias de resultant
- `Vector2D.average(vectors)` — Promedio vectorial → Vector2D
