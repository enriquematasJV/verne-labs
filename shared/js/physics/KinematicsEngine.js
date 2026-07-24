/**
 * KinematicsEngine — Motor de cinemática 1D
 *
 * Proporciona cálculos de cinemática para movimiento rectilíneo:
 * - Posición bajo aceleración constante
 * - Integración de velocidad y distancia
 */

class KinematicsEngine {
  /**
   * Calcula la nueva posición usando cinemática: x = x0 + v*t + 0.5*a*t²
   * @param {number} initialDistance - Posición inicial (metros)
   * @param {number} velocity - Velocidad actual (m/s)
   * @param {number} acceleration - Aceleración (m/s²)
   * @param {number} deltaTime - Intervalo de tiempo (segundos)
   * @returns {number} Nueva posición (metros)
   */
  position1D(initialDistance, velocity, acceleration, deltaTime) {
    // x = x0 + v*t + 0.5*a*t²
    return initialDistance + velocity * deltaTime + 0.5 * acceleration * deltaTime * deltaTime;
  }
}
