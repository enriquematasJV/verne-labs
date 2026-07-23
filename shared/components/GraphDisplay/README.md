# GraphDisplay — Componente de gráficos reutilizable

Componente que proporciona **estilos comunes para CUALQUIER gráfico** (canvas o SVG) en todos los laboratorios.

## Propósito

Garantizar que todos los gráficos tengan:
- Misma apariencia visual base
- Mismos estilos para elementos (líneas, texto, etc.)
- Mismo comportamiento de interacción (cursor, touch-action)
- Consistencia visual en toda la plataforma

## Uso

```html
<!-- Para Canvas -->
<div class="graph-display">
  <canvas id="graph"></canvas>
</div>

<!-- Para SVG -->
<div class="graph-display">
  <svg id="graph"></svg>
</div>
```

```css
@import "../../shared/components/GraphDisplay/graph-display.css";
```

## Estilos comunes proporcionados

- **Contenedor**: background blanco, border, border-radius, padding
- **Canvas/SVG**: width 100%, cursor grab/grabbing, touch-action none
- **Líneas SVG**: stroke-width 0.5 (fino y consistente)
- **Texto SVG**: font-size 12px, system-ui font family
- **Canvas rendering**: crisp-edges para pixelado limpio

## Ventajas

✅ Todos los gráficos se ven igual sin importar dónde estén  
✅ No hay que redefiniir estilos en cada laboratorio  
✅ Cambios globales a gráficos se aplican automáticamente  
✅ Componente agnóstico (canvas o SVG)  
