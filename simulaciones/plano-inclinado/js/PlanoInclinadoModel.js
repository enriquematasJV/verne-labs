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
    const g = 9.8;

    // Peso: vector vertical hacia abajo
    const weight = new Vector2D(0, this.mass * g);

    // Ejes de referencia: paralelo y perpendicular a la rampa
    const axisParallel = new Vector2D(Math.cos(angleRad), Math.sin(angleRad));
    const axisPerp = new Vector2D(-Math.sin(angleRad), Math.cos(angleRad));

    // Descomponer peso
    const decomp = weight.decompose(axisParallel, axisPerp);
    const parallel = decomp.parallelScalar;
    const perpendicular = decomp.perpendicularScalar;

    // Cálculos de fuerzas
    const normal = Math.abs(perpendicular);
    const friction = this.mu * normal;
    const netForce = Math.max(0, parallel - friction);
    const acceleration = netForce / this.mass;
    const staticHold = acceleration < 0.001;

    return {
      angleRad,
      parallel,
      normal,
      friction,
      netForce,
      acceleration,
      staticHold
    };
  }

  getTheoretical() {
    const dyn = this.getDynamics();
    if (dyn.acceleration < 0.001) {
      return { time: Infinity, velocity: 0 };
    }
    const time = Math.sqrt(2 * this.rampLength / dyn.acceleration);
    const velocity = dyn.acceleration * time;
    return { time, velocity };
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
