/**
 * CinematicaPresenter — Orquestación de la simulación sin MVP
 *
 * Responsabilidades:
 * - Inicializar todos los módulos (Model, Renderers, FormulasPanel)
 * - Conectar eventos de entrada (sliders, selects, botones)
 * - Loop de animación
 * - Sincronizar UI con estado del Model
 * - Control de simulación (start, pause, reset)
 *
 * Sin View separada: manipula DOM directamente
 * Usa CinematicaModel para estado, Physics para cálculos, Renderers para visualización
 */

class CinematicaPresenter {
  constructor(constants, dom) {
    this.constants = constants;
    this.dom = dom;

    // Inicializar módulos
    this.model = new CinematicaModel(constants);
    this.sceneRenderer = new SceneRenderer(dom.canvas, constants);
    this.vectorRenderer = new VectorRenderer(dom.canvas, constants);
    this.formulasPanel = new FormulasPanel(dom);

    // Estado de animación
    this.animationId = null;

    // Inicializar
    this.setupEventListeners();
    this.formulasPanel.reset();
    this.readControls();
    this.syncUI();
    this.render();
  }

  /**
   * ===== SETUP: Conectar eventos =====
   */

  setupEventListeners() {
    // Preset: cambiar escenario predefinido (determina automáticamente el tipo de disparo)
    if (this.dom.presetSelect) {
      this.dom.presetSelect.addEventListener('change', () => this.onPresetChanged());
    }

    // Altura inicial
    if (this.dom.heightInput) {
      this.dom.heightInput.addEventListener('input', () => {
        this.model.setHeight(this.dom.heightInput.value);
        this.syncUI();
        this.render();
      });
    }

    // Velocidad inicial
    if (this.dom.speedInput) {
      this.dom.speedInput.addEventListener('input', () => {
        this.model.setSpeed(this.dom.speedInput.value);
        this.syncUI();
        this.render();
      });
    }

    // Ángulo
    if (this.dom.angleInput) {
      this.dom.angleInput.addEventListener('input', () => {
        this.model.setAngle(this.dom.angleInput.value);
        this.syncUI();
        this.render();
      });
    }

    // Gravedad
    if (this.dom.gravityInput) {
      this.dom.gravityInput.addEventListener('input', () => {
        this.model.setGravity(this.dom.gravityInput.value);
        this.syncUI();
        this.render();
      });
    }

    // Auto-pause mode
    if (this.dom.autoPauseModeSelect) {
      this.dom.autoPauseModeSelect.addEventListener('change', () => {
        this.model.setAutoPauseMode(this.dom.autoPauseModeSelect.value);
      });
    }

    // Botones de control
    if (this.dom.startBtn) {
      this.dom.startBtn.addEventListener('click', () => this.onStart());
    }
    if (this.dom.pauseBtn) {
      this.dom.pauseBtn.addEventListener('click', () => this.onPause());
    }
    if (this.dom.resetBtn) {
      this.dom.resetBtn.addEventListener('click', () => this.onReset());
    }

    // Resize del canvas
    window.addEventListener('resize', () => {
      this.render();
    });
  }

  /**
   * ===== EVENT HANDLERS =====
   */

  onPresetChanged() {
    const presetKey = this.dom.presetSelect.value;
    const preset = this.constants.PRESETS[presetKey];

    if (preset) {
      this.model.setMode(preset.mode);
      this.model.setHeight(preset.y0);
      this.model.setSpeed(preset.v0);
      this.model.setAngle(preset.angleDeg);
      this.model.setGravity(preset.g);

      this.syncUI();
      this.render();
    }
  }


  onStart() {
    this.model.start();
    this.animate(performance.now());
    this.syncUI();
  }

  onPause() {
    this.model.pause();
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.syncUI();
  }

  onReset() {
    this.model.reset();
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.formulasPanel.reset();
    this.syncUI();
    this.render();
  }

  /**
   * ===== ANIMACIÓN =====
   */

  /**
   * Loop de animación
   */
  animate(timestamp) {
    if (!this.model.running) {
      this.animationId = null;
      return;
    }

    if (this.model.lastTimestamp === null) {
      this.model.lastTimestamp = timestamp;
    }

    const deltaTime = (timestamp - this.model.lastTimestamp) / 1000;
    this.model.lastTimestamp = timestamp;

    // Avanzar simulación
    this.model.step(deltaTime);

    // Actualizar UI
    this.syncUI();
    this.render();

    // Continuar animación si está corriendo
    if (this.model.running) {
      this.animationId = requestAnimationFrame((ts) => this.animate(ts));
    } else {
      this.animationId = null;
    }
  }

  /**
   * ===== SINCRONIZACIÓN DE UI =====
   */

  /**
   * Sincronizar UI con estado actual del Model
   */
  syncUI() {
    // Actualizar sliders y etiquetas con valores del modelo (NO releer inputs)
    if (this.dom.heightInput) {
      this.dom.heightInput.value = this.model.y0;
      if (this.dom.heightValue) {
        this.dom.heightValue.textContent = this.model.y0.toFixed(1);
      }
    }

    if (this.dom.speedInput) {
      this.dom.speedInput.value = this.model.v0;
      if (this.dom.speedValue) {
        this.dom.speedValue.textContent = this.model.v0.toFixed(1);
      }
    }

    if (this.dom.angleInput) {
      this.dom.angleInput.value = this.model.angleDeg;
      if (this.dom.angleValue) {
        this.dom.angleValue.textContent = this.model.angleDeg.toString();
      }
    }

    if (this.dom.gravityInput) {
      this.dom.gravityInput.value = this.model.g;
      if (this.dom.gravityValue) {
        this.dom.gravityValue.textContent = this.model.g.toFixed(1);
      }
    }

    // Actualizar estado de botones
    if (this.dom.startBtn) {
      this.dom.startBtn.disabled = this.model.running || this.model.finished;
    }
    if (this.dom.pauseBtn) {
      this.dom.pauseBtn.disabled = !this.model.running;
    }

    // Actualizar fórmulas y valores
    this.formulasPanel.updateAll(this.model);
    this.formulasPanel.updateTheoreticalValues(this.model);
    this.formulasPanel.updateInstantaneousValues(this.model);
    this.formulasPanel.updatePedagogicalText(this.model);
    this.formulasPanel.updateStatusText(this.model);
  }

  /**
   * Leer valores actuales de los inputs
   */
  readControls() {
    if (this.dom.heightInput) {
      this.model.setHeight(Number(this.dom.heightInput.value));
    }

    if (this.dom.speedInput) {
      this.model.setSpeed(Number(this.dom.speedInput.value));
    }

    if (this.dom.angleInput) {
      this.model.setAngle(Number(this.dom.angleInput.value));
    }

    if (this.dom.gravityInput) {
      this.model.setGravity(Number(this.dom.gravityInput.value));
    }

    if (this.dom.autoPauseModeSelect) {
      this.model.setAutoPauseMode(this.dom.autoPauseModeSelect.value);
    }
  }

  /**
   * ===== RENDERIZADO =====
   */

  /**
   * Renderizar escena completa
   */
  render() {
    const pos = this.model.getPosition();
    const vel = this.model.getVelocity();
    const th = this.model.getTheoretical();

    // Calcular viewport
    const viewport = this._calculateViewport(th, pos);

    // Renderizar escena
    this.sceneRenderer.render(this.model);

    // Renderizar vectores
    this.vectorRenderer.drawVectors(this.model, pos, vel, viewport);
    this.vectorRenderer.drawMeasures(this.model, pos, th, viewport);
  }

  /**
   * Calcular viewport dinámico (replica de SceneRenderer)
   */
  _calculateViewport(th, pos) {
    const maxX = Math.max(15, th.range, pos.x) + 8;
    const maxY = Math.max(10, th.maxHeight, this.model.y0, pos.y) + 6;

    const w = this.dom.canvas.width;
    const h = this.dom.canvas.height;
    const left = this.constants.LAYOUT.left;
    const right = w - this.constants.LAYOUT.rightOffset;
    const bottom = h - this.constants.LAYOUT.bottomOffset;
    const top = this.constants.LAYOUT.topOffset;

    const scaleX = (right - left) / maxX;
    const scaleY = (bottom - top) / maxY;
    const scale = Math.min(scaleX, scaleY);

    return {
      maxX, maxY,
      left, right, bottom, top,
      scaleX, scaleY, scale,
      xToPx: x => left + x * scale,
      yToPx: y => bottom - y * scale,
    };
  }
}
