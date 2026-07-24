/**
 * CinematicaModel — Gestión del estado de la simulación
 *
 * Responsabilidades:
 * - Mantener estado completo de la simulación
 * - Validar y actualizar parámetros
 * - Control de simulación (start, pause, reset, step)
 * - Calcular valores actuales usando CinematicaPhysics
 * - Gestionar hitos (apex, impacto) para pausas automáticas
 */

class CinematicaModel {
  constructor(constants) {
    this.constants = constants;

    // Parámetros ajustables
    this.mode = constants.INITIAL_STATE.mode;
    this.y0 = constants.INITIAL_STATE.y0;
    this.v0 = constants.INITIAL_STATE.v0;
    this.angleDeg = constants.INITIAL_STATE.angleDeg;
    this.g = constants.INITIAL_STATE.g;
    this.autoPauseMode = constants.INITIAL_STATE.autoPauseMode;

    // Estado de animación
    this.time = 0;
    this.running = false;
    this.finished = false;
    this.lastTimestamp = null;

    // Hitos pedagógicos para pausa automática
    this.pausedByMilestone = false;
    this.pausedStage = 'start'; // 'start' | 'apex' | 'midDown' | 'impact'
    this.milestoneApexDone = false;
    this.milestoneMidDownDone = false;
    this.milestoneImpactDone = false;

    // Cache de valores teóricos (se recalcula cuando cambian parámetros)
    this._theoreticalCache = null;
    this._cacheValid = false;
  }

  /**
   * ===== SETTERS: Actualizar parámetros =====
   */

  setMode(mode) {
    if (mode !== this.mode) {
      this.mode = mode;
      this._cacheValid = false;
    }
  }

  setHeight(y0) {
    y0 = Number(y0);
    const range = this.constants.SLIDER_RANGES.height;
    this.y0 = Math.max(range.min, Math.min(range.max, y0));
    this._cacheValid = false;
  }

  setSpeed(v0) {
    v0 = Number(v0);
    const range = this.constants.SLIDER_RANGES.speed;
    this.v0 = Math.max(range.min, Math.min(range.max, v0));
    this._cacheValid = false;
  }

  setAngle(angleDeg) {
    angleDeg = Number(angleDeg);
    const range = this.constants.SLIDER_RANGES.angle;
    this.angleDeg = Math.max(range.min, Math.min(range.max, angleDeg));
    this._cacheValid = false;
  }

  setGravity(g) {
    g = Number(g);
    const range = this.constants.SLIDER_RANGES.gravity;
    this.g = Math.max(range.min, Math.min(range.max, g));
    this._cacheValid = false;
  }

  setAutoPauseMode(mode) {
    this.autoPauseMode = mode; // 'on' | 'off'
  }

  /**
   * ===== CONTROL DE SIMULACIÓN =====
   */

  start() {
    if (!this.finished && !this.running) {
      this.running = true;
      this.pausedByMilestone = false;
      this.lastTimestamp = null;
    }
  }

  pause() {
    this.running = false;
  }

  reset() {
    this.time = 0;
    this.running = false;
    this.finished = false;
    this.lastTimestamp = null;
    this.pausedByMilestone = false;
    this.pausedStage = 'start';
    this.milestoneApexDone = false;
    this.milestoneMidDownDone = false;
    this.milestoneImpactDone = false;
  }

  /**
   * Avanzar la simulación un paso de tiempo
   * @param {number} deltaTime - Tiempo transcurrido en segundos
   */
  step(deltaTime) {
    if (!this.running) return;

    const maxDelta = this.constants.ANIMATION.maxDeltaPerFrame;
    deltaTime = Math.min(deltaTime, maxDelta);

    const th = this.getTheoretical();
    const prevTime = this.time;
    this.time += deltaTime;

    // Verificar si pasamos el tiempo de vuelo
    if (this.time >= th.flightTime) {
      this.time = th.flightTime;
      this.finished = true;
      this.running = false;
    }

    // Hitos pedagógicos (pausa automática)
    if (this.autoPauseMode === 'on') {
      this._checkMilestones(th, prevTime);
    }
  }

  /**
   * Verificar y manejar hitos para pausa automática
   */
  _checkMilestones(th, prevTime) {
    const threshold = this.constants.ANIMATION.apexDetectionThreshold;
    const midDownThreshold = this.constants.ANIMATION.midDownThreshold;
    const minFlightTime = this.constants.ANIMATION.minFlightTimeForMidDown;

    // Hito: Altura máxima
    if (!this.milestoneApexDone && th.apexTime > 0.05 &&
        prevTime < th.apexTime && this.time >= th.apexTime) {
      this.time = th.apexTime;
      this._pauseAtMilestone('apex');
      return;
    }

    // Hito: Mitad de la bajada
    const midDownTime = th.apexTime + Math.max(0, (th.flightTime - th.apexTime) / 2);
    if (!this.milestoneMidDownDone && th.flightTime > minFlightTime &&
        this.time >= midDownTime - midDownThreshold &&
        this.time <= midDownTime + midDownThreshold) {
      this.time = midDownTime;
      this._pauseAtMilestone('midDown');
      return;
    }

    // Hito: Impacto
    if (!this.milestoneImpactDone && prevTime < th.flightTime &&
        this.time >= th.flightTime) {
      this.time = th.flightTime;
      this._pauseAtMilestone('impact');
      return;
    }
  }

  _pauseAtMilestone(stage) {
    this.running = false;
    this.pausedByMilestone = true;
    this.pausedStage = stage;

    if (stage === 'apex') this.milestoneApexDone = true;
    else if (stage === 'midDown') this.milestoneMidDownDone = true;
    else if (stage === 'impact') this.milestoneImpactDone = true;
  }

  /**
   * ===== GETTERS: Obtener valores actuales =====
   */

  /**
   * Obtener valores teóricos (con caché)
   */
  getTheoretical() {
    if (!this._cacheValid) {
      this._theoreticalCache = CinematicaPhysics.getTheoretical(
        this.y0,
        this.v0,
        this.angleDeg,
        this.g,
        this.mode
      );
      this._cacheValid = true;
    }
    return this._theoreticalCache;
  }

  /**
   * Posición actual (x, y)
   */
  getPosition() {
    const th = this.getTheoretical();
    const x = CinematicaPhysics.xAt(this.time, th.v0x);
    const y = Math.max(0, CinematicaPhysics.yAt(this.time, this.y0, th.v0y, this.g));
    return { x, y };
  }

  /**
   * Velocidad actual (vx, vy)
   */
  getVelocity() {
    const th = this.getTheoretical();
    const vx = CinematicaPhysics.vxAt(th.v0x);
    const vy = CinematicaPhysics.vyAt(this.time, th.v0y, this.g);
    return { vx, vy };
  }

  /**
   * Módulo de velocidad actual
   */
  getSpeedModule() {
    const { vx, vy } = this.getVelocity();
    return Math.sqrt(vx * vx + vy * vy);
  }

  /**
   * ===== INFORMACIÓN DE ESTADO =====
   */

  /**
   * Obtener estado actual completo (para sincronizar UI)
   */
  getState() {
    const pos = this.getPosition();
    const vel = this.getVelocity();
    const th = this.getTheoretical();

    return {
      // Parámetros
      mode: this.mode,
      y0: this.y0,
      v0: this.v0,
      angleDeg: this.angleDeg,
      g: this.g,
      autoPauseMode: this.autoPauseMode,

      // Tiempo
      time: this.time,

      // Posición
      x: pos.x,
      y: pos.y,

      // Velocidad
      vx: vel.vx,
      vy: vel.vy,
      speedModule: this.getSpeedModule(),

      // Estado de simulación
      running: this.running,
      finished: this.finished,
      pausedByMilestone: this.pausedByMilestone,
      pausedStage: this.pausedStage,

      // Valores teóricos
      theoretical: th,
    };
  }

  /**
   * Obtener texto de descripción pedagógica según modo
   */
  getModeDescription() {
    return this.constants.TEXT.modes[this.mode] || '';
  }

  /**
   * Obtener texto pedagógico según modo
   */
  getPedagogyText() {
    return this.constants.TEXT.pedagogy[this.mode] || '';
  }

  /**
   * Obtener texto de estado
   */
  getStatusText() {
    if (this.finished) {
      return this.constants.TEXT.status.finished;
    }
    if (this.pausedByMilestone) {
      return this.constants.TEXT.status.paused;
    }
    return this.constants.TEXT.status.running;
  }
}
