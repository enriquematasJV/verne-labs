/**
 * InequalityRegionRenderer — Dibuja regiones sombreadas de inecuaciones
 *
 * Encapsula la lógica de sombreado de áreas que satisfacen inecuaciones.
 *
 * Uso:
 *   const renderer = new InequalityRegionRenderer(canvasElement, graphEngine, {
 *     step: 4,
 *     fillColor: "rgba(37, 99, 235, 0.18)"
 *   });
 *   renderer.drawRegion(inequalities);
 */

class InequalityRegionRenderer {
  constructor(canvasElement, graphEngine, options = {}) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.graphEngine = graphEngine;
    this.step = options.step || 4;
    this.fillColor = options.fillColor || "rgba(37, 99, 235, 0.18)";
  }

  /**
   * Evaluar si un punto (x, y) satisface una inecuación
   */
  satisfies(ineq, x, y) {
    if (ineq.kind === "x") {
      if (ineq.op === "<") return x < ineq.value;
      if (ineq.op === "<=") return x <= ineq.value;
      if (ineq.op === ">") return x > ineq.value;
      return x >= ineq.value;
    }

    const fy = ineq.fn(x);
    if (!Number.isFinite(fy)) return false;

    if (ineq.op === "<") return y < fy;
    if (ineq.op === "<=") return y <= fy;
    if (ineq.op === ">") return y > fy;
    return y >= fy;
  }

  /**
   * Dibujar rectángulo en canvas
   */
  drawRect(x, y, width, height) {
    this.ctx.fillStyle = this.fillColor;
    this.ctx.fillRect(x, y, width, height);
  }

  /**
   * Dibujar la región donde se satisfacen TODAS las inecuaciones
   */
  drawRegion(inequalities) {
    if (!inequalities || inequalities.length === 0) return;

    const width = this.canvas.width;
    const height = this.canvas.height;

    for (let py = 0; py < height; py += this.step) {
      for (let px = 0; px < width; px += this.step) {
        const cx = px + this.step / 2;
        const cy = py + this.step / 2;

        // Convertir píxeles a coordenadas matemáticas usando Graph2DEngine
        const coords = this.graphEngine.canvasToMath(cx, cy);
        const mathX = coords.x;
        const mathY = coords.y;

        // Verificar si este píxel satisface TODAS las inecuaciones
        const satisfiesAll = inequalities.every((ineq) =>
          this.satisfies(ineq, mathX, mathY)
        );

        if (satisfiesAll) {
          this.drawRect(px, py, this.step, this.step);
        }
      }
    }
  }
}
