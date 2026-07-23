/**
 * GraphRenderer — Componente modular 100% para dibujar gráficos
 *
 * Encapsula TODA la lógica de dibujo:
 * - Grid y ejes (coordenadas)
 * - Limpeza
 * - Escalado
 * - Conversión de coordenadas
 *
 * Uso:
 *   const graph = new GraphRenderer(canvasOrSvgElement, {
 *     xMin: -10, xMax: 10,
 *     yMin: -10, yMax: 10,
 *     width: 520,
 *     height: 520
 *   });
 *   graph.drawGridAndAxes();
 */

class GraphRenderer {
  constructor(element, options = {}) {
    this.element = element;
    this.type = element.tagName === 'CANVAS' ? 'canvas' : 'svg';

    // Coordenadas del sistema
    this.xMin = options.xMin || -10;
    this.xMax = options.xMax || 10;
    this.yMin = options.yMin || -10;
    this.yMax = options.yMax || 10;

    // Margen (para labs que necesitan espacio para etiquetas)
    this.margin = options.margin || 0;

    // Obtener dimensiones reales del elemento
    // Para Canvas: usar canvas.width/height (propiedades del elemento)
    // Para SVG: usar el viewBox si existe, sino getBoundingClientRect
    if (this.type === 'canvas') {
      this.width = element.width;
      this.height = element.height;
    } else {
      // Para SVG, usar viewBox
      if (element.viewBox && element.viewBox.baseVal) {
        this.width = element.viewBox.baseVal.width;
        this.height = element.viewBox.baseVal.height;
      } else {
        // Fallback: usar getBoundingClientRect
        const rect = element.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;
      }
    }

    // Obtener variables CSS globales
    const root = getComputedStyle(document.documentElement);
    this.gridColor = root.getPropertyValue('--grid-color').trim() || '#e2e8f0';
    this.gridLineWidth = parseFloat(root.getPropertyValue('--grid-line-width')) || 0.5;
    this.axisColor = root.getPropertyValue('--axis-color').trim() || '#94a3b8';
    this.axisLineWidth = parseFloat(root.getPropertyValue('--axis-line-width')) || 1;

    // Configuración específica del tipo
    if (this.type === 'canvas') {
      this.ctx = element.getContext('2d');
    }
  }

  /**
   * Actualizar dimensiones (para canvas que se redimensiona)
   */
  updateDimensions() {
    if (this.type === 'canvas') {
      this.width = this.element.width;
      this.height = this.element.height;
    }
  }

  /**
   * Limpiar el gráfico
   */
  clear() {
    if (this.type === 'canvas') {
      this.updateDimensions();
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillRect(0, 0, this.width, this.height);
    } else {
      this.element.innerHTML = '';
    }
  }

  /**
   * Convertir coordenada X matemática a píxeles
   */
  xToPixel(x) {
    const innerWidth = this.width - 2 * this.margin;
    return this.margin + ((x - this.xMin) / (this.xMax - this.xMin)) * innerWidth;
  }

  /**
   * Convertir coordenada Y matemática a píxeles (invertida)
   */
  yToPixel(y) {
    const innerHeight = this.height - 2 * this.margin;
    return this.height - this.margin - ((y - this.yMin) / (this.yMax - this.yMin)) * innerHeight;
  }

  /**
   * Convertir píxel X a coordenada matemática
   */
  pixelToX(px) {
    const innerWidth = this.width - 2 * this.margin;
    return this.xMin + ((px - this.margin) / innerWidth) * (this.xMax - this.xMin);
  }

  /**
   * Convertir píxel Y a coordenada matemática
   */
  pixelToY(py) {
    const innerHeight = this.height - 2 * this.margin;
    return this.yMin + ((this.height - this.margin - py) / innerHeight) * (this.yMax - this.yMin);
  }

  /**
   * Calcular un paso "bonito" para el grid
   */
  niceStep(raw) {
    const power = Math.pow(10, Math.floor(Math.log10(raw)));
    const normalized = raw / power;
    if (normalized < 1.5) return power;
    if (normalized < 3.5) return 2 * power;
    if (normalized < 7.5) return 5 * power;
    return 10 * power;
  }

  /**
   * Actualizar viewport (para vistas dinámicas)
   */
  setViewport(xMin, xMax, yMin, yMax) {
    this.xMin = xMin;
    this.xMax = xMax;
    this.yMin = yMin;
    this.yMax = yMax;
  }

  /**
   * Dibujar grid y ejes
   */
  drawGridAndAxes() {
    this.clear();

    // Calcular pasos del grid
    const xStep = this.niceStep((this.xMax - this.xMin) / 12);
    const yStep = this.niceStep((this.yMax - this.yMin) / 10);

    // Generar ticks
    const ticksX = [];
    for (let i = Math.ceil(this.xMin / xStep) * xStep; i <= this.xMax; i += xStep) {
      ticksX.push(i);
    }

    const ticksY = [];
    for (let i = Math.ceil(this.yMin / yStep) * yStep; i <= this.yMax; i += yStep) {
      ticksY.push(i);
    }

    if (this.type === 'canvas') {
      this._drawGridAxesCanvas(ticksX, ticksY);
    } else {
      this._drawGridAxesSVG(ticksX, ticksY);
    }
  }

  /**
   * Dibujar grid y ejes en canvas
   */
  _drawGridAxesCanvas(ticksX, ticksY) {
    const top = this.margin;
    const bottom = this.height - this.margin;
    const left = this.margin;
    const right = this.width - this.margin;

    // Grid vertical
    this.ctx.lineWidth = this.gridLineWidth;
    this.ctx.strokeStyle = this.gridColor;
    for (const x of ticksX) {
      const px = this.xToPixel(x);
      this.ctx.beginPath();
      this.ctx.moveTo(px, top);
      this.ctx.lineTo(px, bottom);
      this.ctx.stroke();
    }

    // Grid horizontal
    for (const y of ticksY) {
      const py = this.yToPixel(y);
      this.ctx.beginPath();
      this.ctx.moveTo(left, py);
      this.ctx.lineTo(right, py);
      this.ctx.stroke();
    }

    // Eje X
    if (this.yMin <= 0 && this.yMax >= 0) {
      const y0 = this.yToPixel(0);
      this.ctx.lineWidth = this.axisLineWidth;
      this.ctx.strokeStyle = this.axisColor;
      this.ctx.beginPath();
      this.ctx.moveTo(left, y0);
      this.ctx.lineTo(right, y0);
      this.ctx.stroke();
    }

    // Eje Y
    if (this.xMin <= 0 && this.xMax >= 0) {
      const x0 = this.xToPixel(0);
      this.ctx.lineWidth = this.axisLineWidth;
      this.ctx.strokeStyle = this.axisColor;
      this.ctx.beginPath();
      this.ctx.moveTo(x0, top);
      this.ctx.lineTo(x0, bottom);
      this.ctx.stroke();
    }
  }

  /**
   * Dibujar grid y ejes en SVG
   */
  _drawGridAxesSVG(ticksX, ticksY) {
    const top = this.margin;
    const bottom = this.height - this.margin;
    const left = this.margin;
    const right = this.width - this.margin;

    // Helper para crear línea SVG
    const createLine = (x1, y1, x2, y2, stroke, strokeWidth) => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x1);
      line.setAttribute('y1', y1);
      line.setAttribute('x2', x2);
      line.setAttribute('y2', y2);
      line.setAttribute('stroke', stroke);
      line.setAttribute('stroke-width', strokeWidth);
      // Evitar distorsión al hacer zoom del navegador
      line.setAttribute('vector-effect', 'non-scaling-stroke');
      return line;
    };

    // Grid vertical
    for (const x of ticksX) {
      const px = this.xToPixel(x);
      this.element.appendChild(createLine(px, top, px, bottom, this.gridColor, this.gridLineWidth));
    }

    // Grid horizontal
    for (const y of ticksY) {
      const py = this.yToPixel(y);
      this.element.appendChild(createLine(left, py, right, py, this.gridColor, this.gridLineWidth));
    }

    // Eje X
    if (this.yMin <= 0 && this.yMax >= 0) {
      const y0 = this.yToPixel(0);
      this.element.appendChild(createLine(left, y0, right, y0, this.axisColor, this.axisLineWidth));
    }

    // Eje Y
    if (this.xMin <= 0 && this.xMax >= 0) {
      const x0 = this.xToPixel(0);
      this.element.appendChild(createLine(x0, top, x0, bottom, this.axisColor, this.axisLineWidth));
    }
  }

  /**
   * Obtener contexto de dibujo (para canvas)
   */
  getContext() {
    return this.ctx;
  }

  /**
   * Crear elemento SVG (para SVG)
   */
  createSVGElement(tag, attrs = {}) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [key, value] of Object.entries(attrs)) {
      el.setAttribute(key, String(value));
    }
    return el;
  }

  /**
   * Añadir elemento al gráfico SVG
   */
  appendElement(element) {
    this.element.appendChild(element);
  }
}
