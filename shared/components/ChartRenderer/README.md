# ChartRenderer — Renderizador de gráficos simples en Canvas2D

Componente para renderizar gráficos de líneas (series temporales, datos acumulativos) en Canvas2D.

## Uso

```javascript
<script src="../../shared/components/ChartRenderer/ChartRenderer.js"></script>
<link rel="stylesheet" href="../../shared/components/ChartRenderer/chart-renderer.css" />

const chartRenderer = new ChartRenderer(canvasElement);
chartRenderer.drawLineChart(data, {
  xKey: 'time',
  yKeys: ['value1', 'value2'],
  colors: ['#3b82f6', '#ef4444'],
  margin: { left: 48, right: 18, top: 16, bottom: 34 }
});
```

## Métodos principales

**`drawLineChart(data, options)`** - Dibuja gráfico de líneas a partir de datos

**Parámetros:**
- `data`: Array de objetos `{time: number, value1: number, ...}`
- `options.xKey`: Campo para eje X (default: `'x'`)
- `options.yKeys`: Array de campos para serie(s) Y (default: `['y']`)
- `options.colors`: Array de colores hex (default: `['#3b82f6']`)
- `options.margin`: Margen alrededor del gráfico
- `options.backgroundColor`: Color de fondo (default: `'white'`)
- `options.gridColor`: Color de grid (default: `'#e2e8f0'`)
- `options.axisColor`: Color de ejes (default: `'#94a3b8'`)
- `options.scaleY`: Factor de escala vertical (default: `1`)

## HTML requerido

El canvas debe llevar el atributo `data-chart-renderer` para que los estilos se apliquen:

```html
<canvas data-chart-renderer></canvas>
```

## Ejemplo: Ecología de Poblaciones

```javascript
const data = [
  { time: 0, presas: 100, depredadores: 20 },
  { time: 1, presas: 110, depredadores: 22 },
  { time: 2, presas: 105, depredadores: 25 }
];

chartRenderer.drawLineChart(data, {
  xKey: 'time',
  yKeys: ['presas', 'depredadores'],
  colors: ['#16a34a', '#dc2626'],
  margin: { left: 48, right: 18, top: 16, bottom: 34 }
});
```
