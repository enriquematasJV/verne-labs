# Canvas2DRenderer — Renderizador 2D para canvas

Clase utilitaria para facilitar el dibujo en canvas HTML5 con métodos para:
- Limpiar canvas
- Dibujar rectángulos, polígonos, líneas, círculos, arcos
- Renderizar texto
- Aplicar transformaciones
- Manejo de clip regions

## Uso

```javascript
<script src="../../shared/components/Canvas2DRenderer/Canvas2DRenderer.js"></script>

const renderer = new Canvas2DRenderer(canvasElement);
renderer.clear('#ffffff');
renderer.drawRect(10, 10, 100, 50, '#ff0000', '#000000', 2);
renderer.drawCircle(50, 50, 30, '#00ff00');
renderer.drawLine(0, 0, 100, 100, '#0000ff', 3);
renderer.drawText('Hola', 10, 20, '14px Arial', '#000000');
```

## Métodos principales

- `clear(color)` - Llenar canvas de color
- `drawRect(x, y, w, h, fillColor, strokeColor, lineWidth)`
- `drawPolygon(points, fillColor, strokeColor, lineWidth)`
- `drawLine(x1, y1, x2, y2, color, lineWidth)`
- `drawCircle(x, y, radius, fillColor, strokeColor, lineWidth)`
- `drawArc(x, y, radius, startAngle, endAngle, fillColor, strokeColor, lineWidth)`
- `drawText(text, x, y, font, fillColor, textAlign, textBaseline)`
- `save()` / `restore()` - Guardar/restaurar estado
- `translate(x, y)`, `rotate(angle)`, `scale(sx, sy)` - Transformaciones
- `setClipRect(x, y, w, h)` - Establecer región de recorte
