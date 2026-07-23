class SliderControl {
  constructor(inputElement, displayElement, onChange) {
    this.input = inputElement;
    this.display = displayElement;
    this.onChange = onChange;

    this.input.addEventListener('input', () => {
      const value = this.getValue();
      this.updateDisplay(value);
      if (this.onChange) {
        this.onChange(value);
      }
    });
  }

  getValue() {
    return Number(this.input.value);
  }

  setValue(value) {
    this.input.value = value;
    this.updateDisplay(value);
  }

  updateDisplay(value) {
    const decimals = this.getDecimals();
    this.display.textContent = value.toFixed(decimals);
  }

  getDecimals() {
    const step = this.input.step || '1';
    return (step.split('.')[1] || []).length;
  }

  setMin(value) {
    this.input.min = value;
  }

  setMax(value) {
    this.input.max = value;
  }

  setStep(value) {
    this.input.step = value;
  }

  disable() {
    this.input.disabled = true;
  }

  enable() {
    this.input.disabled = false;
  }

  isDisabled() {
    return this.input.disabled;
  }
}
