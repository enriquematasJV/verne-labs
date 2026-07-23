// Panel genérico para mostrar fórmulas matemáticas con valores dinámicos
// Uso:
//   new MathematicalModelPanel({
//     container: null,  // opcional: elemento contenedor (por defecto busca por IDs)
//     formulas: [
//       { id: 'formulaId', digits: 2 },  // id = atributo id del elemento HTML
//       { id: 'accelFormula', digits: 3 }
//     ],
//     calculator: (state) => ({
//       formulaId: calculatedValue,
//       accelFormula: anotherValue
//     })
//   })
// Luego llamar a panel.update(state) para actualizar los valores

class MathematicalModelPanel {
  constructor(config) {
    this.config = config;
    this.container = config.container;
    this.formulas = config.formulas || [];
    this.calculator = config.calculator;
    this.model = config.model;

    this.elements = {};
    this.init();
  }

  init() {
    this.cacheElements();
  }

  cacheElements() {
    this.formulas.forEach(formula => {
      const el = document.getElementById(formula.id);
      if (el) {
        this.elements[formula.id] = el;
      }
    });
  }

  update(state) {
    if (!this.calculator) return;

    const values = this.calculator(state);

    this.formulas.forEach(formula => {
      if (this.elements[formula.id] && values.hasOwnProperty(formula.id)) {
        const value = values[formula.id];
        const formatted = this.format(value, formula.digits || 2);
        this.elements[formula.id].textContent = formatted;
      }
    });
  }

  format(value, digits = 2) {
    if (!Number.isFinite(value)) return '∞';
    return value.toFixed(digits);
  }

  setFormulas(formulas) {
    this.formulas = formulas;
    this.cacheElements();
  }

  setCalculator(calculator) {
    this.calculator = calculator;
  }
}
