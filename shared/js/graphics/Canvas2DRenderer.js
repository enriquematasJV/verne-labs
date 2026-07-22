class Canvas2DRenderer {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
  }

  clear(color = '#ffffff') {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawRect(x, y, width, height, fillColor, strokeColor = null, lineWidth = 1) {
    if (fillColor) {
      this.ctx.fillStyle = fillColor;
      this.ctx.fillRect(x, y, width, height);
    }
    if (strokeColor) {
      this.ctx.strokeStyle = strokeColor;
      this.ctx.lineWidth = lineWidth;
      this.ctx.strokeRect(x, y, width, height);
    }
  }

  drawPolygon(points, fillColor, strokeColor = null, lineWidth = 1) {
    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }
    this.ctx.closePath();

    if (fillColor) {
      this.ctx.fillStyle = fillColor;
      this.ctx.fill();
    }
    if (strokeColor) {
      this.ctx.strokeStyle = strokeColor;
      this.ctx.lineWidth = lineWidth;
      this.ctx.stroke();
    }
  }

  drawLine(x1, y1, x2, y2, color = '#000000', lineWidth = 1) {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  }

  drawArrow(x1, y1, x2, y2, color, label = '', lineWidth = 3) {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const headLength = 10;

    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(x2, y2);
    this.ctx.lineTo(x2 - headLength * Math.cos(angle - Math.PI / 6), y2 - headLength * Math.sin(angle - Math.PI / 6));
    this.ctx.moveTo(x2, y2);
    this.ctx.lineTo(x2 - headLength * Math.cos(angle + Math.PI / 6), y2 - headLength * Math.sin(angle + Math.PI / 6));
    this.ctx.stroke();

    if (label) {
      this.ctx.fillStyle = color;
      this.ctx.font = 'bold 14px Arial';
      this.ctx.fillText(label, x2 + 8, y2 - 6);
    }
  }

  drawCircle(x, y, radius, fillColor = null, strokeColor = null, lineWidth = 1) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);

    if (fillColor) {
      this.ctx.fillStyle = fillColor;
      this.ctx.fill();
    }
    if (strokeColor) {
      this.ctx.strokeStyle = strokeColor;
      this.ctx.lineWidth = lineWidth;
      this.ctx.stroke();
    }
  }

  drawArc(x, y, radius, startAngle, endAngle, strokeColor = '#000000', lineWidth = 1) {
    this.ctx.strokeStyle = strokeColor;
    this.ctx.lineWidth = lineWidth;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, startAngle, endAngle, false);
    this.ctx.stroke();
  }

  drawText(text, x, y, fontSize = 14, fontWeight = 'normal', color = '#000000', textAlign = 'left') {
    this.ctx.fillStyle = color;
    this.ctx.font = `${fontWeight} ${fontSize}px Arial`;
    this.ctx.textAlign = textAlign;
    this.ctx.fillText(text, x, y);
    this.ctx.textAlign = 'left';
  }

  drawPath(points, strokeColor = '#000000', lineWidth = 1, closed = false) {
    if (points.length === 0) return;
    this.ctx.strokeStyle = strokeColor;
    this.ctx.lineWidth = lineWidth;
    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }
    if (closed) this.ctx.closePath();
    this.ctx.stroke();
  }

  getContext() {
    return this.ctx;
  }

  getWidth() {
    return this.canvas.width;
  }

  getHeight() {
    return this.canvas.height;
  }
}
