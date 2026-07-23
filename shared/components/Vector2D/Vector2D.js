class Vector2D {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  static from(x, y) {
    return new Vector2D(x, y);
  }

  static zero() {
    return new Vector2D(0, 0);
  }

  add(other) {
    return new Vector2D(this.x + other.x, this.y + other.y);
  }

  subtract(other) {
    return new Vector2D(this.x - other.x, this.y - other.y);
  }

  scale(scalar) {
    return new Vector2D(this.x * scalar, this.y * scalar);
  }

  dot(other) {
    return this.x * other.x + this.y * other.y;
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    const mag = this.magnitude();
    if (mag === 0) return new Vector2D(0, 0);
    return new Vector2D(this.x / mag, this.y / mag);
  }

  angleTo(other) {
    return Math.atan2(other.y - this.y, other.x - this.x);
  }

  rotate(angleRad) {
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);
    return new Vector2D(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos
    );
  }

  copy() {
    return new Vector2D(this.x, this.y);
  }

  toString() {
    return `Vector2D(${this.x.toFixed(2)}, ${this.y.toFixed(2)})`;
  }

  // Proyecta este vector sobre un eje (devuelve componente escalar)
  projectScalar(axis) {
    const normalized = axis.normalize();
    return this.dot(normalized);
  }

  // Proyecta este vector sobre un eje (devuelve vector proyectado)
  projectOntoAxis(axis) {
    const normalized = axis.normalize();
    const scalar = this.dot(normalized);
    return normalized.scale(scalar);
  }

  // Descompone este vector en componentes paralela y perpendicular a un eje
  decompose(axisParallel, axisPerp) {
    return {
      parallel: this.projectOntoAxis(axisParallel),
      perpendicular: this.projectOntoAxis(axisPerp),
      parallelScalar: this.projectScalar(axisParallel),
      perpendicularScalar: this.projectScalar(axisPerp)
    };
  }

  // Calcula la resultante de múltiples vectores
  static resultant(vectors) {
    if (vectors.length === 0) return Vector2D.zero();
    return vectors.reduce((sum, v) => sum.add(v), Vector2D.zero());
  }

  // Suma múltiples vectores
  static sum(vectors) {
    return Vector2D.resultant(vectors);
  }

  // Promedio de múltiples vectores
  static average(vectors) {
    if (vectors.length === 0) return Vector2D.zero();
    return Vector2D.resultant(vectors).scale(1 / vectors.length);
  }
}
