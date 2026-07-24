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

    // SimulationLifecycle para control de animación
    this.lifecycle = new SimulationLifecycle(
      () => {}, // onStep callback vacío
      () => this._onReset(),
      () => this.model.canStart()
    );

    // Estado de animación
    this.animationId = null;
    this.lastTimestamp = null;

    // Inicializar
    this.setupEventListeners();
    this.setupLifecycleListeners();
    this.formulasPanel.reset();
    this.readControls();
    this.syncUI();
    this.render();
  }

  /**
   * ===== SETUP: Listeners de ciclo de simulación =====
   */
  setupLifecycleListeners() {
    this.lifecycle.on('onStart', () => {
      this.lastTimestamp = null;
      if (!this.animationId) {
        this.animationId = requestAnimationFrame((ts) => this.animate(ts));
      }
    });

    this.lifecycle.on('onResume', () => {
      this.lastTimestamp = null;
      // Limpiar flag de pausa por hito para que no se re-pause inmediatamente
      this.model.pausedByMilestone = false;
    });

    const pauseResult = this.lifecycle.on('onPause', () => {
      this.syncUI();
    });

    this.lifecycle.on('onReset', () => {
      this.syncUI();
      this.render();
    });
  }

  /**
   * ===== SETUP: Conectar eventos de entrada =====
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

    // Botones de control: delegados a SimulationLifecycle
    if (this.dom.startBtn) {
      this.dom.startBtn.addEventListener('click', () => this.lifecycle.start());
    }
    if (this.dom.pauseBtn) {
      this.dom.pauseBtn.addEventListener('click', () => {
        if (this.lifecycle.isRunning()) {
          this.lifecycle.pause();
        } else if (this.lifecycle.isPaused()) {
          this.lifecycle.resume();
        }
      });
    }
    if (this.dom.resetBtn) {
      this.dom.resetBtn.addEventListener('click', () => this.lifecycle.reset());
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


  _onReset() {
    this.model.reset();
    this.formulasPanel.reset();
  }

  /**
   * ===== ANIMACIÓN =====
   */

  /**
   * Loop de animación CONTINUO - nunca se detiene
   * Solo avanza la simulación si lifecycle.isRunning() es true
   */
  animate(timestamp) {
    if (!this.lastTimestamp) {
      this.lastTimestamp = timestamp;
    }

    const deltaTimeMs = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;

    // Si está corriendo, avanzar la simulación
    if (this.lifecycle.isRunning()) {
      this.model.step(deltaTimeMs / 1000);

      // Verificar si debe pausar por hito pedagógico
      if (this.model.pausedByMilestone && this.lifecycle.isRunning()) {
        this.lifecycle.pause();
      }

      // Verificar si la simulación terminó
      if (this.model.finished && this.lifecycle.isRunning()) {
        this.lifecycle.markFinished();
      }
    }

    // Actualizar UI y renderizar siempre
    this.syncUI();
    this.render();

    // SIEMPRE continuar el loop - es el responsable de sincronizar
    this.animationId = requestAnimationFrame((ts) => this.animate(ts));
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
      // Habilitar cuando está corriendo O pausado; deshabilitar cuando está terminado
      this.dom.pauseBtn.disabled = this.model.finished;
      // Cambiar texto del botón según estado
      if (this.lifecycle.isPaused()) {
        this.dom.pauseBtn.textContent = 'Continuar';
      } else if (this.lifecycle.isRunning()) {
        this.dom.pauseBtn.textContent = 'Pausar';
      }
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

    // Renderizar vectores (compartidos)
    const ballX = viewport.xToPx(pos.x);
    const ballY = viewport.yToPx(pos.y);

    // Componentes de velocidad (vx, vy)
    this.vectorRenderer.drawVelocityComponents(
      { x: ballX, y: ballY },
      vel,
      {
        scale: this.constants.VECTORS.velocityScale,
        clamp: this.constants.VECTORS.velocityClamp,
        colors: {
          vx: this.constants.COLORS.velocityX,
          vy: this.constants.COLORS.velocityY
        }
      }
    );

    // Aceleración (ay = -g)
    this.vectorRenderer.drawAcceleration(
      { x: ballX, y: ballY },
      this.constants.VECTORS.accelerationFixed,
      this.constants.COLORS.acceleration,
      'aᵧ = -g'
    );

    // Medidas (cuando simulación termina)
    if (this.model.finished) {
      const impactX = viewport.xToPx(th.range);
      const impactY = viewport.yToPx(0);

      // Alcance horizontal
      this.vectorRenderer.drawMeasure(
        viewport.left, impactY - 30,
        impactX, impactY - 30,
        this.constants.COLORS.velocityX,
        `alcance = ${CinematicaPhysics.format(th.range, 1)} m`
      );

      // Altura máxima
      if (th.maxHeight > this.model.y0 + 0.05) {
        this.vectorRenderer.drawMeasure(
          viewport.left - 18, viewport.yToPx(0),
          viewport.left - 18, viewport.yToPx(th.maxHeight),
          this.constants.COLORS.velocityY,
          `Hmáx = ${CinematicaPhysics.format(th.maxHeight, 1)} m`
        );
      } else if (this.model.y0 > 0) {
        this.vectorRenderer.drawMeasure(
          viewport.left - 18, viewport.yToPx(0),
          viewport.left - 18, viewport.yToPx(this.model.y0),
          this.constants.COLORS.velocityY,
          `y₀ = ${CinematicaPhysics.format(this.model.y0, 1)} m`
        );
      }
    }
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
