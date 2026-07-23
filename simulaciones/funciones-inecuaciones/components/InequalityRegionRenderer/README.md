# InequalityRegionRenderer — Dibuja regiones sombreadas de inecuaciones

Componente que encapsula la lógica de sombreado de áreas que satisfacen inecuaciones en el plano XY.

## Propósito

Extraer la lógica de dibujo de regiones sombreadas de inecuaciones en un componente modular reutilizable.

## Uso

```javascript
// Importar
<script src="./components/InequalityRegionRenderer/InequalityRegionRenderer.js"></script>

// Crear renderer
const regionRenderer = new InequalityRegionRenderer(svgElement, graphRenderer, {
  step: 4,                                    // Tamaño de píxel de muestreo
  fillColor: "rgba(37, 99, 235, 0.18)"       // Color de relleno
});

// Dibujar región
regionRenderer.drawRegion(inequalities, state);
```

## API

### Constructor
```javascript
new InequalityRegionRenderer(svgElement, graphRenderer, options)
```

**Parámetros:**
- `svgElement`: Elemento SVG donde dibujar
- `graphRenderer`: Instancia de GraphRenderer (para conversión de coordenadas)
- `options.step`: Tamaño de píxel para muestreo (default: 4)
- `options.fillColor`: Color de relleno (default: rgba(37, 99, 235, 0.18))

### Métodos

**`drawRegion(inequalities, state)`** - Dibuja píxeles sombreados donde se satisfacen todas las inecuaciones

**`satisfies(ineq, x, y)`** - Evalúa si un punto (x, y) satisface una inecuación

## Características

- ✅ Sombreado rápido usando muestreo por píxeles
- ✅ Soporta inecuaciones Y (funciones) e inecuaciones X (líneas verticales)
- ✅ Integración con GraphRenderer para conversión de coordenadas
- ✅ Modular y reutilizable

## Específico de este laboratorio

Este componente es específico del laboratorio de **funciones-inecuaciones** porque el sombreado de regiones es una característica única de este lab.

Puede moverse a `/shared/components/` si otros labs necesitan esta funcionalidad.
