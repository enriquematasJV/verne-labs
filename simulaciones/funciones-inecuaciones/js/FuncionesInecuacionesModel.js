class FuncionesInecuacionesModel {
  constructor() {
    // Modo de operación
    this.mode = "inequalities"; // "inequalities" | "functions"

    // Texto de entrada (sin procesar)
    this.inequalityText = `y < log(x) ; orange
y >= 2x - 1 ; red
x <= 5 ; black`;

    this.functionText = `y = x^2 ; red
y = sin(x) ; green
y = log(x) ; orange`;

    // Estado de parsing (procesar lazy)
    this._inequalitiesParsed = null;
    this._functionsParsed = null;

    // Viewport
    this.viewRange = 10;
    this.centerX = 0;
    this.centerY = 0;
    this.manualView = false;
  }

  // Getters lazy para parsing
  getInequalities() {
    if (this._inequalitiesParsed === null) {
      this._inequalitiesParsed = this._parseInequalities(this.inequalityText);
    }
    return this._inequalitiesParsed;
  }

  getFunctions() {
    if (this._functionsParsed === null) {
      this._functionsParsed = this._parseFunctions(this.functionText);
    }
    return this._functionsParsed;
  }

  // Setters que invalidan cache
  setMode(mode) {
    this.mode = mode;
  }

  setInequalityText(text) {
    if (this.inequalityText !== text) {
      this.inequalityText = text;
      this._inequalitiesParsed = null;
    }
  }

  setFunctionText(text) {
    if (this.functionText !== text) {
      this.functionText = text;
      this._functionsParsed = null;
    }
  }

  setViewRange(range) {
    this.viewRange = range;
  }

  setCenter(x, y) {
    this.centerX = x;
    this.centerY = y;
  }

  setManualView(manual) {
    this.manualView = manual;
  }

  getViewport() {
    const xMin = this.centerX - this.viewRange;
    const xMax = this.centerX + this.viewRange;
    const yMin = this.centerY - this.viewRange;
    const yMax = this.centerY + this.viewRange;
    return { xMin, xMax, yMin, yMax };
  }

  // Lógica de parsing privada
  _normalize(text) {
    return String(text)
      .replace(/≤/g, "<=")
      .replace(/≥/g, ">=")
      .replace(/,/g, ".")
      .trim();
  }

  _parseY(line, color) {
    const expr = this._normalize(line);
    const match = expr.match(/^y\s*(<=|>=|<|>)\s*(.+)$/i);
    if (!match) return null;

    const op = match[1];
    const rhs = match[2].trim();

    const parsed = VerneMath.parseExpression(rhs);
    if (!parsed.fn) return null;

    return { kind: "y", op, fn: parsed.fn, raw: expr, color };
  }

  _parseX(line, color) {
    const expr = this._normalize(line);
    const match = expr.match(/^x\s*(<=|>=|<|>)\s*(-?\d+(?:\.\d+)?)$/i);
    if (!match) return null;

    return {
      kind: "x",
      op: match[1],
      value: Number(match[2]),
      raw: expr,
      color,
    };
  }

  _parseInequalityLine(line) {
    const parsed = VerneMath.parseExpression(this._normalize(line));
    const expr = parsed.expr;
    const color = parsed.color || "blue";

    if (!expr) return null;
    return this._parseY(expr, color) || this._parseX(expr, color);
  }

  _parseFunctionLine(line) {
    const normalized = this._normalize(line);
    const parsed = VerneMath.parseExpression(normalized);

    if (!parsed.expr) return null;

    const yEquals = parsed.expr.match(/^y\s*=\s*(.+)$/i);
    const rawExpr = yEquals ? yEquals[1].trim() : parsed.expr;

    const fnParsed = VerneMath.parseExpression(rawExpr);
    if (!fnParsed.fn) return null;

    return { fn: fnParsed.fn, raw: line.trim(), color: parsed.color || "blue" };
  }

  _parseInequalities(text) {
    const ok = [];
    const errors = [];

    for (const line of text.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const parsed = this._parseInequalityLine(trimmed);
      if (parsed) ok.push(parsed);
      else errors.push(trimmed);
    }

    return { ok, errors };
  }

  _parseFunctions(text) {
    const ok = [];
    const errors = [];

    for (const line of text.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const parsed = this._parseFunctionLine(trimmed);
      if (parsed) ok.push(parsed);
      else errors.push(trimmed);
    }

    return { ok, errors };
  }
}
