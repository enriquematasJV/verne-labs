class PlanoInclinadoModel {
  constructor(physics) {
    this.physics = physics;

    // Estado del simulador (SOLO DATOS, SIN LÓGICA DE UI)
    this.angleDeg = 30;
    this.mu = 0.2;
    this.mass = 5;
    this.rampLength = 8;
    this.distance = 0;
    this.velocity = 0;
    this.time = 0;
    this.running = false;
    this.finished = false;
  }

  reset() {
    this.distance = 0;
    this.velocity = 0;
    this.time = 0;
    this.running = false;
    this.finished = false;
  }

  setAngle(degrees) {
    this.angleDeg = degrees;
    this.reset();
  }

  setFriction(mu) {
    this.mu = mu;
    this.reset();
  }

  setMass(mass) {
    this.mass = mass;
    this.reset();
  }

  setRampLength(length) {
    this.rampLength = length;
    this.reset();
  }

  getDynamics() {
    const angleRad = this.angleDeg * Math.PI / 180;
    const result = PlanoInclinadoPhysics.calculateInclinedPlane(this.mass, angleRad, this.mu);
    return { angleRad, ...result };
  }

  getTheoretical() {
    const dyn = this.getDynamics();
    return PlanoInclinadoPhysics.theoreticalInclinedPlane(dyn.acceleration, this.rampLength);
  }

  step(deltaTime) {
    if (!this.running) return;

    const dyn = this.getDynamics();
    const a = dyn.acceleration;

    this.velocity += a * deltaTime;
    this.distance += this.velocity * deltaTime + 0.5 * a * deltaTime * deltaTime;
    this.time += deltaTime;

    if (this.distance >= this.rampLength) {
      this.distance = this.rampLength;
      this.finished = true;
      this.running = false;
    }
  }

  start() {
    const dyn = this.getDynamics();
    if (dyn.staticHold || this.finished) return;
    this.running = true;
  }

  pause() {
    this.running = false;
  }

  canStart() {
    const dyn = this.getDynamics();
    return !this.running && !this.finished && !dyn.staticHold;
  }

  canPause() {
    return this.running;
  }
}
