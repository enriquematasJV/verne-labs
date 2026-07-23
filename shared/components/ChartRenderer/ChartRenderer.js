class ChartRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  drawLineChart(data, options = {}) {
    const {
      xKey = 'x',
      yKeys = ['y'],
      colors = ['#3b82f6'],
      margin = { left: 48, right: 18, top: 16, bottom: 34 },
      backgroundColor = 'white',
      gridColor = '#e2e8f0',
      axisColor = '#94a3b8',
      scaleY = 1,
    } = options;

    const canvas = this.canvas;
    const ctx = this.ctx;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const cssWidth = Math.max(1, rect.width);
    const cssHeight = Math.max(1, rect.height);

    if (canvas.width !== Math.floor(cssWidth * dpr) || canvas.height !== Math.floor(cssHeight * dpr)) {
      canvas.width = Math.floor(cssWidth * dpr);
      canvas.height = Math.floor(cssHeight * dpr);
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssWidth, cssHeight);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, cssWidth, cssHeight);

    const plotW = cssWidth - margin.left - margin.right;
    const plotH = cssHeight - margin.top - margin.bottom;

    // Calculate scales
    const xMin = data[0]?.[xKey] ?? 0;
    const xMax = Math.max(xMin + 1, data[data.length - 1]?.[xKey] ?? 1);
    const maxValue = Math.max(10, ...data.flatMap((row) => yKeys.map((k) => row[k] ?? 0)));
    const yMax = Math.max(10, Math.ceil(((maxValue * 1.15) / scaleY) / 10) * 10);

    const xScale = (val) => margin.left + ((val - xMin) / (xMax - xMin)) * plotW;
    const yScale = (val) => margin.top + plotH - (Math.min(val, yMax) / yMax) * plotH;

    // Draw grid
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i <= 5; i += 1) {
      const y = margin.top + (plotH / 5) * i;
      ctx.moveTo(margin.left, y);
      ctx.lineTo(margin.left + plotW, y);
    }
    ctx.stroke();

    // Draw axes
    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, margin.top + plotH);
    ctx.lineTo(margin.left + plotW, margin.top + plotH);
    ctx.stroke();

    // Draw lines for each y key
    yKeys.forEach((yKey, keyIndex) => {
      const color = colors[keyIndex] || '#3b82f6';
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();

      for (let i = 0; i < data.length; i += 1) {
        const x = xScale(data[i][xKey]);
        const y = yScale(data[i][yKey] ?? 0);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    });

    // Draw axis labels
    ctx.fillStyle = '#334155';
    ctx.font = '12px system-ui';
    ctx.textAlign = 'center';
    for (let i = 0; i <= 5; i += 1) {
      const val = Math.round((yMax / 5) * i);
      ctx.textAlign = 'right';
      ctx.fillText(val.toString(), margin.left - 8, margin.top + plotH - (plotH / 5) * i + 4);
    }

    ctx.textAlign = 'center';
    ctx.fillText('Ciclo', cssWidth / 2, cssHeight - 8);
  }

  getChartInfo(data, yKeys, scaleY) {
    if (data.length === 0) return 'Sin datos';
    const maxValue = Math.max(10, ...data.flatMap((row) => yKeys.map((k) => row[k] ?? 0)));
    const yMax = Math.max(10, Math.ceil(((maxValue * 1.15) / scaleY) / 10) * 10);
    return `Escala visible automática ajustada a los datos. Zoom actual: x${scaleY.toFixed(2)}.`;
  }
}
