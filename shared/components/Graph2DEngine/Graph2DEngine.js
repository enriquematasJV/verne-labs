/**
 * Graph2DEngine — Graficador universal 2D para cualquier tipo de datos
 *
 * Soporta simultáneamente:
 * - Funciones explícitas f(x) parseadas
 * - Funciones parametrizadas (x(t), y(t))
 * - Series temporales (datos acumulativos)
 * - Nubes de puntos estáticas
 * - Trayectorias dinámicas (puntos en tiempo real)
 * - Múltiples gráficas en el mismo viewport
 *
 * Características:
 * - Pan/zoom interactivo
 * - Escala automática en XY
 * - Grid adaptativo
 * - Redibujo eficiente
 * - Viewport compartido entre todas las gráficas
 */

class Graph2DEngine {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // Configuración visual
    this.config = {
      showGrid: options.showGrid ?? true,
      showAxes: options.showAxes ?? true,
      backgroundColor: options.backgroundColor ?? 'white',
      gridColor: options.gridColor ?? '#e2e8f0',
      axisColor: options.axisColor ?? '#94a3b8',
      margin: options.margin ?? { left: 48, right: 18, top: 16, bottom: 34 },
    };

    // Viewport: qué rango XY se ve en pantalla
    this.viewport = {
      xMin: options.xMin ?? -10,
      xMax: options.xMax ?? 10,
      yMin: options.yMin ?? -10,
      yMax: options.yMax ?? 10,
    };

    // Auto-escala: ajusta viewport según datos
    this.autoScale = {
      enabled: options.autoScale ?? true,
      paddingPercent: options.autoScalePadding ?? 0.1,
    };

    // Colecciones de gráficas
    this.plots = new Map();
    this.nextPlotId = 0;

    // Estado de pan/zoom
    this.pan = { x: 0, y: 0 };
    this.zoom = 1;

    // DPI awareness
    this.dpr = window.devicePixelRatio || 1;

    // Inicializar dimensiones del canvas basadas en CSS
    this._setupCanvas();
  }

  /**
   * Agregar gráfica de función explícita f(x)
   * @param {Function} fn - Función compilada (ej: VerneMath.compile('x^2'))
   * @param {Object} options - {samples, color, lineWidth, label}
   */
  addFunctionPlot(fn, options = {}) {
    const {
      samples = 200,
      color = '#3b82f6',
      lineWidth = 2,
      label = `f${this.nextPlotId}`,
    } = options;

    const plotId = `func-${this.nextPlotId++}`;
    this.plots.set(plotId, {
      type: 'function',
      fn,
      samples,
      color,
      lineWidth,
      label,
      points: [], // Se calcula en render()
    });
    return plotId;
  }

  /**
   * Agregar gráfica de función parametrizada (x(t), y(t))
   * @param {Function} xFunc - x = xFunc(t)
   * @param {Function} yFunc - y = yFunc(t)
   * @param {Object} options - {tMin, tMax, step, color, lineWidth, label}
   */
  addParametricPlot(xFunc, yFunc, options = {}) {
    const {
      tMin = 0,
      tMax = 10,
      step = 0.1,
      color = '#ef4444',
      lineWidth = 2,
      label = `param${this.nextPlotId}`,
    } = options;

    const plotId = `param-${this.nextPlotId++}`;
    const points = [];
    for (let t = tMin; t <= tMax; t += step) {
      points.push({ x: xFunc(t), y: yFunc(t), t });
    }

    this.plots.set(plotId, {
      type: 'parametric',
      xFunc,
      yFunc,
      tMin,
      tMax,
      step,
      color,
      lineWidth,
      label,
      points,
    });
    return plotId;
  }

  /**
   * Agregar gráfica de serie temporal (datos acumulativos)
   * @param {Array} data - [{time: 0, value1: 10, value2: 20}, ...]
   * @param {Object} options - {xKey, yKey, color, lineWidth, label}
   */
  addTimeSeriesPlot(data, options = {}) {
    const {
      xKey = 'time',
      yKey = 'value',
      color = '#22c55e',
      lineWidth = 2,
      label = `series${this.nextPlotId}`,
    } = options;

    const plotId = `timeseries-${this.nextPlotId++}`;
    this.plots.set(plotId, {
      type: 'timeseries',
      data,
      xKey,
      yKey,
      color,
      lineWidth,
      label,
    });
    return plotId;
  }

  /**
   * Agregar gráfica de serie temporal MÚLTIPLE (multi-línea)
   * @param {Array} data - [{time: 0, verdes: 10, rojos: 5, azules: 3}, ...]
   * @param {Object} options - {xKey, yKeys, colors, lineWidth, label}
   */
  addMultiTimeSeriesPlot(data, options = {}) {
    const {
      xKey = 'time',
      yKeys = ['y'],
      colors = ['#3b82f6', '#ef4444', '#22c55e'],
      lineWidth = 2,
      label = `multiseries${this.nextPlotId}`,
    } = options;

    const plotId = `multiseries-${this.nextPlotId++}`;
    this.plots.set(plotId, {
      type: 'multitimeseries',
      data,
      xKey,
      yKeys,
      colors,
      lineWidth,
      label,
    });
    return plotId;
  }

  /**
   * Agregar nube de puntos estática
   * @param {Array} points - [{x: 1, y: 2}, {x: 3, y: 4}, ...]
   * @param {Object} options - {color, size, label}
   */
  addScatterPlot(points, options = {}) {
    const {
      color = '#8b5cf6',
      size = 4,
      label = `scatter${this.nextPlotId}`,
    } = options;

    const plotId = `scatter-${this.nextPlotId++}`;
    this.plots.set(plotId, {
      type: 'scatter',
      points,
      color,
      size,
      label,
    });
    return plotId;
  }

  /**
   * Agregar trayectoria dinámica (se va dibujando en tiempo real)
   * @param {Object} options - {color, lineWidth, maxPoints, label}
   */
  addDynamicTrajectory(options = {}) {
    const {
      color = '#06b6d4',
      lineWidth = 2,
      maxPoints = 1000, // Limita memoria
      label = `trajectory${this.nextPlotId}`,
    } = options;

    const plotId = `trajectory-${this.nextPlotId++}`;
    this.plots.set(plotId, {
      type: 'trajectory',
      color,
      lineWidth,
      maxPoints,
      label,
      points: [],
    });
    return plotId;
  }

  /**
   * Agregar punto a una trayectoria dinámica
   */
  addPointToTrajectory(trajectoryId, x, y) {
    const plot = this.plots.get(trajectoryId);
    if (!plot || plot.type !== 'trajectory') return;

    plot.points.push({ x, y });

    // Limitar tamaño
    if (plot.points.length > plot.maxPoints) {
      plot.points.shift();
    }
  }

  /**
   * Actualizar datos de una gráfica de serie temporal
   */
  updateTimeSeriesData(plotId, newData) {
    const plot = this.plots.get(plotId);
    if (plot && (plot.type === 'timeseries' || plot.type === 'multitimeseries')) {
      plot.data = newData;
    }
  }

  /**
   * Actualizar puntos de una nube de puntos
   */
  updateScatterPlot(plotId, newPoints) {
    const plot = this.plots.get(plotId);
    if (plot && plot.type === 'scatter') {
      plot.points = newPoints;
    }
  }

  /**
   * Obtener información del viewport actual
   */
  getViewport() {
    return { ...this.viewport };
  }

  /**
   * Establecer viewport manualmente
   */
  setViewport(xMin, xMax, yMin, yMax) {
    this.viewport = { xMin, xMax, yMin, yMax };
  }

  /**
   * Pan: desplazar la vista
   */
  panView(deltaX, deltaY) {
    const xRange = this.viewport.xMax - this.viewport.xMin;
    const yRange = this.viewport.yMax - this.viewport.yMin;

    this.viewport.xMin -= deltaX * xRange;
    this.viewport.xMax -= deltaX * xRange;
    this.viewport.yMin += deltaY * yRange;
    this.viewport.yMax += deltaY * yRange;
  }

  /**
   * Zoom: ampliar/reducir alrededor de un punto
   */
  zoomView(factor, centerX = 0.5, centerY = 0.5) {
    const xRange = this.viewport.xMax - this.viewport.xMin;
    const yRange = this.viewport.yMax - this.viewport.yMin;

    const xCenter = this.viewport.xMin + xRange * centerX;
    const yCenter = this.viewport.yMin + yRange * centerY;

    const newXRange = xRange / factor;
    const newYRange = yRange / factor;

    this.viewport.xMin = xCenter - (newXRange * centerX);
    this.viewport.xMax = xCenter + (newXRange * (1 - centerX));
    this.viewport.yMin = yCenter - (newYRange * centerY);
    this.viewport.yMax = yCenter + (newYRange * (1 - centerY));
  }

  /**
   * Auto-escala: ajusta viewport según datos
   */
  autoScaleViewport() {
    if (!this.autoScale.enabled) return;

    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let hasData = false;

    // Recopilar bounds de todos los plots
    for (const plot of this.plots.values()) {
      const bounds = this._getPlotBounds(plot);
      if (bounds) {
        hasData = true;
        minX = Math.min(minX, bounds.minX);
        maxX = Math.max(maxX, bounds.maxX);
        minY = Math.min(minY, bounds.minY);
        maxY = Math.max(maxY, bounds.maxY);
      }
    }

    if (!hasData) return;

    // Agregar padding
    const padding = this.autoScale.paddingPercent;
    const xPad = (maxX - minX) * padding;
    const yPad = (maxY - minY) * padding;

    this.viewport.xMin = minX - xPad;
    this.viewport.xMax = maxX + xPad;
    this.viewport.yMin = minY - yPad;
    this.viewport.yMax = maxY + yPad;

    // Evitar viewport inválido
    if (this.viewport.xMin === this.viewport.xMax) {
      this.viewport.xMin -= 1;
      this.viewport.xMax += 1;
    }
    if (this.viewport.yMin === this.viewport.yMax) {
      this.viewport.yMin -= 1;
      this.viewport.yMax += 1;
    }
  }

  /**
   * Obtener bounds de un plot
   */
  _getPlotBounds(plot) {
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let hasData = false;

    if (plot.type === 'function') {
      // Bounds por viewport actual
      minX = this.viewport.xMin;
      maxX = this.viewport.xMax;
      minY = this.viewport.yMin;
      maxY = this.viewport.yMax;
      hasData = true;
    } else if (plot.type === 'parametric') {
      plot.points.forEach(p => {
        if (Number.isFinite(p.x) && Number.isFinite(p.y)) {
          hasData = true;
          minX = Math.min(minX, p.x);
          maxX = Math.max(maxX, p.x);
          minY = Math.min(minY, p.y);
          maxY = Math.max(maxY, p.y);
        }
      });
    } else if (plot.type === 'timeseries') {
      plot.data.forEach(row => {
        const x = row[plot.xKey];
        const y = row[plot.yKey];
        if (Number.isFinite(x) && Number.isFinite(y)) {
          hasData = true;
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        }
      });
    } else if (plot.type === 'multitimeseries') {
      plot.data.forEach(row => {
        const x = row[plot.xKey];
        plot.yKeys.forEach(key => {
          const y = row[key];
          if (Number.isFinite(x) && Number.isFinite(y)) {
            hasData = true;
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
          }
        });
      });
    } else if (plot.type === 'scatter') {
      plot.points.forEach(p => {
        if (Number.isFinite(p.x) && Number.isFinite(p.y)) {
          hasData = true;
          minX = Math.min(minX, p.x);
          maxX = Math.max(maxX, p.x);
          minY = Math.min(minY, p.y);
          maxY = Math.max(maxY, p.y);
        }
      });
    } else if (plot.type === 'trajectory') {
      plot.points.forEach(p => {
        if (Number.isFinite(p.x) && Number.isFinite(p.y)) {
          hasData = true;
          minX = Math.min(minX, p.x);
          maxX = Math.max(maxX, p.x);
          minY = Math.min(minY, p.y);
          maxY = Math.max(maxY, p.y);
        }
      });
    }

    return hasData ? { minX, maxX, minY, maxY } : null;
  }

  /**
   * Renderizar todo en el canvas
   */
  render() {
    this._setupCanvas();
    this._drawBackground();
    if (this.config.showGrid) this._drawGrid();
    if (this.config.showAxes) this._drawAxes();

    // Dibujar todos los plots
    for (const plot of this.plots.values()) {
      this._drawPlot(plot);
    }
  }

  /**
   * Configurar canvas con DPI awareness
   */
  _setupCanvas() {
    const rect = this.canvas.getBoundingClientRect();
    const cssWidth = Math.max(1, rect.width);
    const cssHeight = Math.max(1, rect.height);

    if (
      this.canvas.width !== Math.floor(cssWidth * this.dpr) ||
      this.canvas.height !== Math.floor(cssHeight * this.dpr)
    ) {
      this.canvas.width = Math.floor(cssWidth * this.dpr);
      this.canvas.height = Math.floor(cssHeight * this.dpr);
    }

    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  /**
   * Convertir coordenada matemática (x, y) a coordenada de canvas (px, py)
   */
  mathToCanvas(x, y) {
    const rect = this.canvas.getBoundingClientRect();
    const cssWidth = rect.width;
    const cssHeight = rect.height;
    const m = this.config.margin;

    const plotW = cssWidth - m.left - m.right;
    const plotH = cssHeight - m.top - m.bottom;

    const px =
      m.left +
      ((x - this.viewport.xMin) / (this.viewport.xMax - this.viewport.xMin)) *
        plotW;
    const py =
      m.top +
      plotH -
      ((y - this.viewport.yMin) / (this.viewport.yMax - this.viewport.yMin)) *
        plotH;

    return { px, py };
  }

  /**
   * Convertir coordenada de canvas a matemática
   */
  canvasToMath(px, py) {
    const rect = this.canvas.getBoundingClientRect();
    const cssWidth = rect.width;
    const cssHeight = rect.height;
    const m = this.config.margin;

    const plotW = cssWidth - m.left - m.right;
    const plotH = cssHeight - m.top - m.bottom;

    const x =
      this.viewport.xMin +
      ((px - m.left) / plotW) * (this.viewport.xMax - this.viewport.xMin);
    const y =
      this.viewport.yMax -
      ((py - m.top) / plotH) * (this.viewport.yMax - this.viewport.yMin);

    return { x, y };
  }

  /**
   * Dibujar fondo
   */
  _drawBackground() {
    const rect = this.canvas.getBoundingClientRect();
    const cssWidth = rect.width;
    const cssHeight = rect.height;

    this.ctx.fillStyle = this.config.backgroundColor;
    this.ctx.fillRect(0, 0, cssWidth, cssHeight);
  }

  /**
   * Calcular un paso "bonito" para el grid
   */
  _niceStep(raw) {
    const power = Math.pow(10, Math.floor(Math.log10(raw)));
    const normalized = raw / power;
    if (normalized < 1.5) return power;
    if (normalized < 3.5) return 2 * power;
    if (normalized < 7.5) return 5 * power;
    return 10 * power;
  }

  /**
   * Dibujar grid inteligente basado en viewport
   */
  _drawGrid() {
    const rect = this.canvas.getBoundingClientRect();
    const cssWidth = rect.width;
    const cssHeight = rect.height;
    const m = this.config.margin;

    const plotW = cssWidth - m.left - m.right;
    const plotH = cssHeight - m.top - m.bottom;

    // Calcular pasos del grid
    const xStep = this._niceStep((this.viewport.xMax - this.viewport.xMin) / 6);
    const yStep = this._niceStep((this.viewport.yMax - this.viewport.yMin) / 6);

    // Generar ticks
    const ticksX = [];
    for (let i = Math.ceil(this.viewport.xMin / xStep) * xStep; i <= this.viewport.xMax; i += xStep) {
      ticksX.push(i);
    }

    const ticksY = [];
    for (let i = Math.ceil(this.viewport.yMin / yStep) * yStep; i <= this.viewport.yMax; i += yStep) {
      ticksY.push(i);
    }

    this.ctx.strokeStyle = '#cbd5e1';
    this.ctx.lineWidth = 1;

    // Grid vertical
    for (const x of ticksX) {
      const { px } = this._mathToCanvas(x, 0);
      this.ctx.beginPath();
      this.ctx.moveTo(px, m.top);
      this.ctx.lineTo(px, m.top + plotH);
      this.ctx.stroke();
    }

    // Grid horizontal
    for (const y of ticksY) {
      const { py } = this._mathToCanvas(0, y);
      this.ctx.beginPath();
      this.ctx.moveTo(m.left, py);
      this.ctx.lineTo(m.left + plotW, py);
      this.ctx.stroke();
    }
  }

  /**
   * Dibujar ejes
   */
  _drawAxes() {
    const rect = this.canvas.getBoundingClientRect();
    const cssWidth = rect.width;
    const cssHeight = rect.height;
    const m = this.config.margin;

    const plotW = cssWidth - m.left - m.right;
    const plotH = cssHeight - m.top - m.bottom;

    this.ctx.strokeStyle = '#334155';
    this.ctx.lineWidth = 2;

    // Eje X: dibuja línea horizontal en y=0 (si está visible)
    if (this.viewport.yMin <= 0 && this.viewport.yMax >= 0) {
      const { py } = this._mathToCanvas(0, 0);
      this.ctx.beginPath();
      this.ctx.moveTo(m.left, py);
      this.ctx.lineTo(m.left + plotW, py);
      this.ctx.stroke();
    }

    // Eje Y: dibuja línea vertical en x=0 (si está visible)
    if (this.viewport.xMin <= 0 && this.viewport.xMax >= 0) {
      const { px } = this._mathToCanvas(0, 0);
      this.ctx.beginPath();
      this.ctx.moveTo(px, m.top);
      this.ctx.lineTo(px, m.top + plotH);
      this.ctx.stroke();
    }

    // Etiquetas eje Y
    this.ctx.fillStyle = '#334155';
    this.ctx.font = '12px system-ui';
    this.ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const val = this.viewport.yMin + ((this.viewport.yMax - this.viewport.yMin) / 5) * i;
      const y = m.top + plotH - (plotH / 5) * i;
      this.ctx.fillText(val.toFixed(1), m.left - 8, y + 4);
    }

    // Etiquetas eje X
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'top';
    for (let i = 0; i <= 5; i++) {
      const val = this.viewport.xMin + ((this.viewport.xMax - this.viewport.xMin) / 5) * i;
      const x = m.left + (plotW / 5) * i;
      this.ctx.fillText(val.toFixed(1), x, m.top + plotH + 8);
    }
  }

  /**
   * Dibujar un plot
   */
  _drawPlot(plot) {
    if (plot.type === 'function') {
      this._drawFunctionPlot(plot);
    } else if (plot.type === 'parametric') {
      this._drawParametricPlot(plot);
    } else if (plot.type === 'timeseries') {
      this._drawTimeSeriesPlot(plot);
    } else if (plot.type === 'multitimeseries') {
      this._drawMultiTimeSeriesPlot(plot);
    } else if (plot.type === 'scatter') {
      this._drawScatterPlot(plot);
    } else if (plot.type === 'trajectory') {
      this._drawTrajectoryPlot(plot);
    }
  }

  /**
   * Dibujar función f(x)
   */
  _drawFunctionPlot(plot) {
    const rect = this.canvas.getBoundingClientRect();
    const m = this.config.margin;
    const plotW = rect.width - m.left - m.right;

    const points = [];
    for (let i = 0; i < plot.samples; i++) {
      const x = this.viewport.xMin + ((this.viewport.xMax - this.viewport.xMin) / (plot.samples - 1)) * i;
      const y = plot.fn(x);

      if (Number.isFinite(y)) {
        points.push({ x, y });
      }
    }

    if (points.length === 0) return;

    this.ctx.strokeStyle = plot.color;
    this.ctx.lineWidth = plot.lineWidth;
    this.ctx.beginPath();

    for (let i = 0; i < points.length; i++) {
      const { px, py } = this._mathToCanvas(points[i].x, points[i].y);
      if (i === 0) {
        this.ctx.moveTo(px, py);
      } else {
        this.ctx.lineTo(px, py);
      }
    }

    this.ctx.stroke();
  }

  /**
   * Dibujar función parametrizada
   */
  _drawParametricPlot(plot) {
    if (plot.points.length === 0) return;

    this.ctx.strokeStyle = plot.color;
    this.ctx.lineWidth = plot.lineWidth;
    this.ctx.beginPath();

    for (let i = 0; i < plot.points.length; i++) {
      const { px, py } = this._mathToCanvas(plot.points[i].x, plot.points[i].y);
      if (i === 0) {
        this.ctx.moveTo(px, py);
      } else {
        this.ctx.lineTo(px, py);
      }
    }

    this.ctx.stroke();
  }

  /**
   * Dibujar serie temporal
   */
  _drawTimeSeriesPlot(plot) {
    if (plot.data.length === 0) return;

    this.ctx.strokeStyle = plot.color;
    this.ctx.lineWidth = plot.lineWidth;
    this.ctx.beginPath();

    for (let i = 0; i < plot.data.length; i++) {
      const x = plot.data[i][plot.xKey];
      const y = plot.data[i][plot.yKey];

      if (Number.isFinite(x) && Number.isFinite(y)) {
        const { px, py } = this._mathToCanvas(x, y);
        if (i === 0) {
          this.ctx.moveTo(px, py);
        } else {
          this.ctx.lineTo(px, py);
        }
      }
    }

    this.ctx.stroke();
  }

  /**
   * Dibujar serie temporal múltiple
   */
  _drawMultiTimeSeriesPlot(plot) {
    if (plot.data.length === 0) return;

    plot.yKeys.forEach((yKey, keyIndex) => {
      const color = plot.colors[keyIndex] || '#3b82f6';

      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = plot.lineWidth;
      this.ctx.beginPath();

      for (let i = 0; i < plot.data.length; i++) {
        const x = plot.data[i][plot.xKey];
        const y = plot.data[i][yKey];

        if (Number.isFinite(x) && Number.isFinite(y)) {
          const { px, py } = this._mathToCanvas(x, y);
          if (i === 0) {
            this.ctx.moveTo(px, py);
          } else {
            this.ctx.lineTo(px, py);
          }
        }
      }

      this.ctx.stroke();
    });
  }

  /**
   * Dibujar nube de puntos
   */
  _drawScatterPlot(plot) {
    this.ctx.fillStyle = plot.color;

    for (const point of plot.points) {
      if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) continue;

      const { px, py } = this._mathToCanvas(point.x, point.y);

      // Dibuja círculo
      this.ctx.beginPath();
      this.ctx.arc(px, py, plot.size, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  /**
   * Dibujar trayectoria dinámica
   */
  _drawTrajectoryPlot(plot) {
    if (plot.points.length === 0) return;

    this.ctx.strokeStyle = plot.color;
    this.ctx.lineWidth = plot.lineWidth;
    this.ctx.beginPath();

    for (let i = 0; i < plot.points.length; i++) {
      const { px, py } = this._mathToCanvas(plot.points[i].x, plot.points[i].y);
      if (i === 0) {
        this.ctx.moveTo(px, py);
      } else {
        this.ctx.lineTo(px, py);
      }
    }

    this.ctx.stroke();
  }

  /**
   * Convertir coordenada matemática a canvas (INTERNA - respeta DPI)
   */
  _mathToCanvas(x, y) {
    const rect = this.canvas.getBoundingClientRect();
    const cssWidth = rect.width;
    const cssHeight = rect.height;
    const m = this.config.margin;

    const plotW = cssWidth - m.left - m.right;
    const plotH = cssHeight - m.top - m.bottom;

    const px =
      m.left +
      ((x - this.viewport.xMin) / (this.viewport.xMax - this.viewport.xMin)) *
        plotW;
    const py =
      m.top +
      plotH -
      ((y - this.viewport.yMin) / (this.viewport.yMax - this.viewport.yMin)) *
        plotH;

    return { px, py };
  }

  /**
   * Limpiar todo
   */
  clear() {
    this.plots.clear();
    this.nextPlotId = 0;
  }

  /**
   * Eliminar un plot específico
   */
  removePlot(plotId) {
    this.plots.delete(plotId);
  }
}
