/**
 * CinematicaPhysics — Fórmulas matemáticas de cinemática 2D
 *
 * Encapsula toda la lógica física sin estado.
 * Recibe parámetros y retorna resultados de cálculos.
 *
 * Responsable de:
 * - Conversiones de ángulos
 * - Descomposición de velocidad inicial
 * - Ecuaciones de movimiento (posición, velocidad)
 * - Cálculos teóricos (tiempos notables, alcance, etc)
 */

class CinematicaPhysics {
  /**
   * Convertir ángulo en grados a radianes
   */
  static getAngleRad(angleDeg) {
    return angleDeg * Math.PI / 180;
  }

  /**
   * Obtener componentes iniciales de velocidad según modo
   */
  static getInitialComponents(mode, v0, angleDeg) {
    if (mode === 'vertical') {
      return { v0x: 0, v0y: v0 };
    }
    if (mode === 'horizontal') {
      return { v0x: v0, v0y: 0 };
    }
    // modo 'parabolic'
    const rad = this.getAngleRad(angleDeg);
    return {
      v0x: v0 * Math.cos(rad),
      v0y: v0 * Math.sin(rad),
    };
  }

  /**
   * Posición horizontal en función del tiempo
   * x(t) = v0x · t
   */
  static xAt(t, v0x) {
    return v0x * t;
  }

  /**
   * Posición vertical en función del tiempo
   * y(t) = y0 + v0y·t + 0.5·g·t²
   * Nota: g es negativo (aceleración hacia abajo)
   */
  static yAt(t, y0, v0y, g) {
    return y0 + v0y * t + 0.5 * g * t * t;
  }

  /**
   * Velocidad horizontal (constante en x)
   * vx(t) = v0x
   */
  static vxAt(v0x) {
    return v0x;
  }

  /**
   * Velocidad vertical en función del tiempo
   * vy(t) = v0y + g·t
   * Nota: g es negativo
   */
  static vyAt(t, v0y, g) {
    return v0y + g * t;
  }

  /**
   * Calcular todos los valores teóricos de la trayectoria
   * Retorna: tiempos notables, altura máxima, alcance, velocidad de impacto
   */
  static getTheoretical(y0, v0, angleDeg, g, mode) {
    const { v0x, v0y } = this.getInitialComponents(mode, v0, angleDeg);

    // Tiempo de vuelo: resolver y(t) = 0
    // 0 = y0 + v0y·t + 0.5·g·t²
    // 0.5·g·t² + v0y·t + y0 = 0
    const A = 0.5 * g;
    const B = v0y;
    const C = y0;
    const disc = B * B - 4 * A * C;
    let flightTime = 0;

    if (disc >= 0) {
      const sqrtDisc = Math.sqrt(disc);
      const t1 = (-B + sqrtDisc) / (2 * A);
      const t2 = (-B - sqrtDisc) / (2 * A);
      // Tomar la raíz positiva mayor
      const roots = [t1, t2].filter(t => t >= 0).sort((a, b) => a - b);
      flightTime = roots.length ? roots[roots.length - 1] : 0;
    }

    // Tiempo de altura máxima (si existe)
    // vy(t) = 0 => v0y + g·t = 0 => t = -v0y / g
    let apexTime = 0;
    let maxHeight = y0;
    if (v0y > 0) {
      apexTime = -v0y / g;
      maxHeight = this.yAt(apexTime, y0, v0y, g);
    }

    // Alcance horizontal en tiempo de vuelo
    const range = this.xAt(flightTime, v0x);

    // Velocidades en impacto
    const impactVx = v0x;
    const impactVy = this.vyAt(flightTime, v0y, g);
    const impactSpeed = Math.sqrt(impactVx * impactVx + impactVy * impactVy);

    return {
      v0x,
      v0y,
      flightTime,
      apexTime,
      maxHeight,
      range,
      impactVx,
      impactVy,
      impactSpeed,
    };
  }

  /**
   * Utilidades auxiliares
   */

  /**
   * Clamp: limitar un valor entre min y max
   */
  static clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  /**
   * Formatear número con decimales
   */
  static format(value, digits = 2) {
    return Number.isFinite(value) ? value.toFixed(digits) : '∞';
  }

  /**
   * Calcular siguiente escala "linda" para grid
   * Ej: si rawStep=2.3, retorna 2; si es 7.8, retorna 10
   */
  static niceTick(rawStep) {
    const power = Math.pow(10, Math.floor(Math.log10(rawStep || 1)));
    const norm = rawStep / power;
    if (norm < 1.5) return 1 * power;
    if (norm < 3) return 2 * power;
    if (norm < 7) return 5 * power;
    return 10 * power;
  }
}
