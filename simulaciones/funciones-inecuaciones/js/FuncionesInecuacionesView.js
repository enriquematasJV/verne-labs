/**
 * FuncionesInecuacionesView — Encapsula la interacción con el DOM
 *
 * Responsabilidades:
 * - Actualizar elementos del DOM basándose en el estado del Model
 * - Capturar eventos de entrada y delegarlos al Presenter
 * - Mostrar/ocultar paneles según el modo
 * - Renderizar gráficos
 */

class FuncionesInecuacionesView {
  constructor(dom, presenter) {
    this.dom = dom;
    this.presenter = presenter;
  }

  // ===== ACTUALIZAR PANEL SEGÚN MODO =====
  updateModeUI(mode) {
    const isIneq = mode === 'inequalities';
    this.dom.btnInequalities.classList.toggle('active', isIneq);
    this.dom.btnFunctions.classList.toggle('active', !isIneq);
    this.dom.inequalityPanel.classList.toggle('hidden', !isIneq);
    this.dom.functionPanel.classList.toggle('hidden', isIneq);
  }

  // ===== ACTUALIZAR LABELS Y ESTADOS =====
  updateViewRangeLabel(value) {
    const formatted = this._formatRange(value);
    this.dom.viewRangeLabel.textContent = `±${formatted}`;
  }

  updateInequalityStatus(errors, count) {
    const element = this.dom.ineqStatus;
    if (errors.length > 0) {
      element.className = 'status error';
      element.textContent = `Errores en ${errors.length} línea(s): ${errors.join(' | ')}`;
    } else {
      element.className = 'status ok';
      element.textContent = `${count} inecuación(es) correcta(s)`;
    }
  }

  updateFunctionStatus(errors, count) {
    const element = this.dom.funcStatus;
    if (errors.length > 0) {
      element.className = 'status error';
      element.textContent = `Errores en ${errors.length} línea(s): ${errors.join(' | ')}`;
    } else {
      element.className = 'status ok';
      element.textContent = `${count} función(es) correcta(s)`;
    }
  }

  // ===== GETTERS PARA VALORES DE INPUT =====
  getInequalityText() {
    return this.dom.ineqInput.value;
  }

  getFunctionText() {
    return this.dom.funcInput.value;
  }

  getViewRange() {
    return Number(this.dom.viewRangeInput.value);
  }

  // ===== SETTERS PARA VALORES DE INPUT =====
  setInequalityText(text) {
    this.dom.ineqInput.value = text;
  }

  setFunctionText(text) {
    this.dom.funcInput.value = text;
  }

  setViewRange(value) {
    const clamped = Math.max(2, Math.min(30, Math.round(value)));
    this.dom.viewRangeInput.value = String(clamped);
    this.updateViewRangeLabel(clamped);
  }

  // ===== UTILIDADES =====
  _formatRange(value) {
    return Number.isInteger(value)
      ? String(value)
      : value.toFixed(2);
  }

  // ===== NOTIFICAR AL PRESENTER DE CAMBIOS =====
  onModeChanged(callback) {
    this.dom.btnInequalities.addEventListener('click', () => callback('inequalities'));
    this.dom.btnFunctions.addEventListener('click', () => callback('functions'));
  }

  onInequalityTextChanged(callback) {
    this.dom.ineqInput.addEventListener('input', (e) => callback(e.target.value));
  }

  onFunctionTextChanged(callback) {
    this.dom.funcInput.addEventListener('input', (e) => callback(e.target.value));
  }

  onViewRangeChanged(callback) {
    this.dom.viewRangeInput.addEventListener('input', (e) => callback(Number(e.target.value)));
  }
}
