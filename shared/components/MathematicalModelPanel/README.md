# MathematicalModelPanel — Panel para modelos matemáticos

Componente UI para mostrar ecuaciones, parámetros y resultados de modelos matemáticos en laboratorios.

## Uso

```html
<!-- HTML -->
<div id="modelPanel"></div>
```

```javascript
<script src="../../shared/components/MathematicalModelPanel/MathematicalModelPanel.js"></script>
<link rel="stylesheet" href="../../shared/components/MathematicalModelPanel/mathematical-model-panel.css" />

const panel = new MathematicalModelPanel(
  document.getElementById('modelPanel')
);

// Agregar ecuación
panel.addEquation('v = v₀ + at');

// Agregar parámetros actualizables
panel.setParameters({
  'v₀ (velocidad inicial)': '10 m/s',
  'a (aceleración)': '2 m/s²',
  't (tiempo)': '5 s'
});

// Actualizar valor durante simulación
panel.updateValue('t', '5.5 s');

// Agregar resultado
panel.setResult('v = 21 m/s');
```

## Métodos principales

**`addEquation(latex)`** — Muestra ecuación matemática

**`setParameters(dict)`** — Muestra dict de parámetros con valores

**`updateValue(key, value)`** — Actualiza parámetro durante simulación

**`setResult(text)`** — Muestra resultado final

**`clear()`** — Limpia el panel

## Ejemplo: Derivadas

```javascript
const panel = new MathematicalModelPanel(
  document.getElementById('derivPanel')
);

panel.addEquation('f(x) = x²');
panel.addEquation("f'(x) = 2x");

panel.setParameters({
  'x': '3',
  'h': '0.1'
});

// Cuando el usuario mueve h:
slider.onChange = (h) => {
  const fx = model.eval(x);
  const fxh = model.eval(x + h);
  const secante = (fxh - fx) / h;
  panel.updateValue('h', h.toFixed(2));
  panel.setResult(`Pendiente secante: ${secante.toFixed(2)}`);
};
```
