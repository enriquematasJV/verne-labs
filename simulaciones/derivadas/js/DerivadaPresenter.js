class DerivadaPresenter {
  constructor(model, canvas, dom, graphRenderer, constants) {
    this.model = model;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.dom = dom;
    this.graphRenderer = graphRenderer;
    this.constants = constants;

    // Estado de animación
    this.animationId = null;
    this.animating = false;

    // Inicializar tamaño de canvas
    this._resizeBackingCanvas();

    // Conectar eventos
    this.setupEventListeners();

    // Renderizar inicial
    this.render();
  }

  setupEventListeners() {
    // Entrada de función
    this.dom.functionInput.addEventListener('input', () => {
      try {
        this.model.setFunctionExpr(this.dom.functionInput.value);
        this.dom.errorBox.style.display = 'none';
        this.render();
      } catch (error) {
        this.dom.errorBox.textContent = error.message || this.constants.TEXT.errorDefault;
        this.dom.errorBox.style.display = 'block';
      }
    });

    // Punto x
    this.dom.xPoint.addEventListener('input', () => {
      this.model.setXPoint(this.dom.xPoint.value);
      this.render();
    });

    // Slider h
    this.dom.hSlider.addEventListener('input', () => {
      this.pauseAnimation();
      this.model.setH(this.dom.hSlider.value);
      this.render();
    });

    // Select escala inicial
    this.dom.viewScale.addEventListener('change', () => {
      this.model.setManualView(false);
      this.dom.zoomSlider.value = this.dom.viewScale.value;
      this.model.setViewRange(this.dom.viewScale.value);
      this.render();
    });

    // Slider zoom
    this.dom.zoomSlider.addEventListener('input', () => {
      this.model.setManualView(false);
      this.model.setViewRange(this.dom.zoomSlider.value);
      this.render();
    });

    // Slider origen
    this.dom.originSlider.addEventListener('input', () => {
      this.model.setManualView(false);
      this.model.setOrigin(this.dom.originSlider.value);
      this.render();
    });

    // Botones de animación
    this.dom.towardsZeroBtn.addEventListener('click', () => this.animateTowardsZero());
    this.dom.pauseBtn.addEventListener('click', () => this.pauseAnimation());
    this.dom.resetBtn.addEventListener('click', () => this.reset());

    // Presets de función
    document.querySelectorAll('[data-fn]').forEach(button => {
      button.addEventListener('click', () => {
        this.pauseAnimation();
        this.dom.functionInput.value = button.dataset.fn;
        this.model.setFunctionExpr(button.dataset.fn);
        this.dom.errorBox.style.display = 'none';
        this.render();
      });
    });

    // VerneGraphNavigator para pan/zoom
    if (window.VerneGraphNavigator) {
      try {
        const margin = this.constants.RENDERING.margin;
        VerneGraphNavigator.attach(this.canvas, {
          margin: margin,
          getViewport: () => this.model.getViewport(),
          setViewport: (next) => {
            this.model.setManualView(true);
            this.model.setViewport(next.xMin, next.xMax, next.yMin, next.yMax);
            this.syncSlidersFromView();
            this.render();
          },
          minSpanX: 0.2,
          maxSpanX: 400,
          minSpanY: 0.2,
          maxSpanY: 400
        });
      } catch (e) {
        console.error('Error inicializando VerneGraphNavigator:', e);
      }
    }

    // Resize
    window.addEventListener('resize', () => {
      this._resizeBackingCanvas();
      this.render();
    });
  }

  render() {
    try {
      // Actualizar tamaño canvas desde el DOM
      this.model.setCanvasSize(this.canvas.offsetWidth, this.canvas.offsetHeight);

      // Autofit Y
      this.model.autoFitY();

      // Actualizar viewport del graphRenderer
      const vp = this.model.getViewport();
      this.graphRenderer.setViewport(vp.xMin, vp.xMax, vp.yMin, vp.yMax);

      // Dibujar grid y ejes
      this.graphRenderer.drawGridAndAxes();

      // Dibujar función
      this._drawFunction();

      // Calcular valores y dibujar anotaciones
      const x = this.model.getXPoint();
      let h = this.model.getH();

      // Evitar h = 0
      if (Math.abs(h) < 0.001) {
        h = h >= 0 ? 0.001 : -0.001;
        this.model.setH(h);
      }

      const fx = this.model.safeEval(x);
      const fxh = this.model.safeEval(x + h);

      if (Number.isFinite(fx) && Number.isFinite(fxh)) {
        const dy = fxh - fx;
        const secantSlope = dy / h;
        const tangentSlope = this.model.derivativeApprox(x);

        this._drawAnnotations(x, fx, h, fxh, secantSlope, tangentSlope);
      }

      // Actualizar UI
      this._updateMetrics(x, fx, h, fxh);
      this._updateSliders(h);

    } catch (error) {
      console.error('Error en render:', error);
    }
  }

  // ===== DIBUJO =====

  _drawFunction() {
    const c = this.constants;
    const ctx = this.ctx;
    const m = c.RENDERING.margin;

    ctx.save();
    ctx.beginPath();
    ctx.rect(m, m, this.canvas.width - 2 * m, this.canvas.height - 2 * m);
    ctx.clip();

    ctx.strokeStyle = c.COLORS.function;
    ctx.lineWidth = c.RENDERING.lineWidth;
    ctx.beginPath();

    let drawing = false;
    const samples = c.RENDERING.samples;
    for (let i = 0; i <= samples; i++) {
      const px = m + i / samples * (this.canvas.width - 2 * m);
      const x = this.model.toMathX(px);
      const y = this.model.safeEval(x);
      const py = this.model.toScreenY(y);

      const visible = Number.isFinite(y) && py > -c.TOLERANCES.finiteThreshold && py < c.TOLERANCES.finiteThreshold;
      if (!visible) {
        drawing = false;
        continue;
      }

      if (!drawing) {
        ctx.moveTo(px, py);
        drawing = true;
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();
    ctx.restore();
  }

  _drawLineThroughPoint(x, y, slope, color, dashed = false) {
    if (!Number.isFinite(slope)) return;

    const xA = this.model.xMin;
    const xB = this.model.xMax;
    const yA = y + slope * (xA - x);
    const yB = y + slope * (xB - x);

    const c = this.constants;
    const ctx = this.ctx;
    const m = c.RENDERING.margin;

    ctx.save();
    ctx.beginPath();
    ctx.rect(m, m, this.canvas.width - 2 * m, this.canvas.height - 2 * m);
    ctx.clip();
    ctx.strokeStyle = color;
    ctx.lineWidth = c.RENDERING.lineWidthSecant;
    if (dashed) ctx.setLineDash(c.RENDERING.dashPattern);
    ctx.beginPath();
    ctx.moveTo(this.model.toScreenX(xA), this.model.toScreenY(yA));
    ctx.lineTo(this.model.toScreenX(xB), this.model.toScreenY(yB));
    ctx.stroke();
    ctx.restore();
  }

  _drawPoint(x, y, color, label, dx = 8, dy = -12) {
    const ctx = this.ctx;
    const px = this.model.toScreenX(x);
    const py = this.model.toScreenY(y);

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(px, py, this.constants.RENDERING.pointRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = this.constants.RENDERING.annotationFont;
    ctx.fillStyle = color;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, px + dx, py + dy);
  }

  _drawTriangle(x, fx, xh, fxh) {
    const c = this.constants;
    const ctx = this.ctx;
    const m = c.RENDERING.margin;

    const px1 = this.model.toScreenX(x);
    const py1 = this.model.toScreenY(fx);
    const px2 = this.model.toScreenX(xh);
    const py2 = this.model.toScreenY(fxh);
    const pyHorizontal = py1;

    ctx.save();
    ctx.beginPath();
    ctx.rect(m, m, this.canvas.width - 2 * m, this.canvas.height - 2 * m);
    ctx.clip();

    ctx.fillStyle = 'rgba(234, 88, 12, 0.12)';
    ctx.strokeStyle = c.COLORS.triangle;
    ctx.lineWidth = c.RENDERING.lineWidthTriangle;
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.moveTo(px1, py1);
    ctx.lineTo(px2, pyHorizontal);
    ctx.lineTo(px2, py2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Línea Δx horizontal
    ctx.strokeStyle = c.COLORS.triangle;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(px1, py1);
    ctx.lineTo(px2, pyHorizontal);
    ctx.stroke();

    // Línea Δy vertical
    ctx.strokeStyle = c.COLORS.triangleText;
    ctx.beginPath();
    ctx.moveTo(px2, pyHorizontal);
    ctx.lineTo(px2, py2);
    ctx.stroke();

    // Etiqueta Δx
    ctx.font = c.RENDERING.annotationFont;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = c.COLORS.triangle;
    ctx.fillText(c.TEXT.deltaX, (px1 + px2) / 2, pyHorizontal - 7);

    // Etiqueta Δy
    ctx.save();
    ctx.translate(px2 + 13, (pyHorizontal + py2) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = c.COLORS.triangleText;
    ctx.fillText(c.TEXT.deltaY, 0, 0);
    ctx.restore();

    ctx.restore();
  }

  _drawAnnotations(x, fx, h, fxh, secantSlope, tangentSlope) {
    const xh = x + h;
    const c = this.constants;

    this._drawLineThroughPoint(x, fx, tangentSlope, c.COLORS.tangent, true);
    this._drawLineThroughPoint(x, fx, secantSlope, c.COLORS.secant, false);
    this._drawTriangle(x, fx, xh, fxh);

    this._drawPoint(x, fx, c.COLORS.point, c.TEXT.pointP);
    this._drawPoint(xh, fxh, c.COLORS.secant, c.TEXT.pointQ, 8, 14);

    // Caja de anotaciones
    const ctx = this.ctx;
    ctx.fillStyle = c.COLORS.boxBg;
    ctx.strokeStyle = c.COLORS.boxStroke;
    ctx.lineWidth = 1;
    this._roundRect(18, 18, 355, 108, c.RENDERING.triBoxRadius);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = c.COLORS.textDark;
    ctx.font = c.RENDERING.labelFont;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(
      c.TEXT.annotationSecant + this.model.formatNumber(secantSlope),
      36, 36
    );

    ctx.fillStyle = c.COLORS.tangent;
    ctx.fillText(
      c.TEXT.annotationTangent + this.model.formatNumber(tangentSlope),
      36, 62
    );

    ctx.fillStyle = c.COLORS.textLight;
    ctx.fillText(c.TEXT.annotationApproach, 36, 88);
  }

  _roundRect(x, y, w, h, r) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // ===== ACTUALIZACIONES UI =====

  _updateMetrics(x, fx, h, fxh) {
    const dy = fxh - fx;
    const secantSlope = dy / h;
    const tangentSlope = this.model.derivativeApprox(x);

    this.dom.metricX.textContent = this.model.formatNumber(x);
    this.dom.metricXH.textContent = this.model.formatNumber(x + h);
    this.dom.metricFX.textContent = this.model.formatNumber(fx);
    this.dom.metricFXH.textContent = this.model.formatNumber(fxh);
    this.dom.metricDX.textContent = this.model.formatNumber(h);
    this.dom.metricDY.textContent = this.model.formatNumber(dy);
    this.dom.metricM.textContent = this.model.formatNumber(secantSlope);
    this.dom.metricTangent.textContent = this.model.formatNumber(tangentSlope);
  }

  _updateSliders(h) {
    this.dom.hValue.textContent = this.model.formatNumber(h);
    this.dom.zoomValue.textContent = `±${this.model.formatNumber(this.model.getZoomValue())}`;
    this.dom.originValue.textContent = this.model.formatNumber(this.model.getOriginValue());
  }

  syncSlidersFromView() {
    const vp = this.model.getViewport();
    const scale = (vp.xMax - vp.xMin) / 2;
    const origin = (vp.xMax + vp.xMin) / 2;

    const clampedScale = this.model.clampRange(scale, 2, 30);
    const clampedOrigin = this.model.clampRange(origin, -20, 20);

    this.dom.zoomSlider.value = String(clampedScale);
    this.dom.originSlider.value = String(clampedOrigin);
    this.dom.zoomValue.textContent = `±${this.model.formatNumber(clampedScale)}`;
    this.dom.originValue.textContent = this.model.formatNumber(clampedOrigin);
  }

  // ===== ANIMACIÓN =====

  animateTowardsZero() {
    this.animating = true;
    this.cancelAnimationFrame(this.animationId);

    const step = () => {
      const continues = this.model.stepAnimateTowardsZero();
      this.render();

      if (continues) {
        this.animationId = requestAnimationFrame(step);
      } else {
        this.animating = false;
      }
    };

    step();
  }

  pauseAnimation() {
    this.animating = false;
    cancelAnimationFrame(this.animationId);
  }

  reset() {
    this.pauseAnimation();
    this.model.setManualView(false);
    this.model.setFunctionExpr('x^2');
    this.model.setXPoint(1);
    this.model.setH(1.5);
    this.model.setViewRange(6);
    this.model.setOrigin(0);
    this.dom.functionInput.value = 'x^2';
    this.dom.xPoint.value = '1';
    this.dom.hSlider.value = '1.5';
    this.dom.viewScale.value = '6';
    this.dom.zoomSlider.value = '6';
    this.dom.originSlider.value = '0';
    this.render();
  }

  // ===== PRIVADOS =====

  _resizeBackingCanvas() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = Math.round(rect.width * dpr);
    this.canvas.height = Math.round(rect.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
}
