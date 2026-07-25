# Graph2DEngine — Motor de gráficos 2D

Motor para rendering de gráficos cartesianos 2D con ejes, grid y anotaciones.

## Características

- ✅ Múltiples tipos de gráficos en el mismo viewport
- ✅ Viewport configurable, autoscaling opcional
- ✅ Grid adaptativo y ejes
- ✅ Colores CSS configurables

## Tipos de gráficos

**`addFunctionPlot(fn, options)`** — Función explícita f(x)
```javascript
const fn = VerneMath.compile('x^2');
const id = engine.addFunctionPlot(fn, {
  samples: 200,
  color: '#3b82f6',
  lineWidth: 2
});
```

**`addParametricPlot(xFunc, yFunc, options)`** — Curva parametrizada (x(t), y(t))
```javascript
const id = engine.addParametricPlot(
  t => Math.cos(t),
  t => Math.sin(t),
  { tMin: 0, tMax: 2*Math.PI, step: 0.05, color: '#ef4444' }
);
```

**`addTimeSeriesPlot(data, options)`** — Serie temporal
```javascript
const data = [
  { time: 0, value: 10 },
  { time: 1, value: 15 }
];
const id = engine.addTimeSeriesPlot(data, {
  xKey: 'time',
  yKey: 'value',
  color: '#22c55e'
});
```

**`addMultiTimeSeriesPlot(data, options)`** — Múltiples series
```javascript
const id = engine.addMultiTimeSeriesPlot(data, {
  xKey: 'time',
  yKeys: ['presas', 'depredadores'],
  colors: ['#22c55e', '#dc2626']
});
```

**`addScatterPlot(points, options)`** — Nube de puntos

**`addDynamicTrajectory(options)`** — Trayectoria que se actualiza durante simulación
- Retorna: `trajectoryId`

**`addPointToTrajectory(trajectoryId, x, y)`** — Agregar punto a trayectoria dinámica

## Métodos principales

**Control de viewport:**
- `setViewport(xMin, xMax, yMin, yMax)` — Cambiar rango visible
- `render()` — Dibujar todos los gráficos
- `clear()` — Limpiar canvas
