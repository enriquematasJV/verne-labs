class PlanoInclinadoPresenter {
  constructor(model, renderer, sliders, dom, constants, formulasPanel) {
    this.model = model;
    this.renderer = renderer;
    this.sliders = sliders;
    this.dom = dom;
    this.constants = constants;
    this.formulasPanel = formulasPanel;

    // SimulationLifecycle gestiona start/pause/reset/step
    this.lifecycle = new SimulationLifecycle(
      (dt) => this.onStep(dt),
      () => this.model.reset(),
      () => this.model.canStart()
    );

    // AnimationID para requestAnimationFrame
    this.animationId = null;
    this.lastTimestamp = null;

    this.setupEventListeners();
    this.setupLifecycleListeners();
  }

  setupLifecycleListeners() {
    this.lifecycle.on('onStart', () => {
      this.lastTimestamp = null;
      this.animationId = requestAnimationFrame((ts) => this.animate(ts));
      this.updateUI();
    });

    this.lifecycle.on('onPause', () => {
      if (this.animationId !== null) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
      this.updateUI();
    });

    this.lifecycle.on('onReset', () => {
      this.updateUI();
      this.render();
    });

    this.lifecycle.on('onStep', () => {
      this.updateUI();
      this.render();
    });
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

    // Botones - delegados a SimulationLifecycle
    this.dom.startBtn.addEventListener('click', () => {
      this.lifecycle.start();
    });

    this.dom.pauseBtn.addEventListener('click', () => {
      this.lifecycle.pause();
    });

    this.dom.resetBtn.addEventListener('click', () => {
      this.lifecycle.reset();
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

    this.dom.startBtn.disabled = !this.lifecycle.canStart();
    this.dom.pauseBtn.disabled = !this.lifecycle.isRunning();

    // Actualizar panel de fórmulas si existe
    if (this.formulasPanel) {
      this.formulasPanel.update({
        angleDeg: this.model.angleDeg,
        mass: this.model.mass,
        mu: this.model.mu,
        velocity: this.model.velocity,
        time: this.model.time,
      });
    }
  }

  drawDashedLine(x1, y1, x2, y2, color, dashLength = 5) {
    const ctx = this.renderer.getContext();
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.ceil(distance / (dashLength * 2));

    ctx.strokeStyle = color;
    ctx.lineWidth = 1;

    for (let i = 0; i < steps; i++) {
      const t1 = (i * dashLength * 2) / distance;
      const t2 = ((i * dashLength * 2) + dashLength) / distance;
      if (t1 < 1) {
        ctx.beginPath();
        ctx.moveTo(x1 + dx * Math.min(t1, 1), y1 + dy * Math.min(t1, 1));
        ctx.lineTo(x1 + dx * Math.min(t2, 1), y1 + dy * Math.min(t2, 1));
        ctx.stroke();
      }
    }
  }

  drawDashedArrow(x1, y1, x2, y2, color, label = '') {
    this.drawDashedLine(x1, y1, x2, y2, color);

    const dx = x2 - x1;
    const dy = y2 - y1;
    const angle = Math.atan2(dy, dx);
    const headLength = 8;

    const ctx = this.renderer.getContext();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headLength * Math.cos(angle - Math.PI / 6), y2 - headLength * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(x2 - headLength * Math.cos(angle + Math.PI / 6), y2 - headLength * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();

    if (label) {
      ctx.fillStyle = color;
      ctx.font = 'bold 12px Arial';
      ctx.fillText(label, x2 + 8, y2 - 6);
    }
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

    // === DIAGRAMA DE FUERZAS CON DESCOMPOSICIÓN ===
    const scale = 0.8;
    const origin = new Vector2D(blockCenterX, blockCenterY);

    // Ejes de referencia: paralelo y perpendicular a la rampa
    const axisParallel = new Vector2D(ux, uy);      // paralelo a rampa
    const axisPerp = new Vector2D(nx, ny);          // perpendicular a rampa

    // Peso: vector vertical hacia abajo
    const weightMag = this.model.mass * 9.8;
    const weightVec = new Vector2D(0, weightMag);
    const weightEnd = origin.add(weightVec.scale(scale));
    this.renderer.drawArrow(origin.x, origin.y, weightEnd.x, weightEnd.y, '#dc2626', 'P');

    // Descomponer peso en componentes paralela y perpendicular
    const weightDecomp = weightVec.decompose(axisParallel, axisPerp);
    const weightParallel = weightDecomp.parallel.scale(scale);
    const weightPerp = weightDecomp.perpendicular.scale(scale);

    const weightParEnd = origin.add(weightParallel);
    const weightPerpEnd = origin.add(weightPerp);

    // Componente paralela del peso (Px) - línea discontinua con flecha
    this.drawDashedArrow(origin.x, origin.y, weightParEnd.x, weightParEnd.y, '#ea580c', 'Px');

    // Componente perpendicular del peso (Py) - línea discontinua con flecha
    this.drawDashedArrow(origin.x, origin.y, weightPerpEnd.x, weightPerpEnd.y, '#dc2626', 'Py');

    // Normal (perpendicular a rampa)
    const normalMag = dyn.normal;
    const normalVec = axisPerp.scale(normalMag * scale);
    const normalEnd = origin.add(normalVec);
    this.renderer.drawArrow(origin.x, origin.y, normalEnd.x, normalEnd.y, '#2563eb', 'N');

    // Rozamiento (opuesto a movimiento, sobre la rampa)
    const frictionMag = dyn.friction;
    const frictionVec = axisParallel.scale(-frictionMag * scale);
    const frictionEnd = origin.add(frictionVec);
    this.renderer.drawArrow(origin.x, origin.y, frictionEnd.x, frictionEnd.y, '#16a34a', 'f');

    // Fuerza neta (Resultante = Px - f = m·a)
    const netForceMag = dyn.netForce;
    const netForceVec = axisParallel.scale(netForceMag * scale);
    const netForceEnd = origin.add(netForceVec);
    this.renderer.drawArrow(origin.x, origin.y, netForceEnd.x, netForceEnd.y, '#7c3aed', 'F_neta');

    // Línea punteada para mostrar resultante
    if (netForceMag > 0.01) {
      this.drawDashedLine(weightParEnd.x, weightParEnd.y, netForceEnd.x, netForceEnd.y, '#7c3aed', 2);
      this.drawDashedLine(frictionEnd.x, frictionEnd.y, netForceEnd.x, netForceEnd.y, '#7c3aed', 2);
    }

    this.renderer.drawText('Final', bottomX - 18, bottomY + 35, 15, 'bold', '#334155');
  }

  onStep(deltaTime) {
    this.model.step(deltaTime);
    if (this.model.finished) {
      this.lifecycle.markFinished();
    }
  }

  animate(timestamp) {
    if (this.lastTimestamp === null) {
      this.lastTimestamp = timestamp;
    } else {
      let deltaTime = timestamp - this.lastTimestamp;
      this.lastTimestamp = timestamp;
      deltaTime = Math.min(deltaTime, 0.04 * 1000); // Limitar a 40ms

      this.lifecycle.step(deltaTime);
    }

    if (this.lifecycle.isRunning()) {
      this.animationId = requestAnimationFrame((ts) => this.animate(ts));
    }
  }
}
