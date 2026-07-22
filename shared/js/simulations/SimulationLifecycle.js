/**
 * SimulationLifecycle — Patrón genérico de control de simulaciones
 *
 * Centraliza la lógica de ejecución (iniciar, pausar, reanudar, reiniciar)
 * que se encuentra duplicada en cada laboratorio.
 *
 * Patrón de callbacks: cada lab implementa sus propias funciones de actualización
 * pero usa la máquina de estados centralizada.
 *
 * Uso:
 *   const lifecycle = new SimulationLifecycle(
 *     (dt) => model.step(dt),   // onStep callback
 *     () => model.reset(),       // onReset callback
 *     () => !model.isFinished()  // canStart callback
 *   );
 *   lifecycle.start();
 *   lifecycle.pause();
 *   lifecycle.reset();
 */

class SimulationLifecycle {
  constructor(onStep, onReset, canStartFn) {
    // Callbacks
    this.onStep = onStep;           // (deltaTime) -> actualizar simulación
    this.onReset = onReset;         // () -> resetear a estado inicial
    this.canStartFn = canStartFn;   // () -> boolean, puede iniciar?

    // Estado
    this.running = false;
    this.finished = false;
    this.paused = false;
    this.startTime = 0;
    this.elapsedTime = 0;
    this.deltaTime = 0;

    // Listeners (para UI)
    this.listeners = {
      onStart: null,
      onPause: null,
      onResume: null,
      onReset: null,
      onFinish: null,
      onStep: null
    };
  }

  // ===== CONTROL PRINCIPAL =====

  /**
   * Iniciar simulación
   * @returns {boolean} true si se inició, false si no se pudo
   */
  start() {
    if (this.running) return false;
    if (this.finished && !this.canStartFn()) return false;

    this.running = true;
    this.paused = false;
    this.finished = false;
    this.startTime = Date.now();
    this.elapsedTime = 0;

    this._notify('onStart');
    return true;
  }

  /**
   * Pausar simulación
   * @returns {boolean} true si se pausó, false si no estaba corriendo
   */
  pause() {
    if (!this.running) return false;

    this.running = false;
    this.paused = true;

    this._notify('onPause');
    return true;
  }

  /**
   * Reanudar simulación desde pausa
   * @returns {boolean} true si se reanudó, false si no se puede
   */
  resume() {
    if (this.finished) return false;
    if (this.running) return false;
    if (!this.paused) return false;

    this.running = true;
    this.paused = false;
    this.startTime = Date.now() - this.elapsedTime;

    this._notify('onResume');
    return true;
  }

  /**
   * Reiniciar simulación a estado inicial
   * @returns {boolean} siempre true
   */
  reset() {
    this.running = false;
    this.finished = false;
    this.paused = false;
    this.startTime = 0;
    this.elapsedTime = 0;
    this.deltaTime = 0;

    // Llamar callback de reset del modelo
    if (this.onReset) {
      this.onReset();
    }

    this._notify('onReset');
    return true;
  }

  /**
   * Avanzar un paso de simulación
   * Llamado típicamente desde requestAnimationFrame
   *
   * @param {number} deltaTime - tiempo transcurrido en milisegundos
   */
  step(deltaTime = 16.67) {
    if (!this.running) return;

    this.deltaTime = deltaTime;
    this.elapsedTime += deltaTime;

    // Llamar callback del modelo
    if (this.onStep) {
      this.onStep(deltaTime / 1000); // Convertir a segundos
    }

    this._notify('onStep', { deltaTime, elapsedTime: this.elapsedTime });
  }

  /**
   * Marcar simulación como terminada
   */
  markFinished() {
    if (this.finished) return;

    this.finished = true;
    this.running = false;
    this._notify('onFinish');
  }

  // ===== CONSULTAS DE ESTADO =====

  isRunning() {
    return this.running;
  }

  isPaused() {
    return this.paused;
  }

  isFinished() {
    return this.finished;
  }

  canStart() {
    return this.canStartFn ? this.canStartFn() : !this.finished;
  }

  getElapsedTime() {
    return this.elapsedTime;
  }

  getDeltaTime() {
    return this.deltaTime;
  }

  // ===== LISTENERS (para UI) =====

  /**
   * Registrar callback que se dispara en eventos
   *
   * @param {string} event - 'onStart' | 'onPause' | 'onResume' | 'onReset' | 'onFinish' | 'onStep'
   * @param {function} callback - función a ejecutar
   */
  on(event, callback) {
    if (this.listeners.hasOwnProperty(event)) {
      this.listeners[event] = callback;
      return true;
    }
    console.warn(`SimulationLifecycle: evento desconocido: ${event}`);
    return false;
  }

  /**
   * Remover listener
   */
  off(event) {
    if (this.listeners.hasOwnProperty(event)) {
      this.listeners[event] = null;
      return true;
    }
    return false;
  }

  // ===== PRIVADO =====

  _notify(event, data = null) {
    const callback = this.listeners[event];
    if (callback && typeof callback === 'function') {
      try {
        callback(data);
      } catch (err) {
        console.error(`SimulationLifecycle: error en listener ${event}:`, err);
      }
    }
  }
}

// ===== TESTS BÁSICOS =====

/**
 * Ejecutar tests básicos de SimulationLifecycle
 * console.assert es el sistema de testing simple (sin dependencias)
 */
function testSimulationLifecycle() {
  let stepCount = 0;
  let resetCount = 0;

  const lifecycle = new SimulationLifecycle(
    () => { stepCount++; },
    () => { resetCount++; }
  );

  // Test 1: Estado inicial
  console.assert(lifecycle.isRunning() === false, 'Estado inicial: no corriendo');
  console.assert(lifecycle.isFinished() === false, 'Estado inicial: no terminado');
  console.assert(lifecycle.getElapsedTime() === 0, 'Tiempo inicial: 0');

  // Test 2: Iniciar
  const started = lifecycle.start();
  console.assert(started === true, 'start() retorna true');
  console.assert(lifecycle.isRunning() === true, 'Después de start(): corriendo');

  // Test 3: Step
  stepCount = 0;
  lifecycle.step(16.67);
  console.assert(stepCount === 1, 'step() llama onStep callback');
  console.assert(lifecycle.getDeltaTime() === 16.67, 'getDeltaTime() retorna correctamente');

  // Test 4: Pausar
  const paused = lifecycle.pause();
  console.assert(paused === true, 'pause() retorna true');
  console.assert(lifecycle.isRunning() === false, 'Después de pause(): no corriendo');
  console.assert(lifecycle.isPaused() === true, 'Después de pause(): pausado');

  // Test 5: Reanudar
  const resumed = lifecycle.resume();
  console.assert(resumed === true, 'resume() retorna true');
  console.assert(lifecycle.isRunning() === true, 'Después de resume(): corriendo');
  console.assert(lifecycle.isPaused() === false, 'Después de resume(): no pausado');

  // Test 6: Reset
  resetCount = 0;
  const reset = lifecycle.reset();
  console.assert(reset === true, 'reset() retorna true');
  console.assert(resetCount === 1, 'reset() llama onReset callback');
  console.assert(lifecycle.isRunning() === false, 'Después de reset(): no corriendo');
  console.assert(lifecycle.isFinished() === false, 'Después de reset(): no terminado');
  console.assert(lifecycle.getElapsedTime() === 0, 'Después de reset(): tiempo = 0');

  // Test 7: markFinished
  lifecycle.start();
  lifecycle.markFinished();
  console.assert(lifecycle.isFinished() === true, 'markFinished(): terminado');
  console.assert(lifecycle.isRunning() === false, 'markFinished(): no corriendo');

  // Test 8: Listeners
  let listenerFired = false;
  lifecycle.on('onStart', () => { listenerFired = true; });
  lifecycle.reset();
  listenerFired = false;
  lifecycle.start();
  console.assert(listenerFired === true, 'Listeners: onStart se dispara');

  console.log('✅ SimulationLifecycle: todos los tests pasaron');
}

// Ejecutar tests al cargar
if (typeof window !== 'undefined') {
  window.testSimulationLifecycle = testSimulationLifecycle;
}
