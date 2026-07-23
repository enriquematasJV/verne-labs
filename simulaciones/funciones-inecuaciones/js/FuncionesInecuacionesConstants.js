/**
 * FuncionesInecuacionesConstants — Configuración centralizada del laboratorio
 */
const FuncionesInecuacionesConstants = {
  // Tamaño de paso para muestreo de regiones sombreadas
  STEP: 4,

  // Viewport inicial del gráfico
  GRAPH_INITIAL_VIEWPORT: {
    xMin: -10,
    xMax: 10,
    yMin: -10,
    yMax: 10,
  },

  // Configuración del renderizado de gráficas
  GRAPH_RENDERING: {
    lineWidth: 2,
    showGrid: true,
    showAxes: true,
  },

  // Configuración del sombreado de regiones
  REGION_SHADING: {
    fillColor: "rgba(37, 99, 235, 0.18)",
  },

  // Textos de interfaz (i18n)
  TEXT: {
    ERROR_PREFIX: "Errores en",
    ERROR_LINES_SUFFIX: "línea(s)",
    CORRECT_SUFFIX: "correcta(s)",
  },

  // Rangos del slider de zoom
  SLIDER_RANGE: {
    min: 2,
    max: 30,
    step: 1,
    initial: 10,
  },
};
