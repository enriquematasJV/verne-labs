/**
 * PhysicsEngine — Motor de simulación física
 *
 * Proporciona componentes básicos para simulaciones de dinámica:
 * - Fuerzas (gravedad, fricción, fuerzas aplicadas)
 * - Integración de movimiento
 * - Colisiones (básicas)
 *
 * Nota: Creado como archivo stub. Implementación completa según laboratorios.
 */

class PhysicsEngine {
  constructor(gravity = 9.8) {
    this.gravity = gravity;
    this.objects = [];
    this.forces = [];
  }

  addObject(obj) {
    this.objects.push(obj);
  }

  addForce(force) {
    this.forces.push(force);
  }

  // Implementar según laboratorios específicos
  step(dt) {
    // Actualizar simulación
  }

  reset() {
    // Reiniciar estado
  }

  calculateInclinedPlane(mass, angleRad, mu, g = 9.8) {
    const parallel = mass * g * Math.sin(angleRad);
    const normal = mass * g * Math.cos(angleRad);
    const friction = mu * normal;
    const netForce = Math.max(0, parallel - friction);
    const acceleration = netForce / mass;
    const staticHold = acceleration < 0.001;

    return {
      parallel,
      normal,
      friction,
      netForce,
      acceleration,
      staticHold
    };
  }
}
