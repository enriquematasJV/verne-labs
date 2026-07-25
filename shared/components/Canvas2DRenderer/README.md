# Canvas2DRenderer — Renderizador 2D para canvas

Clase utilitaria para facilitar el dibujo en canvas HTML5 con métodos para:
- Limpiar canvas
- Dibujar formas (rectángulos, polígonos, líneas, círculos, arcos, flechas)
- Renderizar texto
- Acceder al contexto canvas nativo para operaciones avanzadas

## Uso

```javascript
<script src="../../shared/components/Canvas2DRenderer/Canvas2DRenderer.js"></script>

const renderer = new Canvas2DRenderer(canvasElement);
renderer.clear('#ffffff');
renderer.drawRect(10, 10, 100, 50, '#ff0000', '#000000', 2);
renderer.drawCircle(50, 50, 30, '#00ff00');
renderer.drawLine(0, 0, 100, 100, '#0000ff', 3);
renderer.drawText('Hola', 10, 20, 14, 'normal', '#000000', 'left');
renderer.drawArrow(10, 10, 100, 100, '#ff0000', 'F');
```

## Métodos principales

- `clear(color)` - Llenar canvas de color
- `drawRect(x, y, width, height, fillColor, strokeColor, lineWidth)`
- `drawPolygon(points, fillColor, strokeColor, lineWidth)`
- `drawLine(x1, y1, x2, y2, color, lineWidth)`
- `drawCircle(x, y, radius, fillColor, strokeColor, lineWidth)`
- `drawArc(x, y, radius, startAngle, endAngle, strokeColor, lineWidth)` — Solo contorno
- `drawArrow(x1, y1, x2, y2, color, label, lineWidth)` — Flecha con etiqueta opcional
- `drawPath(points, strokeColor, lineWidth, closed)` — Polilínea
- `drawText(text, x, y, fontSize, fontWeight, color, textAlign)` — Renderizar texto
- `getContext()` — Acceso directo al contexto 2D para operaciones personalizadas
- `getWidth()` / `getHeight()` — Dimensiones del canvas
