# MathematicalModelPanel — Panel dinámico para valores de fórmulas

Componente UI que vincula elementos HTML (con ecuaciones, fórmulas) a valores calculados dinámicamente.

## Uso

```html
<!-- HTML: define elementos con IDs para cada fórmula -->
<div id="formulasPanel">
  <div>Energía: <span id="energy">0.0</span> J</div>
  <div>Velocidad: <span id="velocity">0.0</span> m/s</div>
</div>
```

```javascript
<script src="../../shared/components/MathematicalModelPanel/MathematicalModelPanel.js"></script>

const panel = new MathematicalModelPanel({
  container: document.getElementById('formulasPanel'),
  formulas: [
    { id: 'energy', digits: 2 },
    { id: 'velocity', digits: 1 }
  ],
  calculator: (state) => ({
    energy: state.mass * state.velocity ** 2 / 2,
    velocity: state.velocity
  })
});

// Actualizar valores cuando el modelo cambia
panel.update({ mass: 2, velocity: 10 });
```

## Constructor

```javascript
new MathematicalModelPanel(config)
```

**config:**
- `container` — Elemento contenedor (opcional)
- `formulas` — Array de `{id, digits}` donde:
  - `id`: atributo HTML `id` del elemento que mostrará el valor
  - `digits`: decimales de precisión (default: 2)
- `calculator` — Función `(state) → {key: value, ...}`
- `model` — Modelo (opcional, para referencia)

## Métodos principales

**`update(state)`** — Calcula nuevos valores y actualiza elementos HTML

**`setCalculator(fn)`** — Reemplaza función calculadora

**`setFormulas(array)`** — Define nuevas fórmulas y cachea elementos

**`format(value, digits)`** — Formatea número (interno, pero disponible)

## Ejemplo: Cinemática

```javascript
const panel = new MathematicalModelPanel({
  formulas: [
    { id: 'posicion', digits: 2 },
    { id: 'velocidad', digits: 2 },
    { id: 'aceleracion', digits: 2 }
  ],
  calculator: (state) => ({
    posicion: state.x0 + state.v0 * state.t + 0.5 * state.a * state.t ** 2,
    velocidad: state.v0 + state.a * state.t,
    aceleracion: state.a
  })
});

// Cuando tiempo cambia:
for (let t = 0; t <= 5; t += 0.1) {
  panel.update({ x0: 0, v0: 10, a: -2, t });
}
```
