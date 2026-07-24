/**
 * VectorRenderer — Componente genérico para visualizar vectores
 *
 * Responsabilidades:
 * - Dibujar flechas (vectores) desde un punto de origen
 * - Dibujar vectores descompuestos en componentes ortogonales
 * - Dibujar campos de vectores
 *
 * Usa:
 * - Vector2D para cálculos matemáticos
 * - Canvas2DRenderer para dibujar primitivas
 *
 * Ejemplo:
 *   const renderer = new VectorRenderer(canvas, constants);
 *   renderer.drawArrow(x1, y1, x2, y2, color, 'F');
 *   renderer.drawDecomposedVector(origin, vector, axis1, axis2, scale, colors);
 */

class VectorRenderer {
  constructor(canvas, constants = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.renderer = new Canvas2DRenderer(canvas);

    // Configuración visual
    this.config = {
      arrowHeadSize: constants.arrowHeadSize || 10,
      arrowLineWidth: constants.arrowLineWidth || 2,
      labelFontSize: constants.labelFontSize || 14,
      labelFontWeight: constants.labelFontWeight || 'bold',
      labelOffsetX: constants.labelOffsetX || 8,
      labelOffsetY: constants.labelOffsetY || -6,
    };
  }

  /**
   * Dibujar una flecha (vector) desde (x1, y1) a (x2, y2)
   * @param {number} x1 - Origen X
   * @param {number} y1 - Origen Y
   * @param {number} x2 - Destino X
   * @param {number} y2 - Destino Y
   * @param {string} color - Color de la flecha
   * @param {string} label - Etiqueta de la flecha
   */
  drawArrow(x1, y1, x2, y2, color, label = '') {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const headSize = this.config.arrowHeadSize;

    // Dibujar línea
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = this.config.arrowLineWidth;
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();

    // Dibujar cabeza de flecha
    this.ctx.beginPath();
    this.ctx.moveTo(x2, y2);
    this.ctx.lineTo(
      x2 - headSize * Math.cos(angle - Math.PI / 6),
      y2 - headSize * Math.sin(angle - Math.PI / 6)
    );
    this.ctx.moveTo(x2, y2);
    this.ctx.lineTo(
      x2 - headSize * Math.cos(angle + Math.PI / 6),
      y2 - headSize * Math.sin(angle + Math.PI / 6)
    );
    this.ctx.stroke();

    // Dibujar etiqueta
    if (label) {
      this.ctx.fillStyle = color;
      this.ctx.font = `${this.config.labelFontWeight} ${this.config.labelFontSize}px Arial`;
      this.ctx.fillText(label, x2 + this.config.labelOffsetX, y2 + this.config.labelOffsetY);
    }
  }

  /**
   * Dibujar un vector descompuesto en dos componentes ortogonales
   *
   * @param {Object} origin - Punto de origen {x, y}
   * @param {Vector2D} vector - Vector a descomponer
   * @param {Vector2D} axis1 - Primer eje de descomposición
   * @param {Vector2D} axis2 - Segundo eje de descomposición
   * @param {number} scale - Factor de escala para visualización
   * @param {Object} colors - Colores {vector, axis1, axis2}
   */
  drawDecomposedVector(origin, vector, axis1, axis2, scale, colors) {
    if (!vector || !axis1 || !axis2) return;

    // Descomponer vector
    const decomp = vector.decompose(axis1, axis2);

    // Componente en eje 1
    const comp1End = {
      x: origin.x + decomp.parallel.x * scale,
      y: origin.y + decomp.parallel.y * scale,
    };
    this.drawArrow(
      origin.x, origin.y,
      comp1End.x, comp1End.y,
      colors.axis1 || '#0066ff',
      'F∥'
    );

    // Componente en eje 2
    const comp2End = {
      x: origin.x + decomp.perpendicular.x * scale,
      y: origin.y + decomp.perpendicular.y * scale,
    };
    this.drawArrow(
      origin.x, origin.y,
      comp2End.x, comp2End.y,
      colors.axis2 || '#ff6600',
      'F⊥'
    );

    // Vector resultante (opcional: diagonal)
    if (colors.resultant) {
      this.drawArrow(
        origin.x, origin.y,
        origin.x + vector.x * scale,
        origin.y + vector.y * scale,
        colors.resultant,
        'F'
      );
    }
  }

  /**
   * Dibujar múltiples vectores desde un mismo origen
   *
   * @param {Object} origin - Punto de origen {x, y}
   * @param {Array<Object>} vectors - Array de {vector: Vector2D, color, label}
   * @param {number} scale - Factor de escala
   */
  drawVectorSet(origin, vectors, scale) {
    vectors.forEach(v => {
      if (v.vector) {
        this.drawArrow(
          origin.x, origin.y,
          origin.x + v.vector.x * scale,
          origin.y + v.vector.y * scale,
          v.color || '#000000',
          v.label || ''
        );
      }
    });
  }

  /**
   * Dibujar un campo vectorial (malla de vectores)
   *
   * @param {Function} vectorFunction - f(x, y) → Vector2D
   * @param {Object} bounds - {xMin, xMax, yMin, yMax, screenWidth, screenHeight}
   * @param {number} step - Espaciado de la malla
   * @param {string} color - Color de los vectores
   * @param {number} scale - Factor de escala de visualización
   */
  drawVectorField(vectorFunction, bounds, step = 20, color = '#000000', scale = 0.5) {
    const { xMin, xMax, yMin, yMax, screenWidth, screenHeight } = bounds;

    const xStep = ((xMax - xMin) / screenWidth) * step;
    const yStep = ((yMax - yMin) / screenHeight) * step;

    for (let x = xMin; x <= xMax; x += xStep) {
      for (let y = yMin; y <= yMax; y += yStep) {
        const vec = vectorFunction(x, y);
        if (vec && vec.x !== undefined && vec.y !== undefined) {
          const screenX = xMin + (x - xMin) * (screenWidth / (xMax - xMin));
          const screenY = yMin + (y - yMin) * (screenHeight / (yMax - yMin));

          this.drawArrow(
            screenX, screenY,
            screenX + vec.x * scale,
            screenY + vec.y * scale,
            color
          );
        }
      }
    }
  }

  /**
   * Obtener contexto de canvas para operaciones personalizadas
   */
  getContext() {
    return this.ctx;
  }

  /**
   * Obtener Canvas2DRenderer para acceso a primitivas
   */
  getRenderer() {
    return this.renderer;
  }

  // ========================================
  // Métodos delegados a Canvas2DRenderer
  // para compatibilidad con código existente
  // ========================================

  clear(color) {
    return this.renderer.clear(color);
  }

  drawLine(x1, y1, x2, y2, color, lineWidth) {
    return this.renderer.drawLine(x1, y1, x2, y2, color, lineWidth);
  }

  drawRect(x, y, width, height, color, borderColor, borderWidth) {
    return this.renderer.drawRect(x, y, width, height, color, borderColor, borderWidth);
  }

  drawCircle(x, y, radius, color, borderColor, borderWidth) {
    return this.renderer.drawCircle(x, y, radius, color, borderColor, borderWidth);
  }

  drawPolygon(points, fillColor, strokeColor, lineWidth) {
    return this.renderer.drawPolygon(points, fillColor, strokeColor, lineWidth);
  }

  drawText(text, x, y, color, fontSize, fontFamily) {
    return this.renderer.drawText(text, x, y, color, fontSize, fontFamily);
  }

  setTransform(scaleX, scaleY, translateX, translateY) {
    return this.renderer.setTransform(scaleX, scaleY, translateX, translateY);
  }

  resetTransform() {
    return this.renderer.resetTransform();
  }
}
