# Graph2DEngine — Motor de gráficos 2D

Motor para rendering de gráficos cartesianos 2D con ejes, grid y anotaciones.

## Características

- ✅ Múltiples tipos de gráficos en el mismo viewport
- ✅ Pan/zoom interactivo
- ✅ Autoscaling en X e Y
- ✅ Grid adaptativo
- ✅ Colores CSS configurables

## Tipos de gráficos

**`addFunctionPlot(fn, options)`** — Función explícita f(x)
```javascript
const fn = VerneMath.compile('x^2');
engine.addFunctionPlot(fn, {
  samples: 200,
  color: '#3b82f6',
  lineWidth: 2
});
```

**`addParametricPlot(xFunc, yFunc, options)`** — Curva parametrizada (x(t), y(t))
```javascript
engine.addParametricPlot(
  t => Math.cos(t),
  t => Math.sin(t),
  { tMin: 0, tMax: 2*Math.PI, step: 0.05, color: '#ef4444' }
);
```

**`addTimeSeriesPlot(data, options)`** — Serie temporal
```javascript
const data = [
  { time: 0, value: 10 },
  { time: 1, value: 15 },
  { time: 2, value: 12 }
];
engine.addTimeSeriesPlot(data, {
  xKey: 'time',
  yKey: 'value',
  color: '#22c55e'
});
```

**`addMultiTimeSeriesPlot(data, options)`** — Múltiples series en un gráfico
```javascript
engine.addMultiTimeSeriesPlot(data, {
  xKey: 'time',
  yKeys: ['presas', 'depredadores'],
  colors: ['#22c55e', '#dc2626']
});
```

**`addScatterPlot(points, options)`** — Nube de puntos

**`addPolylinePlot(points, options)`** — Polilínea

## Métodos principales

**Control de viewport:**
- `setViewport(xMin, xMax, yMin, yMax)` — Cambiar rango visible
- `setAutoScale(enabled)` — Activar/desactivar autoscaling

**Interacción:**
- Pan/zoom capturados automáticamente con eventos del mouse

**Renderizado:**
- `render()` — Dibujar todos los gráficos
- `clear()` — Limpiar canvas
