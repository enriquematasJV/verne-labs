const Cinematica2DConstants = {
  // Presets de escenarios
  PRESETS: {
    vertical: {
      mode: 'vertical',
      y0: 0,
      v0: 28,
      angle: 90,
      g: 9.8
    },
    horizontal: {
      mode: 'horizontal',
      y0: 20,
      v0: 18,
      angle: 0,
      g: 9.8
    },
    parabolico: {
      mode: 'parabolic',
      y0: 0,
      v0: 25,
      angle: 45,
      g: 9.8
    },
    libre: {
      mode: 'parabolic',
      y0: 0,
      v0: 25,
      angle: 45,
      g: 9.8
    }
  },

  // Valores iniciales
  INITIAL_STATE: {
    mode: 'parabolic',
    y0: 0,
    v0: 25,
    angleDeg: 45,
    g: 9.8,
    time: 0,
    running: false,
    finished: false,
    lastTimestamp: null,
    animationId: null,
    trail: [],
    autoPauseMode: 'on',
    pausedStage: 'start',
    pausedByMilestone: false,
    milestoneApexDone: false,
    milestoneMidDownDone: false,
    milestoneImpactDone: false
  },

  // Rangos de controles
  CONTROL_RANGES: {
    height: { min: 0, max: 200, step: 1 },
    speed: { min: 0, max: 500, step: 1 },
    angle: { min: 0, max: 90, step: 1 },
    gravity: { min: 1, max: 20, step: 0.1 }
  },

  // Canvas
  CANVAS: {
    width: 950,
    height: 580,
    margin: 40
  },

  // Colores
  COLORS: {
    ball: '#ef4444',        // Rojo: pelota
    trajectory: '#3b82f6',  // Azul: trayectoria
    impact: '#f59e0b',      // Ámbar: punto impacto
    grid: '#e5e7eb',
    text: '#1f2937',
    velocity: '#10b981'     // Verde: vector velocidad
  },

  // Renderizado
  RENDERING: {
    ballRadius: 6,
    trailWidth: 2,
    vectorScale: 20,
    gridSize: 50,
    lineWidth: 2
  },

  // Físicas
  PHYSICS: {
    defaultG: 9.8,
    groundLevel: 0,
    epsilon: 1e-6,
    maxTime: 100
  },

  // Tolerancias para milestones
  MILESTONE_TOLERANCE: 0.06,

  // Animación
  ANIMATION: {
    frameRate: 60,
    speedMultiplier: 1  // 1x es tiempo real
  },

  // Textos
  TEXT: {
    stage_launch: 'Fase inicial del lanzamiento',
    stage_apex: 'Altura máxima',
    stage_descent: 'Fase de bajada',
    stage_impact: 'Llegada al suelo',

    label_time: 'Tiempo actual',
    label_position: 'Posición (x, y)',
    label_velocity: 'Velocidad (vₓ, vᵧ)',
    label_speed: 'Módulo de v',
    label_flightTime: 'Tiempo total de vuelo',
    label_maxHeight: 'Altura máxima',
    label_apexTime: 'Instante de altura máxima',
    label_range: 'Alcance horizontal',
    label_impact: 'Velocidad de impacto',

    config_preset: 'Escenario base',
    config_mode: 'Tipo de disparo',
    config_height: 'Altura inicial y₀',
    config_speed: 'Velocidad inicial v₀',
    config_angle: 'Ángulo de lanzamiento',
    config_gravity: 'Aceleración gravitatoria aᵧ',
    config_autopause: 'Pausas automáticas'
  },

  // Formatos
  FORMAT: {
    decimal: 2,
    angle: 0,
    time: 2
  },

  // Pedagogía
  PEDAGOGY: {
    enabled: true,
    detailBoxes: true,
    showEquations: true,
    showMilestones: true
  }
};
