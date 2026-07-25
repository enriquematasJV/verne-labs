# Vector2D — Clase para cálculos vectoriales 2D

Clase matemática para vectores bidimensionales con operaciones:
- Suma, resta, multiplicación escalar
- Producto punto, magnitud, normalización
- Rotación, proyección
- Representación en coordenadas polares

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
// {parallel: (3, 0), perpendicular: (0, 4), ...}
```

## Métodos completos

**Construcción:**
- `new Vector2D(x, y)` — Constructor
- `Vector2D.from(x, y)` — Alias para constructor
- `Vector2D.zero()` — Vector cero (0, 0)
- `copy()` — Copia profunda

**Aritmética:**
- `add(other)` — Suma vectorial
- `subtract(other)` — Resta vectorial
- `scale(scalar)` — Multiplicación escalar
- `dot(other)` — Producto punto

**Norma:**
- `magnitude()` — Longitud del vector
- `normalize()` — Vector unitario en misma dirección
- `distance(other)` — Distancia euclidiana a otro vector

**Geometría:**
- `rotate(angleRad)` — Rotación en radianes
- `angleTo(other)` — Ángulo hacia otro vector
- `projectScalar(axis)` — Componente en dirección de eje
- `projectOntoAxis(axis)` — Vector proyectado sobre eje
- `decompose(axisParallel, axisPerp)` — Descomposición en dos ejes
