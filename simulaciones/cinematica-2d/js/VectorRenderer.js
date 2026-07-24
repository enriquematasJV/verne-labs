/**
 * VectorRenderer — Renderizado de vectores (velocidad, aceleración)
 *
 * Responsabilidades:
 * - Dibujar vectores de velocidad (vx, vy)
 * - Dibujar vector de aceleración (ay = -g)
 * - Dibujar flechas con etiquetas
 * - Dibujar medidas (alcance, altura máxima)
 *
 * Recibe: canvas, constants, model, physics
 * Se integra con SceneRenderer
 */

class VectorRenderer {
  constructor(canvas, constants) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.constants = constants;
  }

  /**
   * Dibujar todos los vectores en la posición actual
   */
  drawVectors(model, pos, vel, viewport) {
    const ballX = viewport.xToPx(pos.x);
    const ballY = viewport.yToPx(pos.y);

    // Vector velocidad X
    const vxScaled = CinematicaPhysics.clamp(
      vel.vx * this.constants.VECTORS.velocityScale,
      -this.constants.VECTORS.velocityClamp,
      this.constants.VECTORS.velocityClamp
    );
    this.drawArrow(
      ballX, ballY,
      ballX + vxScaled, ballY,
      this.constants.COLORS.velocityX,
      'vₓ'
    );

    // Vector velocidad Y
    const vyScaled = CinematicaPhysics.clamp(
      vel.vy * this.constants.VECTORS.velocityScale,
      -this.constants.VECTORS.velocityClamp,
      this.constants.VECTORS.velocityClamp
    );
    this.drawArrow(
      ballX, ballY,
      ballX, ballY - vyScaled,
      this.constants.COLORS.velocityY,
      'vᵧ'
    );

    // Vector aceleración (siempre hacia abajo, magnitud fija)
    this.drawArrow(
      ballX, ballY,
      ballX, ballY + this.constants.VECTORS.accelerationFixed,
      this.constants.COLORS.acceleration,
      'aᵧ = -g'
    );
  }

  /**
   * Dibujar una flecha con etiqueta
   * @param {number} x1 - Inicio X
   * @param {number} y1 - Inicio Y
   * @param {number} x2 - Fin X
   * @param {number} y2 - Fin Y
   * @param {string} color - Color de la flecha
   * @param {string} label - Etiqueta de la flecha
   */
  drawArrow(x1, y1, x2, y2, color, label) {
    const ctx = this.ctx;
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const headSize = this.constants.RENDERING.arrowHeadSize;

    // Línea principal
    ctx.strokeStyle = color;
    ctx.lineWidth = this.constants.RENDERING.vectorLineWidth;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Punta de flecha (dos triángulos)
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(
      x2 - headSize * Math.cos(angle - Math.PI / 6),
      y2 - headSize * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(x2, y2);
    ctx.lineTo(
      x2 - headSize * Math.cos(angle + Math.PI / 6),
      y2 - headSize * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();

    // Etiqueta
    ctx.fillStyle = color;
    ctx.font = this.constants.RENDERING.fontSize.bold;
    ctx.fillText(label, x2 + 8, y2 - 6);
  }

  /**
   * Dibujar medidas (alcance, altura máxima) cuando simulación termina
   */
  drawMeasures(model, pos, th, viewport) {
    if (!model.finished) return;

    const impactX = viewport.xToPx(th.range);
    const impactY = viewport.yToPx(0);

    // Medida de alcance (horizontal)
    this._drawMeasure(
      viewport.xToPx(0), impactY - 30,
      impactX, impactY - 30,
      this.constants.COLORS.velocityX,
      `alcance = ${CinematicaPhysics.format(th.range, 1)} m`
    );

    // Medida de altura máxima (vertical)
    if (th.maxHeight > model.y0 + 0.05) {
      this._drawMeasure(
        viewport.left - 18, viewport.yToPx(0),
        viewport.left - 18, viewport.yToPx(th.maxHeight),
        this.constants.COLORS.velocityY,
        `Hmáx = ${CinematicaPhysics.format(th.maxHeight, 1)} m`
      );
    } else if (model.y0 > 0) {
      this._drawMeasure(
        viewport.left - 18, viewport.yToPx(0),
        viewport.left - 18, viewport.yToPx(model.y0),
        this.constants.COLORS.velocityY,
        `y₀ = ${CinematicaPhysics.format(model.y0, 1)} m`
      );
    }
  }

  /**
   * Dibujar una medida (línea con marcas)
   */
  _drawMeasure(x1, y1, x2, y2, color, text) {
    const ctx = this.ctx;

    // Línea principal
    ctx.strokeStyle = color;
    ctx.lineWidth = this.constants.RENDERING.vectorLineWidth;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Marcas en los extremos
    ctx.beginPath();
    ctx.moveTo(x1, y1 - 7);
    ctx.lineTo(x1, y1 + 7);
    ctx.moveTo(x2, y2 - 7);
    ctx.lineTo(x2, y2 + 7);
    ctx.stroke();

    // Etiqueta en el medio
    ctx.fillStyle = color;
    ctx.font = this.constants.RENDERING.fontSize.bold;
    const textWidth = ctx.measureText(text).width;
    ctx.fillText(text, (x1 + x2) / 2 - textWidth / 2, y1 - 10);
  }
}
