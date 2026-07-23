class PlanoInclinadoModel {
  constructor() {
    // Parámetros del sistema
    this.angleDeg = 30;
    this.mu = 0.2;
    this.mass = 5;
    this.rampLength = 8;

    // Estado público (para UI)
    this.distance = 0;
    this.velocity = 0;
    this.time = 0;
    this.finished = false;

    // Solucionador ODE Runge-Kutta 4to orden
    // Ecuación diferencial: dv/dt = a(v, t)
    this.odeSolver = new OdeSolverRK4(
      (t, v) => this.getAcceleration(),
      0
    );

    // Kinemática para posición
    this.kinematics = new KinematicsEngine();
  }

  reset() {
    this.distance = 0;
    this.velocity = 0;
    this.time = 0;
    this.finished = false;
    this.odeSolver.reset(0, 0);
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

  getAcceleration() {
    const dyn = this.getDynamics();
    return dyn.acceleration;
  }

  step(deltaTime) {
    // Integración: OdeSolverRK4 calcula nuevo valor de velocidad
    this.velocity = this.odeSolver.step(deltaTime);

    // Cinemática: calcula nueva posición usando KinematicsEngine
    const a = this.getAcceleration();
    this.distance = this.kinematics.position1D(
      this.distance,
      this.velocity,
      a,
      deltaTime
    );

    this.time += deltaTime;

    // Detección de fin de rampa
    if (this.distance >= this.rampLength) {
      this.distance = this.rampLength;
      this.finished = true;
    }
  }

  canStart() {
    const dyn = this.getDynamics();
    return !this.finished && !dyn.staticHold;
  }
}
