# GraphNavigator — Navegación interactiva de gráficos

Componente agnóstico que proporciona arrastrado (pan) y zoom sobre cualquier elemento gráfico (canvas o SVG) que dibuje un plano cartesiano.

## Características

- **Arrastrado**: Click y arrastra para desplazar la vista
- **Zoom**: Rueda del ratón para ampliar/reducir
- **Soporte táctil**: Pellizco (pinch) para zoom en dispositivos móviles
- **Configurable**: Controla qué ejes permiten pan/zoom, límites, velocidad

## Uso

```javascript
// Importar
<script src="../../shared/components/GraphNavigator/GraphNavigator.js"></script>

// Adjuntar a un canvas o SVG
const navigator = VerneGraphNavigator.attach(canvas, {
  getViewport: () => ({ xMin, xMax, yMin, yMax }),
  setViewport: (next) => {
    // Guardar el nuevo viewport y redibujar
    state.xMin = next.xMin;
    state.xMax = next.xMax;
    state.yMin = next.yMin;
    state.yMax = next.yMax;
    render();
  },
  margin: 52,        // píxeles de margen (ejes, etiquetas)
});

// Detener más tarde si es necesario
navigator.destroy();
```

## Opciones

```javascript
{
  getViewport: () => ({ xMin, xMax, yMin, yMax }),  // [Obligatorio] Leer estado actual
  setViewport: (next) => { /* ... */ },              // [Obligatorio] Guardar nuevo estado
  margin: 52,                                        // Píxeles de borde no interactivo
  panAxis: 'both',    // 'both' | 'x' | 'y'          // Ejes permitidos para arrastrado
  zoomAxis: 'both',   // 'both' | 'x' | 'y'          // Ejes permitidos para zoom
  minSpanX: 0.05,                                    // Límite mínimo de vista horizontal
  maxSpanX: 1e6,                                     // Límite máximo de vista horizontal
  minSpanY: 0.05,                                    // Límite mínimo de vista vertical
  maxSpanY: 1e6,                                     // Límite máximo de vista vertical
  zoomSpeed: 0.0015,                                 // Sensibilidad de zoom (rueda)
}
```

## Integración con labs

GraphNavigator no modifica el DOM. Solo llama a tus callbacks cuando el usuario interactúa:

1. **Lee el viewport** con `getViewport()`
2. **Calcula el nuevo viewport** (pan/zoom)
3. **Envía el cambio** a `setViewport()`
4. **Tú redibujas** en tu `setViewport()`

Es responsabilidad del lab mantener su propio estado de viewport y renderizar.
