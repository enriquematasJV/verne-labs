class Cinematica2DPresenter {
  constructor(model, canvas, dom, constants) {
    this.model = model;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.dom = dom;
    this.constants = constants;

    this.setupEventListeners();
    this.resetSimulation();
    this.draw();
  }

  setupEventListeners() {
    // Presets
    this.dom.presetSelect.addEventListener('change', () => this.applyPreset());

    // Mode
    this.dom.modeSelect.addEventListener('change', () => {
      this.model.setMode(this.dom.modeSelect.value);
      this.updateAngleDisabled();
      this.resetSimulation();
    });

    // Inputs
    this.dom.heightInput.addEventListener('input', () => this.readControls());
    this.dom.speedInput.addEventListener('input', () => this.readControls());
    this.dom.angleInput.addEventListener('input', () => this.readControls());
    this.dom.gravityInput.addEventListener('input', () => this.readControls());
    this.dom.autoPauseModeSelect.addEventListener('change', () => {
      this.model.setAutoPauseMode(this.dom.autoPauseModeSelect.value);
    });

    // Buttons
    this.dom.startBtn.addEventListener('click', () => this.start());
    this.dom.pauseBtn.addEventListener('click', () => this.pause());
    this.dom.resetBtn.addEventListener('click', () => this.resetSimulation());

    // Window
    window.addEventListener('resize', () => this.draw());
  }

  readControls() {
    this.model.setMode(this.dom.modeSelect.value);
    this.model.setHeight(this.dom.heightInput.value);
    this.model.setSpeed(this.dom.speedInput.value);
    this.model.setAngle(this.dom.angleInput.value);
    this.model.setGravity(this.dom.gravityInput.value);

    this.dom.heightValue.textContent = this.model.getHeight().toFixed(1);
    this.dom.speedValue.textContent = this.model.getSpeed().toFixed(1);
    this.dom.angleValue.textContent = this.model.getAngle().toFixed(0);
    this.dom.gravityValue.textContent = this.model.getGravity().toFixed(1);

    this.updateAngleDisabled();
    this.resetSimulation();
  }

  applyPreset() {
    const presetName = this.dom.presetSelect.value;
    const preset = this.constants.PRESETS[presetName] || this.constants.PRESETS.libre;

    this.dom.modeSelect.value = preset.mode;
    this.dom.heightInput.value = preset.y0;
    this.dom.speedInput.value = preset.v0;
    this.dom.angleInput.value = preset.angle;
    this.dom.gravityInput.value = preset.g;

    this.readControls();
  }

  updateAngleDisabled() {
    this.dom.angleInput.disabled = this.model.getMode() !== 'parabolic';
  }

  start() {
    if (!this.model.isRunning() && !this.model.isFinished()) {
      this.model.setRunning(true);
      this.dom.startBtn.disabled = true;
      this.dom.pauseBtn.disabled = false;
      this.animate();
    }
  }

  pause() {
    this.model.setRunning(false);
    this.dom.startBtn.disabled = false;
    this.dom.pauseBtn.disabled = true;
  }

  resetSimulation() {
    this.readControls();
    this.model.resetSimulation();
    this.dom.startBtn.disabled = false;
    this.dom.pauseBtn.disabled = true;
    this.syncUI();
    this.draw();
  }

  animate() {
    const now = performance.now();
    const state = this.model.getState();

    if (!state.lastTimestamp) {
      state.lastTimestamp = now;
    }

    const deltaMs = now - state.lastTimestamp;
    state.lastTimestamp = now;

    if (this.model.isRunning()) {
      this.model.updateTime(deltaMs);
      this.model.checkMilestones();
    }

    this.syncUI();
    this.draw();

    if (this.model.isRunning()) {
      requestAnimationFrame(() => this.animate());
    }
  }

  syncUI() {
    const th = this.model.getTheoretical();
    const x = this.model.xAt(this.model.getTime());
    const y = Math.max(0, this.model.yAt(this.model.getTime()));
    const vx = this.model.vxAt();
    const vy = this.model.vyAt(this.model.getTime());
    const speedModule = this.model.speedAt(this.model.getTime());

    this.dom.timeValue.textContent = this.model.format(this.model.getTime()) + ' s';
    this.dom.positionValue.textContent = `${this.model.format(x, 1)}, ${this.model.format(y, 1)} m`;
    this.dom.velocityValue.textContent = `${this.model.format(vx, 1)}, ${this.model.format(vy, 1)} m/s`;
    this.dom.speedModuleValue.textContent = this.model.format(speedModule, 1) + ' m/s';

    this.dom.flightTimeValue.textContent = this.model.format(th.flightTime);
    this.dom.maxHeightValue.textContent = this.model.format(th.maxHeight, 1);
    this.dom.apexTimeValue.textContent = this.model.format(th.apexTime);
    this.dom.rangeValue.textContent = this.model.format(th.range, 1);
    this.dom.impactValue.textContent = this.model.format(th.impactSpeed, 1);

    this.buildEquationText();
    this.updateStageInfo();
  }

  buildEquationText() {
    const th = this.model.getTheoretical();
    const m = this.model.getMode();

    this.dom.formulaX.textContent = `x(t) = ${this.model.format(th.v0x, 2)}·t`;
    this.dom.formulaY.textContent = `y(t) = ${this.model.format(this.model.getHeight(), 1)} + ${this.model.format(th.v0y, 2)}·t - ${this.model.format(Math.abs(0.5 * this.model.getGravity()), 2)}·t²`;

    if (m === 'parabolic') {
      this.dom.componentFormula.textContent = `v₀x = ${this.model.format(this.model.getSpeed(), 1)}·cos(${this.model.getAngle()}°) = ${this.model.format(th.v0x, 2)} m/s,  v₀y = ${this.model.format(this.model.getSpeed(), 1)}·sin(${this.model.getAngle()}°) = ${this.model.format(th.v0y, 2)} m/s`;
    } else if (m === 'horizontal') {
      this.dom.componentFormula.textContent = `v₀x = ${this.model.format(this.model.getSpeed(), 1)} m/s,  v₀y = 0 m/s`;
    } else {
      this.dom.componentFormula.textContent = `v₀x = 0 m/s,  v₀y = ${this.model.format(this.model.getSpeed(), 1)} m/s`;
    }
  }

  updateStageInfo() {
    const stage = this.model.getStageDescription();
    this.dom.modelSummary.textContent = stage.title;
    // Aquí se podrían actualizar más campos si es necesario
  }

  draw() {
    const th = this.model.getTheoretical();
    const currentX = this.model.xAt(this.model.getTime());
    const currentY = Math.max(0, this.model.yAt(this.model.getTime()));
    const maxX = Math.max(15, th.range, currentX) + 8;
    const maxY = Math.max(10, th.maxHeight, this.model.getHeight(), currentY) + 6;

    const w = this.canvas.width;
    const h = this.canvas.height;
    const left = 70;
    const right = w - 50;
    const bottom = h - 70;
    const top = 50;

    const scaleX = (right - left) / maxX;
    const scaleY = (bottom - top) / maxY;
    const scale = Math.min(scaleX, scaleY);

    const xToPx = x => left + x * scale;
    const yToPx = y => bottom - y * scale;

    this.ctx.clearRect(0, 0, w, h);
    const grad = this.ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#e0f2fe');
    grad.addColorStop(1, '#f8fafc');
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, w, h);

    this.ctx.fillStyle = '#cbd5e1';
    this.ctx.fillRect(0, bottom, w, h - bottom);

    this.ctx.strokeStyle = '#0f172a';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(left, bottom);
    this.ctx.lineTo(right, bottom);
    this.ctx.moveTo(left, bottom);
    this.ctx.lineTo(left, top);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(right, bottom);
    this.ctx.lineTo(right - 10, bottom - 6);
    this.ctx.moveTo(right, bottom);
    this.ctx.lineTo(right - 10, bottom + 6);
    this.ctx.moveTo(left, top);
    this.ctx.lineTo(left - 6, top + 10);
    this.ctx.moveTo(left, top);
    this.ctx.lineTo(left + 6, top + 10);
    this.ctx.stroke();

    this.ctx.fillStyle = '#0f172a';
    this.ctx.font = 'bold 14px Arial';
    this.ctx.fillText('x (m)', right - 36, bottom - 12);
    this.ctx.fillText('y (m)', left + 10, top + 8);

    const niceTick = (rawStep) => {
      const power = Math.pow(10, Math.floor(Math.log10(rawStep || 1)));
      const norm = rawStep / power;
      if (norm < 1.5) return 1 * power;
      if (norm < 3) return 2 * power;
      if (norm < 7) return 5 * power;
      return 10 * power;
    };

    const tickX = niceTick(maxX / 8);
    for (let x = 0; x <= maxX + 0.001; x += tickX) {
      const px = xToPx(x);
      this.ctx.strokeStyle = '#cbd5e1';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(px, bottom);
      this.ctx.lineTo(px, top);
      this.ctx.stroke();
      this.ctx.fillStyle = '#475569';
      this.ctx.font = '12px Arial';
      this.ctx.fillText(String(Math.round(x)), px - 8, bottom + 18);
    }

    const tickY = niceTick(maxY / 6);
    for (let y = 0; y <= maxY + 0.001; y += tickY) {
      const py = yToPx(y);
      this.ctx.strokeStyle = '#cbd5e1';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(left, py);
      this.ctx.lineTo(right, py);
      this.ctx.stroke();
      this.ctx.fillStyle = '#475569';
      this.ctx.font = '12px Arial';
      this.ctx.fillText(String(Math.round(y)), left - 34, py + 4);
    }

    this.ctx.strokeStyle = '#7c3aed';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    for (let i = 0; i <= 180; i++) {
      const t = th.flightTime * i / 180;
      const px = xToPx(this.model.xAt(t));
      const py = yToPx(Math.max(0, this.model.yAt(t)));
      if (i === 0) this.ctx.moveTo(px, py);
      else this.ctx.lineTo(px, py);
    }
    this.ctx.stroke();

    if (th.apexTime > 0) {
      const apexX = xToPx(this.model.xAt(th.apexTime));
      const apexY = yToPx(th.maxHeight);
      this.ctx.fillStyle = '#7c3aed';
      this.ctx.beginPath();
      this.ctx.arc(apexX, apexY, 6, 0, Math.PI * 2);
      this.ctx.fill();
    }

    const impactX = xToPx(th.range);
    const impactY = yToPx(0);
    this.ctx.fillStyle = '#16a34a';
    this.ctx.beginPath();
    this.ctx.arc(impactX, impactY, 7, 0, Math.PI * 2);
    this.ctx.fill();

    const ballX = xToPx(currentX);
    const ballY = yToPx(currentY);
    this.ctx.fillStyle = '#f59e0b';
    this.ctx.strokeStyle = '#92400e';
    this.ctx.lineWidth = 2.5;
    this.ctx.beginPath();
    this.ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    const vx = this.model.vxAt();
    const vy = this.model.vyAt(this.model.getTime());
    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

    // Vector vx
    this.ctx.strokeStyle = '#2563eb';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(ballX, ballY);
    this.ctx.lineTo(ballX + clamp(vx * 2.8, -90, 90), ballY);
    this.ctx.stroke();

    // Vector vy
    this.ctx.strokeStyle = '#dc2626';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(ballX, ballY);
    this.ctx.lineTo(ballX, ballY - clamp(vy * 2.8, -90, 90));
    this.ctx.stroke();

    // Vector ay
    this.ctx.strokeStyle = '#16a34a';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(ballX, ballY);
    this.ctx.lineTo(ballX, ballY + 64);
    this.ctx.stroke();
  }

  mathToScreenX(x) {
    const m = this.constants.CANVAS.margin;
    const canvasWidth = this.canvas.width || this.constants.CANVAS.width;
    const mathRange = 200; // Rango matemático: 0 a 200 metros
    const screenRange = canvasWidth - 2 * m;
    const scale = screenRange / mathRange;
    return m + x * scale;
  }

  mathToScreenY(y) {
    const m = this.constants.CANVAS.margin;
    const canvasHeight = this.canvas.height || this.constants.CANVAS.height;
    const mathRange = 200; // Rango matemático: 0 a 200 metros
    const screenRange = canvasHeight - 2 * m;
    const scale = screenRange / mathRange;
    return canvasHeight - m - y * scale;
  }
}
