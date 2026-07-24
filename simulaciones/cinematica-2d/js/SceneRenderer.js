/**
 * SceneRenderer — Renderizado de la escena en canvas
 *
 * Responsabilidades:
 * - Limpiar y preparar canvas
 * - Dibujar fondo (gradiente, suelo)
 * - Dibujar ejes y grid
 * - Dibujar trayectoria teórica
 * - Dibujar puntos notables (apex, impacto)
 * - Dibujar cajas de información (datos, stage)
 *
 * Recibe: canvas, constants, model, physics
 * No modifica estado: solo dibuja
 */

class SceneRenderer {
  constructor(canvas, constants) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.constants = constants;
  }

  /**
   * Renderizar escena completa
   */
  render(model) {
    const th = model.getTheoretical();
    const pos = model.getPosition();
    const vel = model.getVelocity();

    // Calcular viewport dinámico
    const viewport = this._calculateViewport(th, pos, model);

    // Limpiar y dibujar fondo
    this._drawBackground();

    // Dibujar ejes y grid
    this._drawGrid(th, viewport);
    this._drawAxes(viewport);

    // Dibujar trayectoria teórica
    this._drawTrajectory(th, viewport);

    // Dibujar puntos notables
    if (th.apexTime > 0) {
      this._drawApex(th, viewport);
    }
    this._drawImpact(th, viewport);

    // Dibujar pelota actual
    this._drawBall(pos, vel, viewport);

    // Dibujar medidas (si simulación terminó)
    if (model.finished) {
      this._drawMeasures(th, pos, viewport);
    }

    // Dibujar cajas de información
    this._drawDataBox(model, pos, vel);
    this._drawStageBox(model, pos, vel, th);
  }

  /**
   * ===== VIEWPORT =====
   */

  /**
   * Calcular viewport dinámico basado en trayectoria
   */
  _calculateViewport(th, pos, model) {
    const maxX = Math.max(15, th.range, pos.x) + 8;
    const maxY = Math.max(10, th.maxHeight, model.y0, pos.y) + 6;

    const w = this.canvas.width;
    const h = this.canvas.height;
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

  /**
   * ===== FONDO Y ESTRUCTURA =====
   */

  /**
   * Dibujar fondo con gradiente
   */
  _drawBackground() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Gradiente cielo
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, this.constants.COLORS.canvas.background.gradientTop);
    grad.addColorStop(1, this.constants.COLORS.canvas.background.gradientBottom);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Suelo
    ctx.fillStyle = this.constants.COLORS.canvas.background.groundColor;
    const groundY = h - this.constants.LAYOUT.bottomOffset;
    ctx.fillRect(0, groundY, w, h - groundY);
  }

  /**
   * Dibujar grid y ejes
   */
  _drawGrid(th, vp) {
    const ctx = this.ctx;

    // Grid horizontal (Y)
    const tickY = CinematicaPhysics.niceTick(vp.maxY / this.constants.LAYOUT.tickDivisionsY);
    ctx.strokeStyle = this.constants.COLORS.grid;
    ctx.lineWidth = this.constants.RENDERING.gridLineWidth;

    for (let y = 0; y <= vp.maxY + 0.001; y += tickY) {
      const py = vp.yToPx(y);
      ctx.beginPath();
      ctx.moveTo(vp.left, py);
      ctx.lineTo(vp.right, py);
      ctx.stroke();
    }

    // Grid vertical (X)
    const tickX = CinematicaPhysics.niceTick(vp.maxX / this.constants.LAYOUT.tickDivisionsX);
    for (let x = 0; x <= vp.maxX + 0.001; x += tickX) {
      const px = vp.xToPx(x);
      ctx.beginPath();
      ctx.moveTo(px, vp.bottom);
      ctx.lineTo(px, vp.top);
      ctx.stroke();
    }
  }

  /**
   * Dibujar ejes principales
   */
  _drawAxes(vp) {
    const ctx = this.ctx;
    ctx.strokeStyle = this.constants.COLORS.axis;
    ctx.lineWidth = this.constants.RENDERING.axisLineWidth;

    // Eje X
    ctx.beginPath();
    ctx.moveTo(vp.left, vp.bottom);
    ctx.lineTo(vp.right, vp.bottom);
    ctx.stroke();

    // Eje Y
    ctx.beginPath();
    ctx.moveTo(vp.left, vp.bottom);
    ctx.lineTo(vp.left, vp.top);
    ctx.stroke();

    // Flechas de ejes
    ctx.beginPath();
    ctx.moveTo(vp.right, vp.bottom);
    ctx.lineTo(vp.right - 10, vp.bottom - 6);
    ctx.moveTo(vp.right, vp.bottom);
    ctx.lineTo(vp.right - 10, vp.bottom + 6);
    ctx.moveTo(vp.left, vp.top);
    ctx.lineTo(vp.left - 6, vp.top + 10);
    ctx.moveTo(vp.left, vp.top);
    ctx.lineTo(vp.left + 6, vp.top + 10);
    ctx.stroke();

    // Etiquetas de ejes
    ctx.fillStyle = this.constants.COLORS.text;
    ctx.font = this.constants.RENDERING.fontSize.bold;
    ctx.fillText('x (m)', vp.right - 36, vp.bottom - 12);
    ctx.fillText('y (m)', vp.left + 10, vp.top + 8);

    // Marcas y etiquetas numéricas
    ctx.font = this.constants.RENDERING.fontSize.small;
    ctx.fillStyle = this.constants.COLORS.textMuted;

    const tickX = CinematicaPhysics.niceTick(vp.maxX / this.constants.LAYOUT.tickDivisionsX);
    for (let x = 0; x <= vp.maxX + 0.001; x += tickX) {
      const px = vp.xToPx(x);
      ctx.fillText(String(Math.round(x)), px - 8, vp.bottom + 18);
    }

    const tickY = CinematicaPhysics.niceTick(vp.maxY / this.constants.LAYOUT.tickDivisionsY);
    for (let y = 0; y <= vp.maxY + 0.001; y += tickY) {
      const py = vp.yToPx(y);
      ctx.fillText(String(Math.round(y)), vp.left - 34, py + 4);
    }
  }

  /**
   * ===== TRAYECTORIA =====
   */

  /**
   * Dibujar trayectoria teórica
   */
  _drawTrajectory(th, vp) {
    const ctx = this.ctx;
    ctx.strokeStyle = this.constants.COLORS.trajectory;
    ctx.lineWidth = this.constants.RENDERING.vectorLineWidth;
    ctx.beginPath();

    for (let i = 0; i <= 180; i++) {
      const t = th.flightTime * i / 180;
      const x = CinematicaPhysics.xAt(t, th.v0x);
      const y = Math.max(0, CinematicaPhysics.yAt(t, vp.model?.y0 || 0, th.v0y, vp.model?.g || -9.8));
      const px = vp.xToPx(x);
      const py = vp.yToPx(y);

      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }

  /**
   * ===== PUNTOS NOTABLES =====
   */

  /**
   * Dibujar punto de altura máxima
   */
  _drawApex(th, vp) {
    const ctx = this.ctx;
    // Nota: necesitamos acceso a y0 y g del model, por ahora usamos valores default
    // Esto será pasado desde el Presenter
    const apexX = vp.xToPx(CinematicaPhysics.xAt(th.apexTime, th.v0x));
    const apexY = vp.yToPx(th.maxHeight);

    ctx.fillStyle = this.constants.COLORS.apex;
    ctx.beginPath();
    ctx.arc(apexX, apexY, this.constants.RENDERING.pointRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = this.constants.RENDERING.fontSize.bold;
    ctx.fillText('Altura máxima', apexX - 44, apexY - 14);
  }

  /**
   * Dibujar punto de impacto
   */
  _drawImpact(th, vp) {
    const ctx = this.ctx;
    const impactX = vp.xToPx(th.range);
    const impactY = vp.yToPx(0);

    ctx.fillStyle = this.constants.COLORS.impact;
    ctx.beginPath();
    ctx.arc(impactX, impactY, this.constants.RENDERING.pointRadiusImpact, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = this.constants.RENDERING.fontSize.bold;
    ctx.fillText('Impacto', impactX - 24, impactY - 12);
  }

  /**
   * ===== PELOTA Y VECTORES =====
   */

  /**
   * Dibujar pelota actual (será expandido en VectorRenderer)
   */
  _drawBall(pos, vel, vp) {
    const ctx = this.ctx;
    const ballX = vp.xToPx(pos.x);
    const ballY = vp.yToPx(pos.y);

    ctx.fillStyle = this.constants.COLORS.ball;
    ctx.strokeStyle = this.constants.COLORS.ballStroke;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(ballX, ballY, this.constants.RENDERING.ballRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  /**
   * ===== MEDIDAS Y ANOTACIONES =====
   */

  /**
   * Dibujar medidas cuando simulación termina
   */
  _drawMeasures(th, pos, vp) {
    // Será implementado en VectorRenderer
    // Por ahora placeholder
  }

  /**
   * ===== CAJAS DE INFORMACIÓN =====
   */

  /**
   * Dibujar caja de datos instantáneos (tiempo, posición, velocidad)
   */
  _drawDataBox(model, pos, vel) {
    const ctx = this.ctx;
    const boxW = this.constants.LAYOUT.dataBoxWidth;
    const boxH = this.constants.LAYOUT.dataBoxHeight;
    const boxX = 654;
    const boxY = 20;

    // Fondo redondeado
    ctx.fillStyle = this.constants.COLORS.boxBackground;
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxW, boxH, this.constants.RENDERING.dataBoxRadius);
    ctx.fill();

    ctx.strokeStyle = this.constants.COLORS.boxBorder;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Contenido
    ctx.fillStyle = this.constants.COLORS.text;
    ctx.font = this.constants.RENDERING.fontSize.title;
    ctx.fillText('Datos instantáneos', boxX + 16, boxY + 24);

    ctx.font = this.constants.RENDERING.fontSize.normal;
    const speedModule = Math.sqrt(vel.vx * vel.vx + vel.vy * vel.vy);

    ctx.fillText(`t = ${CinematicaPhysics.format(model.time, 2)} s`, boxX + 16, boxY + 48);
    ctx.fillText(`x = ${CinematicaPhysics.format(pos.x, 1)} m`, boxX + 16, boxY + 70);
    ctx.fillText(`y = ${CinematicaPhysics.format(pos.y, 1)} m`, boxX + 16, boxY + 92);
    ctx.fillText(`v = ${CinematicaPhysics.format(speedModule, 1)} m/s`, boxX + 16, boxY + 114);
  }

  /**
   * Dibujar caja de información del stage (pedagógica)
   */
  _drawStageBox(model, pos, vel, th) {
    const ctx = this.ctx;
    const boxW = this.constants.LAYOUT.stageBoxWidth;
    const boxH = this.constants.LAYOUT.stageBoxHeight;
    const boxX = this.canvas.width - boxW - 20;
    const boxY = 20;

    // Fondo redondeado
    ctx.fillStyle = this.constants.COLORS.boxBackground;
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxW, boxH, this.constants.RENDERING.dataBoxRadius);
    ctx.fill();

    ctx.strokeStyle = this.constants.COLORS.boxBorder;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Contenido
    ctx.fillStyle = this.constants.COLORS.text;
    ctx.font = this.constants.RENDERING.fontSize.title;

    // Determinar stage actual
    const stageInfo = this._getStageInfo(model, pos, th);
    ctx.fillText(stageInfo.title, boxX + 16, boxY + 24);

    ctx.font = this.constants.RENDERING.fontSize.small;
    stageInfo.lines.forEach((line, i) => {
      ctx.fillText(line, boxX + 16, boxY + 48 + i * 20);
    });
  }

  /**
   * Obtener información del stage actual (pedagógico)
   */
  _getStageInfo(model, pos, th) {
    const y = Math.max(0, pos.y);
    const vx = Math.abs(th.v0x) > 1e-6 ? th.v0x : 0;
    const vy = th.v0y + model.g * model.time;
    const totalSpeed = Math.sqrt(vx * vx + vy * vy);

    if (model.finished || Math.abs(model.time - th.flightTime) < 1e-6) {
      return {
        title: 'Llegada al suelo',
        lines: [
          `Condición: y(t) = 0`,
          `Ecuación: ${CinematicaPhysics.format(model.y0, 1)} + ${CinematicaPhysics.format(th.v0y, 2)}·t - ${CinematicaPhysics.format(Math.abs(0.5 * model.g), 2)}·t² = 0`,
          `Solución usada: t = ${CinematicaPhysics.format(th.flightTime, 2)} s`,
          `Alcance: x = ${CinematicaPhysics.format(th.range, 2)} m`,
          `Velocidad de impacto: |v| = ${CinematicaPhysics.format(th.impactSpeed, 2)} m/s`
        ]
      };
    }

    if (th.apexTime > 0 && Math.abs(model.time - th.apexTime) < 0.06) {
      return {
        title: 'Altura máxima',
        lines: [
          `Condición: vᵧ(t) = 0`,
          `Ecuación: vᵧ(t) = ${CinematicaPhysics.format(th.v0y, 2)} - ${CinematicaPhysics.format(Math.abs(model.g), 2)}·t`,
          `Solución: t = ${CinematicaPhysics.format(th.apexTime, 2)} s`,
          `Altura máxima: y = ${CinematicaPhysics.format(th.maxHeight, 2)} m`,
          `En ese instante: x = ${CinematicaPhysics.format(CinematicaPhysics.xAt(th.apexTime, th.v0x), 2)} m`
        ]
      };
    }

    const midDownTime = th.apexTime + Math.max(0, (th.flightTime - th.apexTime) / 2);
    if (th.flightTime > 0 && model.time >= midDownTime - 0.06 && model.time <= midDownTime + 0.06 && th.flightTime > th.apexTime + 0.15) {
      return {
        title: 'Fase de bajada',
        lines: [
          `Ahora y disminuye porque vᵧ < 0`,
          `Ecuación vertical: y(t) = ${CinematicaPhysics.format(model.y0, 1)} + ${CinematicaPhysics.format(th.v0y, 2)}·t - ${CinematicaPhysics.format(Math.abs(0.5 * model.g), 2)}·t²`,
          `Instante actual: t = ${CinematicaPhysics.format(model.time, 2)} s`,
          `Posición actual: (${CinematicaPhysics.format(pos.x, 2)}, ${CinematicaPhysics.format(y, 2)}) m`,
          `Velocidad actual: (vₓ, vᵧ) = (${CinematicaPhysics.format(vx, 2)}, ${CinematicaPhysics.format(vy, 2)}) m/s`
        ]
      };
    }

    return {
      title: 'Fase inicial del lanzamiento',
      lines: [
        `Ecuaciones usadas:`,
        `x(t) = ${CinematicaPhysics.format(th.v0x, 2)}·t`,
        `y(t) = ${CinematicaPhysics.format(model.y0, 1)} + ${CinematicaPhysics.format(th.v0y, 2)}·t - ${CinematicaPhysics.format(0.5 * model.g, 2)}·t²`,
        `Velocidad inicial: v₀ = ${CinematicaPhysics.format(model.v0, 1)} m/s`,
        `Estado actual: y = ${CinematicaPhysics.format(y, 2)} m, |v| = ${CinematicaPhysics.format(totalSpeed, 2)} m/s`
      ]
    };
  }
}
