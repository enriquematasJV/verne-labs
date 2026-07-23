class Cinematica2DModel {
  constructor(constants) {
    this.constants = constants;
    this.state = { ...constants.INITIAL_STATE };
  }

  // ===== SETTERS =====

  setMode(mode) {
    this.state.mode = mode;
  }

  setHeight(y0) {
    this.state.y0 = Number(y0);
  }

  setSpeed(v0) {
    this.state.v0 = Number(v0);
  }

  setAngle(angleDeg) {
    this.state.angleDeg = Number(angleDeg);
  }

  setGravity(g) {
    this.state.g = -Math.abs(Number(g));
  }

  setAutoPauseMode(mode) {
    this.state.autoPauseMode = mode;
  }

  setRunning(bool) {
    this.state.running = bool;
  }

  setFinished(bool) {
    this.state.finished = bool;
  }

  // ===== GETTERS =====

  getState() {
    return { ...this.state };
  }

  getMode() {
    return this.state.mode;
  }

  getHeight() {
    return this.state.y0;
  }

  getSpeed() {
    return this.state.v0;
  }

  getAngle() {
    return this.state.angleDeg;
  }

  getGravity() {
    return this.state.g;
  }

  getTime() {
    return this.state.time;
  }

  getTrail() {
    return [...this.state.trail];
  }

  isRunning() {
    return this.state.running;
  }

  isFinished() {
    return this.state.finished;
  }

  // ===== FÍSICA: COMPONENTES INICIALES =====

  getInitialComponents() {
    if (this.state.mode === 'vertical') {
      return { v0x: 0, v0y: this.state.v0 };
    }
    if (this.state.mode === 'horizontal') {
      return { v0x: this.state.v0, v0y: 0 };
    }
    // parabolic
    const rad = this.state.angleDeg * Math.PI / 180;
    return {
      v0x: this.state.v0 * Math.cos(rad),
      v0y: this.state.v0 * Math.sin(rad)
    };
  }

  // ===== CINEMÁTICA: POSICIÓN =====

  xAt(t) {
    const { v0x } = this.getInitialComponents();
    return v0x * t;
  }

  yAt(t) {
    const { v0y } = this.getInitialComponents();
    return this.state.y0 + v0y * t + 0.5 * this.state.g * t * t;
  }

  // ===== CINEMÁTICA: VELOCIDAD =====

  vxAt() {
    return this.getInitialComponents().v0x;
  }

  vyAt(t) {
    const { v0y } = this.getInitialComponents();
    return v0y + this.state.g * t;
  }

  speedAt(t) {
    const vx = this.vxAt();
    const vy = this.vyAt(t);
    return Math.sqrt(vx * vx + vy * vy);
  }

  // ===== CÁLCULOS TEÓRICOS =====

  getTheoretical() {
    const { v0x, v0y } = this.getInitialComponents();
    const A = 0.5 * this.state.g;
    const B = v0y;
    const C = this.state.y0;
    const disc = B * B - 4 * A * C;

    let flightTime = 0;
    if (disc >= 0) {
      const sqrtDisc = Math.sqrt(disc);
      const t1 = (-B + sqrtDisc) / (2 * A);
      const t2 = (-B - sqrtDisc) / (2 * A);
      const roots = [t1, t2].filter(t => t >= 0).sort((a, b) => a - b);
      flightTime = roots.length ? roots[roots.length - 1] : 0;
    }

    let apexTime = 0;
    let maxHeight = this.state.y0;
    if (v0y > 0) {
      apexTime = -v0y / this.state.g;
      maxHeight = this.yAt(apexTime);
    }

    const range = this.xAt(flightTime);
    const impactVx = v0x;
    const impactVy = this.vyAt(flightTime);
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
      impactSpeed
    };
  }

  // ===== SIMULACIÓN =====

  updateTime(deltaMs) {
    const deltaSec = deltaMs / 1000;
    this.state.time += deltaSec;

    const th = this.getTheoretical();
    if (this.state.time >= th.flightTime) {
      this.state.time = th.flightTime;
      this.state.finished = true;
      this.state.running = false;
    }

    this._updateTrail();
  }

  _updateTrail() {
    const x = this.xAt(this.state.time);
    const y = Math.max(0, this.yAt(this.state.time));
    this.state.trail.push({ x, y });

    // Limitar trail a últimos 500 puntos
    if (this.state.trail.length > 500) {
      this.state.trail.shift();
    }
  }

  resetSimulation() {
    this.state.time = 0;
    this.state.running = false;
    this.state.finished = false;
    this.state.lastTimestamp = null;
    this.state.trail = [{ x: this.xAt(0), y: this.yAt(0) }];
    this.state.pausedStage = 'start';
    this.state.pausedByMilestone = false;
    this.state.milestoneApexDone = false;
    this.state.milestoneMidDownDone = false;
    this.state.milestoneImpactDone = false;
  }

  // ===== MILESTONES PEDAGÓGICOS =====

  checkMilestones() {
    const th = this.getTheoretical();
    const tol = this.constants.MILESTONE_TOLERANCE;
    const autoPause = this.state.autoPauseMode === 'on';

    if (!autoPause) return null;

    // Altura máxima
    if (th.apexTime > 0 &&
        Math.abs(this.state.time - th.apexTime) < tol &&
        !this.state.milestoneApexDone) {
      this.state.milestoneApexDone = true;
      if (autoPause) {
        this.state.running = false;
        this.state.pausedByMilestone = true;
      }
      return 'apex';
    }

    // Fase de bajada
    const midDownTime = th.apexTime + Math.max(0, (th.flightTime - th.apexTime) / 2);
    if (th.flightTime > 0 &&
        this.state.time >= midDownTime - tol &&
        this.state.time <= midDownTime + tol &&
        !this.state.milestoneMidDownDone &&
        th.flightTime > th.apexTime + 0.15) {
      this.state.milestoneMidDownDone = true;
      if (autoPause) {
        this.state.running = false;
        this.state.pausedByMilestone = true;
      }
      return 'midDown';
    }

    // Impacto
    if (th.flightTime > 0 &&
        Math.abs(this.state.time - th.flightTime) < tol &&
        !this.state.milestoneImpactDone) {
      this.state.milestoneImpactDone = true;
      if (autoPause) {
        this.state.running = false;
        this.state.pausedByMilestone = true;
      }
      return 'impact';
    }

    return null;
  }

  // ===== UTILIDADES =====

  clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  format(value, digits = 2) {
    return Number.isFinite(value) ? value.toFixed(digits) : '∞';
  }

  getStageDescription() {
    const th = this.getTheoretical();
    const x = this.xAt(this.state.time);
    const y = Math.max(0, this.yAt(this.state.time));
    const vx = this.vxAt();
    const vy = this.vyAt(this.state.time);
    const totalSpeed = this.speedAt(this.state.time);

    if (this.state.finished || Math.abs(this.state.time - th.flightTime) < this.constants.PHYSICS.epsilon) {
      return {
        title: 'Llegada al suelo',
        condition: 'y(t) = 0',
        equation: `${this.format(this.state.y0, 1)} + ${this.format(th.v0y, 2)}·t - ${this.format(Math.abs(0.5 * this.state.g), 2)}·t² = 0`,
        solution: `t = ${this.format(th.flightTime, 2)} s`,
        details: [
          `Alcance: x = ${this.format(th.range, 2)} m`,
          `Velocidad de impacto: |v| = ${this.format(th.impactSpeed, 2)} m/s`
        ]
      };
    }

    if (th.apexTime > 0 && Math.abs(this.state.time - th.apexTime) < 0.06) {
      return {
        title: 'Altura máxima',
        condition: 'vᵧ(t) = 0',
        equation: `vᵧ(t) = ${this.format(th.v0y, 2)} - ${this.format(Math.abs(this.state.g), 2)}·t`,
        solution: `t = ${this.format(th.apexTime, 2)} s`,
        details: [
          `Altura máxima: y = ${this.format(th.maxHeight, 2)} m`,
          `En ese instante: x = ${this.format(this.xAt(th.apexTime), 2)} m`
        ]
      };
    }

    if (th.flightTime > 0 && this.state.time >= th.apexTime + 0.06 && th.flightTime > th.apexTime + 0.15) {
      return {
        title: 'Fase de bajada',
        condition: 'vᵧ < 0',
        equation: `y(t) = ${this.format(this.state.y0, 1)} + ${this.format(th.v0y, 2)}·t - ${this.format(Math.abs(0.5 * this.state.g), 2)}·t²`,
        solution: `t = ${this.format(this.state.time, 2)} s`,
        details: [
          `Posición actual: (${this.format(x, 2)}, ${this.format(y, 2)}) m`,
          `Velocidad actual: (vₓ, vᵧ) = (${this.format(vx, 2)}, ${this.format(vy, 2)}) m/s`
        ]
      };
    }

    return {
      title: 'Fase inicial del lanzamiento',
      condition: 'Configuración inicial',
      equation: `x(t) = ${this.format(th.v0x, 2)}·t`,
      solution: `y(t) = ${this.format(this.state.y0, 1)} + ${this.format(th.v0y, 2)}·t - ${this.format(0.5 * this.state.g, 2)}·t²`,
      details: [
        `Velocidad inicial: v₀ = ${this.format(this.state.v0, 1)} m/s`,
        `Estado actual: y = ${this.format(y, 2)} m, |v| = ${this.format(totalSpeed, 2)} m/s`
      ]
    };
  }
}
