class PlanoInclinadoPresenter {
  constructor(model, renderer, sliders, dom, constants) {
    this.model = model;
    this.renderer = renderer;
    this.sliders = sliders;
    this.dom = dom;
    this.constants = constants;

    this.lastTimestamp = null;
    this.animationId = null;

    this.setupEventListeners();
  }

  setupEventListeners() {
    // Sliders
    this.sliders.angle.input.addEventListener('input', () => {
      this.model.setAngle(this.sliders.angle.getValue());
      this.updateUI();
      this.render();
    });

    this.sliders.mu.input.addEventListener('input', () => {
      this.model.setFriction(this.sliders.mu.getValue());
      this.updateUI();
      this.render();
    });

    this.sliders.mass.input.addEventListener('input', () => {
      this.model.setMass(this.sliders.mass.getValue());
      this.updateUI();
      this.render();
    });

    this.sliders.length.input.addEventListener('input', () => {
      this.model.setRampLength(this.sliders.length.getValue());
      this.updateUI();
      this.render();
    });

    // Botones
    this.dom.startBtn.addEventListener('click', () => {
      this.model.start();
      this.updateUI();
      if (this.model.running) {
        this.lastTimestamp = null;
        this.animationId = requestAnimationFrame((ts) => this.animate(ts));
      }
    });

    this.dom.pauseBtn.addEventListener('click', () => {
      this.model.pause();
      if (this.animationId !== null) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
      this.updateUI();
    });

    this.dom.resetBtn.addEventListener('click', () => {
      this.model.reset();
      this.lastTimestamp = null;
      if (this.animationId !== null) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
      this.updateUI();
      this.render();
    });
  }

  updateUI() {
    const dyn = this.model.getDynamics();
    const theo = this.model.getTheoretical();

    this.sliders.angle.updateDisplay(this.model.angleDeg);
    this.sliders.mu.updateDisplay(this.model.mu);
    this.sliders.mass.updateDisplay(this.model.mass);
    this.sliders.length.updateDisplay(this.model.rampLength);

    const format = (value, digits = 2) => Number.isFinite(value) ? value.toFixed(digits) : '∞';

    this.dom.timeValue.textContent = format(this.model.time) + ' s';
    this.dom.velocityValue.textContent = format(this.model.velocity) + ' m/s';
    this.dom.distanceValue.textContent = format(this.model.distance) + ' m';
    this.dom.accValue.textContent = format(dyn.acceleration, 3) + ' m/s²';

    this.dom.parallelValue.textContent = format(dyn.parallel) + ' N';
    this.dom.normalValue.textContent = format(dyn.normal) + ' N';
    this.dom.frictionValue.textContent = format(dyn.friction) + ' N';
    this.dom.netForceValue.textContent = format(dyn.netForce) + ' N';

    this.dom.theoreticalTime.textContent = format(theo.time) + ' s';
    this.dom.theoreticalVelocity.textContent = format(theo.velocity) + ' m/s';

    if (dyn.staticHold) {
      this.dom.statusText.textContent = 'El bloque no se mueve porque el rozamiento compensa la componente del peso en la pendiente.';
    } else {
      this.dom.statusText.innerHTML = 'El bloque desliza. Aceleración: <strong>' + format(dyn.acceleration, 3) + ' m/s²</strong>';
    }

    if (!dyn.staticHold) {
      this.dom.resultText.textContent = this.model.finished
        ? 'La simulación ha llegado al final de la pendiente.'
        : 'Estos valores se alcanzarán cuando el bloque llegue abajo.';
    } else {
      this.dom.resultText.textContent = 'No hay descenso con estos parámetros.';
    }

    this.dom.startBtn.disabled = !this.model.canStart();
    this.dom.pauseBtn.disabled = !this.model.canPause();
  }

  render() {
    const dyn = this.model.getDynamics();
    const ctx = this.renderer.getContext();
    const canvas = this.renderer.canvas;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const groundY = 420;
    const baseX = 720;
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const pixelsPerMeter = clamp(420 / this.model.rampLength, 26, 75);
    const rampPx = this.model.rampLength * pixelsPerMeter;

    const angleRad = dyn.angleRad;
    const topX = baseX - rampPx * Math.cos(angleRad);
    const topY = groundY - rampPx * Math.sin(angleRad);
    const bottomX = baseX;
    const bottomY = groundY;
    const leftGroundX = topX;

    const contactX = topX + this.model.distance * Math.cos(angleRad) * pixelsPerMeter;
    const contactY = topY + this.model.distance * Math.sin(angleRad) * pixelsPerMeter;

    const blockScreenLength = this.constants.BLOCK_LENGTH_M * pixelsPerMeter;
    const blockScreenHeight = this.constants.BLOCK_HEIGHT_M * pixelsPerMeter;

    const ux = Math.cos(angleRad);
    const uy = Math.sin(angleRad);
    const nx = Math.sin(angleRad);
    const ny = -Math.cos(angleRad);

    const blockCenterX = contactX + (blockScreenHeight / 2) * nx;
    const blockCenterY = contactY + (blockScreenHeight / 2) * ny;

    const p1 = {
      x: blockCenterX - (blockScreenLength / 2) * ux - (blockScreenHeight / 2) * nx,
      y: blockCenterY - (blockScreenLength / 2) * uy - (blockScreenHeight / 2) * ny,
    };
    const p2 = {
      x: blockCenterX + (blockScreenLength / 2) * ux - (blockScreenHeight / 2) * nx,
      y: blockCenterY + (blockScreenLength / 2) * uy - (blockScreenHeight / 2) * ny,
    };
    const p3 = {
      x: blockCenterX + (blockScreenLength / 2) * ux + (blockScreenHeight / 2) * nx,
      y: blockCenterY + (blockScreenLength / 2) * uy + (blockScreenHeight / 2) * ny,
    };
    const p4 = {
      x: blockCenterX - (blockScreenLength / 2) * ux + (blockScreenHeight / 2) * nx,
      y: blockCenterY - (blockScreenLength / 2) * uy + (blockScreenHeight / 2) * ny,
    };

    this.renderer.clear('#e0f2fe');
    this.renderer.drawRect(0, groundY, canvasWidth, 100, '#cbd5e1');

    this.renderer.drawPolygon([
      { x: leftGroundX, y: groundY },
      { x: topX, y: topY },
      { x: bottomX, y: bottomY },
    ], '#d6d3d1', '#78716c', 3);

    this.renderer.drawLine(topX, topY, bottomX, bottomY, '#57534e', 5);
    this.renderer.drawLine(leftGroundX, groundY, bottomX, bottomY, '#64748b', 3);
    this.renderer.drawLine(leftGroundX, groundY, topX, topY, '#94a3b8', 1);

    this.renderer.drawLine(bottomX - 120, groundY, bottomX - 12, groundY, '#1e293b', 3);
    this.renderer.drawLine(bottomX - 12, groundY, bottomX - 12, groundY - 18, '#1e293b', 3);
    this.renderer.drawArc(bottomX - 12, groundY, 34, -Math.PI, -Math.PI / 2, '#1e293b', 2);

    this.renderer.drawText('θ = ' + this.model.angleDeg.toFixed(0) + '°', bottomX - 110, groundY - 28, 16, 'bold', '#0f172a');

    this.renderer.drawPolygon([p1, p2, p3, p4], '#f59e0b', '#92400e', 3);

    this.renderer.drawArrow(blockCenterX, blockCenterY, blockCenterX, blockCenterY + 70, '#dc2626', 'Peso');
    this.renderer.drawArrow(blockCenterX, blockCenterY, blockCenterX - nx * 52, blockCenterY - ny * 52, '#2563eb', 'Normal');
    this.renderer.drawArrow(blockCenterX, blockCenterY, blockCenterX - ux * 45, blockCenterY - uy * 45, '#16a34a', 'Roz.');

    this.renderer.drawText('Final', bottomX - 18, bottomY + 35, 15, 'bold', '#334155');
  }

  animate(timestamp) {
    if (!this.model.running) return;

    if (this.lastTimestamp === null || this.lastTimestamp === undefined) {
      this.lastTimestamp = timestamp;
    } else {
      let delta = (timestamp - this.lastTimestamp) / 1000;
      this.lastTimestamp = timestamp;
      delta = Math.min(delta, 0.04);

      this.model.step(delta);
      this.updateUI();
      this.render();
    }

    if (this.model.running) {
      this.animationId = requestAnimationFrame((ts) => this.animate(ts));
    }
  }
}
