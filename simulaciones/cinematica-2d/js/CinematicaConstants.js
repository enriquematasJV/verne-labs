/**
 * CinematicaConstants — Configuración centralizada del laboratorio
 *
 * Contiene todos los valores hardcodeados:
 * - Parámetros iniciales de la simulación
 * - Constantes físicas
 * - Colores y estilos
 * - Dimensiones de canvas y layout
 * - Parámetros de renderizado
 * - Configuración de animación
 */

const CinematicaConstants = {
  // ===== PARÁMETROS INICIALES =====
  INITIAL_STATE: {
    mode: 'parabolic',     // 'vertical' | 'horizontal' | 'parabolic'
    y0: 0,                 // Altura inicial en metros
    v0: 25,                // Velocidad inicial en m/s
    angleDeg: 45,          // Ángulo en grados
    g: 9.8,                // Aceleración de gravedad m/s²
    autoPauseMode: 'on',   // 'on' | 'off'
  },

  // ===== RANGOS DE SLIDERS =====
  SLIDER_RANGES: {
    height: { min: 0, max: 200, step: 1 },
    speed: { min: 1, max: 60, step: 1 },
    angle: { min: 0, max: 90, step: 1 },
    gravity: { min: 0.1, max: 20, step: 0.1 },
  },

  // ===== PRESETS DE ESCENARIOS =====
  PRESETS: {
    vertical: { y0: 0, v0: 30, angleDeg: 90, g: 9.8, mode: 'vertical' },
    horizontal: { y0: 20, v0: 30, angleDeg: 0, g: 9.8, mode: 'horizontal' },
    parabolico: { y0: 0, v0: 25, angleDeg: 45, g: 9.8, mode: 'parabolic' },
    libre: { y0: 50, v0: 20, angleDeg: 30, g: 9.8, mode: 'parabolic' },
  },

  // ===== CANVAS Y LAYOUT =====
  CANVAS: {
    width: 950,
    height: 580,
    background: {
      gradientTop: '#e0f2fe',
      gradientBottom: '#f8fafc',
      groundColor: '#cbd5e1',
    },
  },

  LAYOUT: {
    left: 70,
    rightOffset: 50,
    topOffset: 50,
    bottomOffset: 70,
    tickDivisionsX: 8,
    tickDivisionsY: 6,
    dataBoxWidth: 250,
    dataBoxHeight: 132,
    stageBoxWidth: 420,
    stageBoxHeight: 146,
  },

  // ===== COLORES =====
  COLORS: {
    trajectory: '#7c3aed',      // Trayectoria teórica
    ball: '#f59e0b',            // Pelota
    ballStroke: '#92400e',      // Contorno pelota
    apex: '#7c3aed',            // Punto de altura máxima
    impact: '#16a34a',          // Punto de impacto
    velocityX: '#2563eb',       // Vector vₓ
    velocityY: '#dc2626',       // Vector vᵧ
    acceleration: '#16a34a',    // Vector aᵧ = -g
    axis: '#0f172a',            // Ejes
    grid: '#cbd5e1',            // Grid
    text: '#0f172a',            // Texto principal
    textMuted: '#475569',       // Texto secundario
    boxBackground: 'rgba(255,255,255,0.95)',
    boxBorder: '#cbd5e1',
    canvas: {
      background: {
        gradientTop: '#e0f2fe',     // Sky gradient top
        gradientBottom: '#f8fafc',  // Sky gradient bottom
        groundColor: '#cbd5e1',     // Ground color
      },
    },
  },

  // ===== ESTILOS DE LÍNEA =====
  RENDERING: {
    lineWidth: 3,               // Líneas principales
    axisLineWidth: 3,
    gridLineWidth: 1,
    vectorLineWidth: 3,
    arrowHeadSize: 10,          // Tamaño punta de flecha
    ballRadius: 10,             // Radio esfera
    pointRadius: 6,             // Puntos notables (apex, etc)
    pointRadiusImpact: 7,
    dataBoxRadius: 18,          // Border radius cajas
    fontSize: {
      title: 'bold 16px Arial',
      normal: '14px Arial',
      small: '12px Arial',
      bold: 'bold 14px Arial',
    },
  },

  // ===== VECTORES Y ESCALAS =====
  VECTORS: {
    velocityScale: 2.8,         // Escala de visualización vₓ, vᵧ
    velocityClamp: 90,          // Clamp máximo de vectores
    accelerationFixed: 64,      // Alto fijo para aᵧ
  },

  // ===== ANIMACIÓN =====
  ANIMATION: {
    maxDeltaPerFrame: 0.035,    // segundos máx por frame
    apexDetectionThreshold: 0.06, // Distancia para detectar apex
    midDownThreshold: 0.06,     // Distancia para detectar mitad bajada
    minFlightTimeForMidDown: 0.15, // Tiempo mínimo vuelo para mid-down
  },

  // ===== PRECISIÓN NUMÉRICA =====
  PRECISION: {
    formatDefault: 2,           // Decimales por defecto
    formatPosition: 1,          // Decimales posición
    epsilon: 1e-6,              // Tolerancia para comparaciones
  },

  // ===== TEXTOS (i18n ready) =====
  TEXT: {
    modes: {
      vertical: 'El eje X no interviene. En vertical, la velocidad cambia por efecto de la gravedad hasta anularse en la altura máxima y luego invierte el sentido.',
      horizontal: 'El movimiento horizontal es uniforme, mientras que el vertical es una caída libre. Ambos se combinan para formar una parábola.',
      parabolic: 'El tiro parabólico se estudia separando el eje X y el eje Y. En X no hay aceleración; en Y actúa la gravedad.',
    },
    pedagogy: {
      vertical: 'En el punto más alto se cumple vᵧ = 0. Después, la pelota cae con aceleración constante negativa: aᵧ = -g.',
      horizontal: 'El movimiento horizontal mantiene signo positivo constante, mientras que verticalmente actúa una aceleración negativa: aᵧ = -g.',
      parabolic: 'En el eje X el movimiento suele tomarse positivo hacia la derecha. En el eje Y, subir es positivo y la gravedad introduce aceleración negativa.',
    },
    status: {
      running: 'La animación representará la trayectoria hasta que la pelota llegue al suelo.',
      paused: 'Pausa automática en un punto clave del movimiento para observar condiciones y cálculos.',
      finished: 'La simulación se ha detenido en el instante de impacto con el suelo.',
    },
    stages: {
      launch: 'Fase inicial del lanzamiento',
      apex: 'Altura máxima',
      midDown: 'Fase de bajada',
      impact: 'Llegada al suelo',
    },
  },
};
