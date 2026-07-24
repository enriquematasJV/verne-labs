/**
 * FormulasPanel — Panel dinámico de ecuaciones y fórmulas
 *
 * Responsabilidades:
 * - Actualizar ecuaciones x(t) y y(t)
 * - Mostrar descomposición de velocidad inicial según modo
 * - Mostrar ecuación de condición y solución actual
 * - Textos pedagógicos informativos
 *
 * Recibe: model, DOM elements
 * Actualiza: contenido de texto en elementos específicos
 */

class FormulasPanel {
  constructor(dom) {
    this.dom = dom;
  }

  /**
   * Actualizar todas las fórmulas y textos
   */
  updateAll(model) {
    this.updateEquations(model);
    this.updateComponentFormulas(model);
    this.updateEquationInfo(model);
    this.updateModelSummary(model);
  }

  /**
   * Actualizar ecuaciones principales x(t) y y(t)
   */
  updateEquations(model) {
    const th = model.getTheoretical();
    const format = (val, digits = 2) => CinematicaPhysics.format(val, digits);

    // Ecuación x(t)
    if (this.dom.formulaX) {
      this.dom.formulaX.textContent =
        `x(t) = ${format(th.v0x, 2)}·t`;
    }

    // Ecuación y(t)
    if (this.dom.formulaY) {
      this.dom.formulaY.textContent =
        `y(t) = ${format(model.y0, 1)} + ${format(th.v0y, 2)}·t - ${format(Math.abs(0.5 * model.g), 2)}·t²`;
    }
  }

  /**
   * Actualizar fórmula de componentes según modo
   */
  updateComponentFormulas(model) {
    if (!this.dom.componentFormula) return;

    const th = model.getTheoretical();
    const format = (val, digits = 2) => CinematicaPhysics.format(val, digits);

    if (model.mode === 'parabolic') {
      this.dom.componentFormula.textContent =
        `v₀x = ${format(model.v0, 1)}·cos(${model.angleDeg}°) = ${format(th.v0x, 2)} m/s,  v₀y = ${format(model.v0, 1)}·sin(${model.angleDeg}°) = ${format(th.v0y, 2)} m/s`;
    } else if (model.mode === 'horizontal') {
      this.dom.componentFormula.textContent =
        `v₀x = ${format(model.v0, 1)} m/s,  v₀y = 0 m/s`;
    } else if (model.mode === 'vertical') {
      this.dom.componentFormula.textContent =
        `v₀x = 0 m/s,  v₀y = ${format(model.v0, 1)} m/s`;
    }
  }

  /**
   * Actualizar ecuación de condición e información del problema
   */
  updateEquationInfo(model) {
    if (!this.dom.equationResult) return;

    const text = `Cinemática usada: primero se escribe la posición vertical <strong>y(t)</strong>. Luego se impone una condición del problema. Por ejemplo, para tocar el suelo se usa <strong>y(t)=0</strong>; para la altura máxima se usa <strong>vᵧ(t)=0</strong>. Así se calcula el instante buscado y después se sustituye ese tiempo en las demás expresiones.`;

    this.dom.equationResult.innerHTML = text;
  }

  /**
   * Actualizar resumen del modelo según modo
   */
  updateModelSummary(model) {
    if (!this.dom.modelSummary) return;

    if (model.mode === 'vertical') {
      this.dom.modelSummary.textContent =
        'El eje X no interviene. En vertical, la velocidad cambia por efecto de la gravedad hasta anularse en la altura máxima y luego invierte el sentido.';
    } else if (model.mode === 'horizontal') {
      this.dom.modelSummary.textContent =
        'El movimiento horizontal es uniforme, mientras que el vertical es una caída libre. Ambos se combinan para formar una parábola.';
    } else if (model.mode === 'parabolic') {
      this.dom.modelSummary.textContent =
        'El tiro parabólico se estudia separando el eje X y el eje Y. En X no hay aceleración; en Y actúa la gravedad.';
    }
  }

  /**
   * Actualizar fórmulas de valores teóricos (tiempos, alturas, alcance)
   */
  updateTheoreticalValues(model) {
    const th = model.getTheoretical();
    const format = (val, digits = 2) => CinematicaPhysics.format(val, digits);

    if (this.dom.flightTimeValue) {
      this.dom.flightTimeValue.textContent = format(th.flightTime) + ' s';
    }
    if (this.dom.maxHeightValue) {
      this.dom.maxHeightValue.textContent = format(th.maxHeight) + ' m';
    }
    if (this.dom.apexTimeValue) {
      this.dom.apexTimeValue.textContent = format(th.apexTime) + ' s';
    }
    if (this.dom.rangeValue) {
      this.dom.rangeValue.textContent = format(th.range) + ' m';
    }
    if (this.dom.impactValue) {
      this.dom.impactValue.textContent = format(th.impactSpeed) + ' m/s';
    }
  }

  /**
   * Actualizar valores instantáneos (tiempo, posición, velocidad)
   */
  updateInstantaneousValues(model) {
    const pos = model.getPosition();
    const vel = model.getVelocity();
    const speedModule = model.getSpeedModule();
    const format = (val, digits = 2) => CinematicaPhysics.format(val, digits);

    if (this.dom.timeValue) {
      this.dom.timeValue.textContent = format(model.time) + ' s';
    }
    if (this.dom.positionValue) {
      this.dom.positionValue.textContent = `${format(pos.x, 1)}, ${format(pos.y, 1)} m`;
    }
    if (this.dom.velocityValue) {
      this.dom.velocityValue.textContent = `${format(vel.vx, 1)}, ${format(vel.vy, 1)} m/s`;
    }
    if (this.dom.speedModuleValue) {
      this.dom.speedModuleValue.textContent = format(speedModule, 1) + ' m/s';
    }
  }

  /**
   * Actualizar texto pedagógico según fase
   */
  updatePedagogicalText(model) {
    if (!this.dom.pedagogicText) return;

    if (model.mode === 'vertical') {
      this.dom.pedagogicText.textContent =
        'En el punto más alto se cumple vᵧ = 0. Después, la pelota cae con aceleración constante negativa: aᵧ = -g.';
    } else if (model.mode === 'horizontal') {
      this.dom.pedagogicText.textContent =
        'El movimiento horizontal mantiene signo positivo constante, mientras que verticalmente actúa una aceleración negativa: aᵧ = -g.';
    } else if (model.mode === 'parabolic') {
      this.dom.pedagogicText.textContent =
        'En el eje X el movimiento suele tomarse positivo hacia la derecha. En el eje Y, subir es positivo y la gravedad introduce aceleración negativa.';
    }
  }

  /**
   * Actualizar texto de estado
   */
  updateStatusText(model) {
    if (!this.dom.statusText) return;
    this.dom.statusText.textContent = model.getStatusText();
  }

  /**
   * Limpiar todas las fórmulas (reset)
   */
  reset() {
    if (this.dom.formulaX) this.dom.formulaX.textContent = '';
    if (this.dom.formulaY) this.dom.formulaY.textContent = '';
    if (this.dom.componentFormula) this.dom.componentFormula.textContent = '';
    if (this.dom.equationResult) this.dom.equationResult.innerHTML = '';
    if (this.dom.modelSummary) this.dom.modelSummary.textContent = '';
    if (this.dom.timeValue) this.dom.timeValue.textContent = '0.00 s';
    if (this.dom.positionValue) this.dom.positionValue.textContent = '0.00, 0.00 m';
    if (this.dom.velocityValue) this.dom.velocityValue.textContent = '0.00, 0.00 m/s';
    if (this.dom.speedModuleValue) this.dom.speedModuleValue.textContent = '0.00 m/s';
    if (this.dom.pedagogicText) this.dom.pedagogicText.textContent = '';
    if (this.dom.statusText) this.dom.statusText.textContent = 'Listo para iniciar';
  }
}
