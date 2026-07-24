const DerivadaConstants = {
  // Colores
  COLORS: {
    function: '#2563eb',        // Azul: función f(x)
    tangent: '#059669',          // Verde: recta tangente aproximada
    secant: '#dc2626',           // Rojo: recta secante
    triangle: '#ea580c',         // Naranja: triángulo Δx, Δy
    triangleText: '#7c3aed',    // Púrpura: etiqueta Δy
    point: '#111827',            // Negro: puntos P y Q
    boxBg: 'rgba(255,255,255,0.9)',
    boxStroke: '#e5e7eb',
    textDark: '#1f2937',
    textLight: '#6b7280'
  },

  // Renderizado del gráfico
  RENDERING: {
    lineWidth: 2.6,              // Ancho línea función
    lineWidthSecant: 2.2,        // Ancho línea secante/tangente
    lineWidthTriangle: 2,        // Ancho línea triángulo
    lineWidthDeltaX: 2.4,        // Ancho línea Δx en triángulo
    margin: 10,                  // Margen en pixels (reducido para máximo espacio de gráfica)
    samples: 900,                // Muestras para dibujar función
    pointRadius: 5.5,            // Radio puntos P, Q
    pointLabelOffsetX: 8,        // Offset X de etiqueta de punto
    pointLabelOffsetY: -12,      // Offset Y de etiqueta de punto
    pointLabelOffsetYSecant: 14, // Offset Y de etiqueta punto Q (secante)
    dashPattern: [8, 7],         // Patrón línea punteada
    triDashOn: false,            // Triángulo sin puntos
    triFillColor: 'rgba(234, 88, 12, 0.12)', // Color relleno triángulo
    deltaXLabelOffsetY: 7,       // Offset Y etiqueta Δx (offset negativo)
    deltaYLabelOffsetX: 13,      // Offset X etiqueta Δy (antes de rotación)
    triBoxRadius: 14,            // Radio esquinas caja anotaciones
    triBoxPadding: 18,           // Padding caja anotaciones
    annotationBoxLineWidth: 1,   // Ancho línea caja anotaciones
    annotationBoxX: 18,          // Pos X caja anotaciones
    annotationBoxY: 18,          // Pos Y caja anotaciones
    annotationBoxWidth: 355,     // Ancho caja anotaciones
    annotationBoxHeight: 108,    // Alto caja anotaciones
    annotationTextX: 36,         // Pos X texto dentro de caja
    annotationTextY1: 36,        // Pos Y primera línea (pendiente secante)
    annotationTextY2: 62,        // Pos Y segunda línea (derivada)
    annotationTextY3: 88,        // Pos Y tercera línea (aproximación)
    annotationFontSize: '13px',
    annotationFont: '13px system-ui',
    labelFontSize: '14px',
    labelFont: '14px system-ui'
  },

  // Animación h → 0
  ANIMATION: {
    decayFactor: 0.94,           // Factor multiplicativo por frame
    thresholdStop: 0.01,         // Si |h| < 0.01, detener
    minH: 0.001                  // Valor mínimo de h después de animar
  },

  // Viewport inicial
  VIEWPORT_INITIAL: {
    xMin: -6,
    xMax: 6,
    yMin: -6,
    yMax: 6,
    zoomDefault: 6,
    originDefault: 0
  },

  // Rangos de sliders
  SLIDER_RANGE: {
    zoom: { min: 2, max: 30, step: 0.1 },
    origin: { min: -20, max: 20, step: 0.1 },
    h: { min: -3, max: 3, step: 0.001 },
    xPoint: { step: 0.1 }
  },

  // ViewScale (select dropdown)
  VIEW_SCALE_OPTIONS: [
    { value: 4 },
    { value: 6 },
    { value: 10 },
    { value: 15 },
    { value: 25 }
  ],

  // Presets de función
  FUNCTION_PRESETS: [
    { label: 'x²', expr: 'x^2' },
    { label: 'sin(x)', expr: 'sin(x)' },
    { label: 'cos(x)', expr: 'cos(x)' },
    { label: 'x³ - 2x', expr: 'x^3 - 2*x' },
    { label: 'exp(0.4x)', expr: 'exp(0.4*x)' }
  ],

  // Tolerancias numéricas
  TOLERANCES: {
    eps: 1e-5,                   // Delta para derivada aproximada
    infinityThreshold: 1e6,      // Considerar "infinito" si |y| > esto
    finiteThreshold: 10000       // Threshold para clipping en canvas
  },

  // Textos (i18n ready)
  TEXT: {
    errorDefault: 'No se ha podido interpretar la función.',
    annotationSecant: 'm secante = Δy / Δx = ',
    annotationTangent: 'm tangente aprox. = ',
    annotationApproach: 'Cuando h se acerca a 0, Q se acerca a P',
    deltaX: 'Δx = h',
    deltaY: 'Δy = f(x+h) - f(x)',
    pointP: 'P = (x, f(x))',
    pointQ: 'Q = (x+h, f(x+h))',
    metricLabel: {
      x: 'x',
      xh: 'x + h',
      fx: 'f(x)',
      fxh: 'f(x+h)',
      dx: 'Δx = h',
      dy: 'Δy',
      m: 'm secante',
      tangent: 'm tangente aprox.'
    }
  },

  // Formato números
  NUMBER_FORMAT: {
    exponentialThreshold: 10000,
    smallThreshold: 0.0001,
    decimalPlaces: 4
  }
};
