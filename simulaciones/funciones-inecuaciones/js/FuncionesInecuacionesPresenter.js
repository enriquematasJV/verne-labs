class FuncionesInecuacionesPresenter {
  constructor(model, graph, dom, constants) {
    this.model = model;
    this.graph = graph;
    this.dom = dom;
    this.constants = constants;

    // Inicializar componentes gráficos
    this.graphEngine = new Graph2DEngine(graph, {
      ...constants.GRAPH_INITIAL_VIEWPORT,
      showGrid: constants.GRAPH_RENDERING.showGrid,
      showAxes: constants.GRAPH_RENDERING.showAxes,
    });

    this.regionRenderer = new InequalityRegionRenderer(graph, this.graphEngine, {
      step: constants.STEP,
      fillColor: constants.REGION_SHADING.fillColor,
    });

    this.setupEventListeners();
    this.render();
  }

  setupEventListeners() {
    // Botones de modo
    this.dom.btnInequalities.addEventListener("click", () => {
      this.model.setMode("inequalities");
      this.updateModeUI();
      this.render();
    });

    this.dom.btnFunctions.addEventListener("click", () => {
      this.model.setMode("functions");
      this.updateModeUI();
      this.render();
    });

    // Sliders
    this.dom.viewRangeInput.addEventListener("input", () => {
      this.model.setManualView(false);
      this.model.setViewRange(Number(this.dom.viewRangeInput.value));
      this.render();
    });

    // Textarea de inecuaciones
    this.dom.ineqInput.addEventListener("input", () => {
      this.model.setInequalityText(this.dom.ineqInput.value);
      this.render();
    });

    // Textarea de funciones
    this.dom.funcInput.addEventListener("input", () => {
      this.model.setFunctionText(this.dom.funcInput.value);
      this.render();
    });

    // GraphNavigator para pan/zoom interactivo
    if (window.VerneGraphNavigator) {
      try {
        VerneGraphNavigator.attach(this.graph, {
          panAxis: "both",
          zoomAxis: "both",
          minSpanX: 0.2,
          maxSpanX: 400,
          minSpanY: 0.02,
          maxSpanY: 400000,
          getViewport: () => this.model.getViewport(),
          setViewport: (next) => {
            this.model.setManualView(true);
            this.model.setViewRange((next.xMax - next.xMin) / 2);
            this.model.setCenter(
              (next.xMax + next.xMin) / 2,
              (next.yMax + next.yMin) / 2
            );
            this.syncSlidersFromView();
            this.render();
          },
        });
      } catch (e) {
        console.error('Error al inicializar VerneGraphNavigator:', e);
      }
    }
  }

  updateModeUI() {
    const isIneq = this.model.mode === "inequalities";
    this.dom.btnInequalities.classList.toggle("active", isIneq);
    this.dom.btnFunctions.classList.toggle("active", !isIneq);
    this.dom.inequalityPanel.classList.toggle("hidden", !isIneq);
    this.dom.functionPanel.classList.toggle("hidden", isIneq);
  }

  syncSlidersFromView() {
    const clamped = Math.max(2, Math.min(30, Math.round(this.model.viewRange)));
    this.dom.viewRangeInput.value = String(clamped);
  }

  formatRange(value) {
    return Number.isInteger(value)
      ? String(value)
      : value.toFixed(2);
  }

  updateStatus(element, result, noun) {
    if (result.errors.length > 0) {
      element.className = "status error";
      const text = this.constants.TEXT;
      element.textContent = `${text.ERROR_PREFIX} ${result.errors.length} ${text.ERROR_LINES_SUFFIX}: ${result.errors.join(" | ")}`;
    } else {
      element.className = "status ok";
      const text = this.constants.TEXT;
      element.textContent = `${result.ok.length} ${noun} ${text.CORRECT_SUFFIX}`;
    }
  }

  render() {
    // Actualizar labels
    this.dom.viewRangeLabel.textContent = `±${this.formatRange(this.model.viewRange)}`;

    // Actualizar viewport del graphEngine
    const viewport = this.model.getViewport();
    this.graphEngine.setViewport(
      viewport.xMin,
      viewport.xMax,
      viewport.yMin,
      viewport.yMax
    );

    // Limpiar gráfico previo
    this.graphEngine.clear();

    let inequalitiesForRegion = [];

    if (this.model.mode === "inequalities") {
      const result = this.model.getInequalities();
      this.updateStatus(this.dom.ineqStatus, result, "inecuación(es)");
      inequalitiesForRegion = result.ok;

      // Dibujar límites de inecuaciones como funciones
      for (const ineq of result.ok) {
        if (ineq.kind === "y") {
          this.graphEngine.addFunctionPlot(ineq.fn, {
            color: ineq.color,
            lineWidth: this.constants.GRAPH_RENDERING.lineWidth,
          });
        }
      }
    } else {
      const result = this.model.getFunctions();
      this.updateStatus(this.dom.funcStatus, result, "función(es)");

      // Dibujar funciones
      for (const item of result.ok) {
        this.graphEngine.addFunctionPlot(item.fn, {
          color: item.color,
          lineWidth: this.constants.GRAPH_RENDERING.lineWidth,
        });
      }
    }

    // Renderizar gráfico
    this.graphEngine.render();

    // Dibujar regiones sombreadas después del renderizado
    if (inequalitiesForRegion.length > 0) {
      this.regionRenderer.drawRegion(inequalitiesForRegion);
    }
  }
}
