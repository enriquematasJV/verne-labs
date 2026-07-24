/**
 * FuncionesInecuacionesPresenter — Orquesta Model, View y componentes gráficos
 *
 * Responsabilidades:
 * - Escuchar eventos de la View
 * - Actualizar el Model
 * - Requerir rendering a la View
 * - Manejar lógica de gráficos
 */

class FuncionesInecuacionesPresenter {
  constructor(model, graph, dom, constants, view = null) {
    this.model = model;
    this.graph = graph;
    this.dom = dom;
    this.constants = constants;

    // Crear o usar View inyectada
    this.view = view || new FuncionesInecuacionesView(dom, this);

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
    // Cambios de modo
    this.view.onModeChanged((mode) => {
      this.model.setMode(mode);
      this.view.updateModeUI(mode);
      this.render();
    });

    // Cambios de inecuaciones
    this.view.onInequalityTextChanged((text) => {
      this.model.setInequalityText(text);
      this.render();
    });

    // Cambios de funciones
    this.view.onFunctionTextChanged((text) => {
      this.model.setFunctionText(text);
      this.render();
    });

    // Cambios de vista/zoom
    this.view.onViewRangeChanged((range) => {
      this.model.setManualView(false);
      this.model.setViewRange(range);
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

  syncSlidersFromView() {
    this.view.setViewRange(this.model.viewRange);
  }

  render() {
    // Actualizar vista
    this.view.updateViewRangeLabel(this.model.viewRange);

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
      this.view.updateInequalityStatus(result.errors, result.ok.length);
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
      this.view.updateFunctionStatus(result.errors, result.ok.length);

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
