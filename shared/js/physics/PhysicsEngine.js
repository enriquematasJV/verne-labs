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

  step(dt) {
    // Implementar según laboratorios específicos
  }

  reset() {
    // Reiniciar estado
  }
}
