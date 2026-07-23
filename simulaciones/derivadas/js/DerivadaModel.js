class DerivadaModel {
  constructor(constants) {
    this.constants = constants;

    // Estado
    this.functionExpr = 'x^2';
    this.compiled = null;
    this.xPoint = 1;
    this.h = 1.5;
    this.manualView = false;

    // Viewport
    this.xMin = constants.VIEWPORT_INITIAL.xMin;
    this.xMax = constants.VIEWPORT_INITIAL.xMax;
    this.yMin = constants.VIEWPORT_INITIAL.yMin;
    this.yMax = constants.VIEWPORT_INITIAL.yMax;
    this.zoomValue = constants.VIEWPORT_INITIAL.zoomDefault;
    this.originValue = constants.VIEWPORT_INITIAL.originDefault;

    // Canvas
    this.canvasWidth = 1100;
    this.canvasHeight = 720;

    // Compilar función inicial
    this._compileFunction();
  }

  // ===== SETTERS =====

  setFunctionExpr(expr) {
    this.functionExpr = expr.trim() || 'x^2';
    this._compileFunction();
  }

  setXPoint(x) {
    this.xPoint = Number(x);
  }

  setH(h) {
    this.h = Number(h);
    // Evitar h = 0
    if (Math.abs(this.h) < 0.001) {
      this.h = this.h >= 0 ? 0.001 : -0.001;
    }
  }

  setViewRange(zoomVal) {
    this.zoomValue = Number(zoomVal);
    this._calculateViewport();
  }

  setOrigin(originVal) {
    this.originValue = Number(originVal);
    this._calculateViewport();
  }

  setViewport(xMin, xMax, yMin, yMax) {
    this.xMin = xMin;
    this.xMax = xMax;
    this.yMin = yMin;
    this.yMax = yMax;
  }

  setManualView(bool) {
    this.manualView = bool;
  }

  setCanvasSize(width, height) {
    this.canvasWidth = width;
    this.canvasHeight = height;
  }

  // ===== GETTERS (sin cálculos complejos, solo acceso) =====

  getFunctionExpr() {
    return this.functionExpr;
  }

  getCompiled() {
    return this.compiled;
  }

  getXPoint() {
    return this.xPoint;
  }

  getH() {
    return this.h;
  }

  getViewport() {
    return {
      xMin: this.xMin,
      xMax: this.xMax,
      yMin: this.yMin,
      yMax: this.yMax
    };
  }

  getZoomValue() {
    return this.zoomValue;
  }

  getOriginValue() {
    return this.originValue;
  }

  // ===== CÁLCULOS DE VALORES (lógica pura) =====

  safeEval(x) {
    if (!this.compiled) return NaN;
    return VerneMath.safeEvaluate(this.compiled, x);
  }

  derivativeApprox(x) {
    const eps = Math.max(this.constants.TOLERANCES.eps, (this.xMax - this.xMin) / 100000);
    const y1 = this.safeEval(x + eps);
    const y0 = this.safeEval(x - eps);
    if (!Number.isFinite(y1) || !Number.isFinite(y0)) return NaN;
    return (y1 - y0) / (2 * eps);
  }

  calculateSecantSlope(x, h) {
    const fx = this.safeEval(x);
    const fxh = this.safeEval(x + h);
    if (!Number.isFinite(fx) || !Number.isFinite(fxh)) return NaN;
    return (fxh - fx) / h;
  }

  // ===== COORDINADAS (conversión math ↔ screen) =====

  toScreenX(mathX) {
    const m = this.constants.RENDERING.margin;
    return m + (mathX - this.xMin) / (this.xMax - this.xMin) * (this.canvasWidth - 2 * m);
  }

  toScreenY(mathY) {
    const m = this.constants.RENDERING.margin;
    return this.canvasHeight - m - (mathY - this.yMin) / (this.yMax - this.yMin) * (this.canvasHeight - 2 * m);
  }

  toMathX(screenPx) {
    const m = this.constants.RENDERING.margin;
    return this.xMin + (screenPx - m) / (this.canvasWidth - 2 * m) * (this.xMax - this.xMin);
  }

  // ===== LÓGICA DE VIEWPORT =====

  autoFitY() {
    if (this.manualView) return;

    this._calculateViewport();

    // Recopilar valores finitos de la función
    const values = [];
    const samples = 420;
    for (let i = 0; i <= samples; i++) {
      const x = this.xMin + i / samples * (this.xMax - this.xMin);
      const y = this.safeEval(x);
      if (Number.isFinite(y) && Math.abs(y) < this.constants.TOLERANCES.infinityThreshold) {
        values.push(y);
      }
    }

    // Agregar valores en puntos de interés
    const x = this.xPoint;
    const h = this.h;
    [x, x + h].forEach(v => {
      const y = this.safeEval(v);
      if (Number.isFinite(y) && Math.abs(y) < this.constants.TOLERANCES.infinityThreshold) {
        values.push(y);
      }
    });

    if (!values.length) {
      this.yMin = -this.zoomValue;
      this.yMax = this.zoomValue;
      return;
    }

    let min = Math.min(...values);
    let max = Math.max(...values);

    if (Math.abs(max - min) < 1e-6) {
      min -= 1;
      max += 1;
    }

    const pad = Math.max(1, (max - min) * 0.18);
    this.yMin = min - pad;
    this.yMax = max + pad;

    const maxAbs = Math.max(Math.abs(this.yMin), Math.abs(this.yMax));
    if (maxAbs < this.zoomValue * 0.4) {
      this.yMin = -this.zoomValue * 0.4;
      this.yMax = this.zoomValue * 0.4;
    }
  }

  // ===== PRIVADOS =====

  _compileFunction() {
    try {
      this.compiled = VerneMath.compile(this.functionExpr);
    } catch (error) {
      this.compiled = null;
      throw error;
    }
  }

  _calculateViewport() {
    const scale = this.zoomValue;
    const origin = this.originValue;
    this.xMin = origin - scale;
    this.xMax = origin + scale;
  }

  // ===== ANIMACIÓN h → 0 =====

  stepAnimateTowardsZero() {
    const threshold = this.constants.ANIMATION.thresholdStop;
    const decay = this.constants.ANIMATION.decayFactor;
    const minH = this.constants.ANIMATION.minH;

    if (Math.abs(this.h) <= threshold) {
      this.h = this.h > 0 ? minH : -minH;
      return false; // Animación terminada
    }

    this.h *= decay;
    return true; // Continuar animando
  }

  // ===== UTILIDADES =====

  formatNumber(value) {
    if (!Number.isFinite(value)) return '—';
    const exp = this.constants.NUMBER_FORMAT.exponentialThreshold;
    const small = this.constants.NUMBER_FORMAT.smallThreshold;
    const dec = this.constants.NUMBER_FORMAT.decimalPlaces;

    if (Math.abs(value) >= exp || (Math.abs(value) < small && value !== 0)) {
      return value.toExponential(3);
    }
    return value.toFixed(dec);
  }

  clampRange(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
}
