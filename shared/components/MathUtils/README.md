# MathUtils — Utilidades matemáticas para simulaciones

Funciones utilitarias para simulaciones, especialmente útil para espacios toroidales y generación de aleatoriedad.

## Métodos

### Aleatoriedad
- **`random(min, max)`** — Número flotante aleatorio en `[min, max)`
- **`randomInt(min, max)`** — Entero aleatorio en `[min, max]` (inclusivo)
- **`chooseDirectionVector()`** — Vector dirección 2D aleatorio `{dx, dy}` con magnitud 1

### Límites y rango
- **`clamp(value, min, max)`** — Limita `value` al rango `[min, max]`
- **`wrap(value, size)`** — Envoltura toroidal: devuelve `value` módulo `size` (funciona para cualquier distancia)

### Geometría toroidal
- **`toroidalDelta(delta, size)`** — Calcula la distancia más corta en un espacio toroidal de `size`
  - ⚠️ **Limitación**: Solo funciona correctamente si `|delta| ≤ size`. Para deltas mayores, usa `wrap()` en los valores originales.

### Distancia
- **`distance(x1, y1, x2, y2)`** — Distancia euclidiana 2D

## Ejemplos

```javascript
// Aleatoriedad
const x = MathUtils.random(0, 100);           // 42.5
const steps = MathUtils.randomInt(1, 10);    // 7
const dir = MathUtils.chooseDirectionVector(); // {dx: 0.8, dy: 0.6}

// Límites
const clamped = MathUtils.clamp(150, 0, 100); // 100

// Toroidal
const wrappedX = MathUtils.wrap(105, 100);    // 5
const wrappedNeg = MathUtils.wrap(-15, 100);  // 85
const delta = MathUtils.toroidalDelta(5, 100); // 5 (distancia más corta)
```

## Historial

Inicialmente designado como componente general de matemáticas, fue especializado para las necesidades de `ecologia-poblaciones`, enfocándose en aleatoriedad y geometría toroidal.
