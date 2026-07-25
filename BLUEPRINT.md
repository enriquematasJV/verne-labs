# VerneLabs Blueprint — Arquitectura de Componentes Modulares

## Visión

VerneLabs es una plataforma de laboratorios virtuales JavaScript/HTML/CSS con arquitectura **100% modular**. Cada lab es independiente pero comparte componentes comunes reutilizables.

## Arquitectura

### Capas CSS (3-Tier Cascade)

```
┌─────────────────────────────────────────────────┐
│ /shared/assets/css/verne-theme.css              │  Nivel 1: GLOBAL
│ - Variables CSS (colores, tamaños, grid)        │
└─────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────┐
│ /shared/components/*/component.css              │  Nivel 2: COMPONENTES
│ - Estilos específicos del componente            │
│ - Auto-contenidos (no tocan estilos de otros)   │
└─────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────┐
│ /simulaciones/lab-name/lab-name.css             │  Nivel 3: LAB
│ - Solo layout y positioning                     │
│ - NO estilos de componentes                     │
└─────────────────────────────────────────────────┘
```

### Estructura de Directorios

```
verne-labs/
├── BLUEPRINT.md                          ← Este archivo
├── shared/
│   ├── assets/
│   │   └── css/
│   │       └── verne-theme.css          ← Variables CSS globales
│   ├── components/                      ← ★ ÚNICO LUGAR PARA COMPONENTES
│   │   ├── Canvas2DRenderer/
│   │   │   ├── Canvas2DRenderer.js      ← Renderizador 2D con canvas
│   │   │   ├── canvas-2d-renderer.css
│   │   │   └── README.md
│   │   ├── ChartRenderer/
│   │   │   ├── ChartRenderer.js         ← Renderizador de gráficos
│   │   │   └── README.md
│   │   ├── Graph2DEngine/
│   │   │   ├── Graph2DEngine.js         ← Motor gráfico 2D
│   │   │   └── README.md
│   │   ├── GraphDisplay/
│   │   │   ├── graph-display.css        ← Estilos base para gráficos
│   │   │   └── README.md
│   │   ├── GraphNavigator/
│   │   │   ├── GraphNavigator.js        ← Pan/zoom
│   │   │   ├── graph-navigator.css
│   │   │   └── README.md
│   │   ├── GraphRenderer/
│   │   │   ├── GraphRenderer.js         ← ★ RENDERIZADOR MODULAR
│   │   │   ├── README.md
│   │   │   └── graph-renderer.css
│   │   ├── KinematicsEngine/
│   │   │   ├── KinematicsEngine.js      ← Motor cinemático
│   │   │   └── README.md
│   │   ├── MathUtils/
│   │   │   ├── MathUtils.js             ← Utilidades matemáticas
│   │   │   └── README.md
│   │   ├── MathematicalModelPanel/
│   │   │   ├── MathematicalModelPanel.js ← Panel de modelos matemáticos
│   │   │   ├── mathematical-model-panel.css
│   │   │   └── README.md
│   │   ├── OdeSolverRK4/
│   │   │   ├── OdeSolverRK4.js          ← Solver ODE Runge-Kutta 4
│   │   │   └── README.md
│   │   ├── PhysicsEngine/
│   │   │   ├── PhysicsEngine.js         ← Motor de física
│   │   │   └── README.md
│   │   ├── SimulationLifecycle/
│   │   │   ├── SimulationLifecycle.js   ← Ciclo de vida de simulaciones
│   │   │   ├── simulation-lifecycle.css
│   │   │   └── README.md
│   │   ├── SliderControl/
│   │   │   ├── SliderControl.js         ← Control deslizante reutilizable
│   │   │   ├── slider-control.css
│   │   │   └── README.md
│   │   ├── Vector2D/
│   │   │   ├── Vector2D.js              ← Clase vector 2D
│   │   │   └── README.md
│   │   ├── VectorRenderer/
│   │   │   ├── VectorRenderer.js        ← Renderizador de vectores
│   │   │   └── README.md
│   │   └── VerneMath/
│   │       ├── VerneMath.js             ← ★ Compilador de expresiones
│   │       ├── README.md
│   │       └── verne-math.css
│   └── css/
│       └── labs-common.css
├── simulaciones/
│   ├── funciones-inecuaciones/
│   │   ├── index.html                   ← ★ REFACTORIZADO (usa /components)
│   │   ├── funciones-inecuaciones.css
│   │   └── README.md
│   ├── derivadas/
│   │   ├── index.html                   ← ★ REFACTORIZADO (usa /components)
│   │   ├── derivadas.css
│   │   └── README.md
│   ├── cinematica-2d/
│   │   ├── index.html                   ← ✅ REFACTORIZADO (usa /components)
│   │   ├── cinematica-2d.css
│   │   └── README.md
│   ├── plano-inclinado/
│   │   ├── index.html                   ← ✅ REFACTORIZADO (usa /components)
│   │   ├── plano-inclinado.css
│   │   └── README.md
│   └── [otros labs...]
└── index.html                           ← Portal principal
```

## Consolidación de Componentes

**ESTADO: ✅ COMPLETADO (2026-07-25)**

Todos los componentes reutilizables están centralizados en `/shared/components/`. La carpeta legacy `/shared/js/` ha sido **eliminada completamente**.

### Componentes Actuales (16 componentes)

| Componente | Tipo | Descripción |
|---|---|---|
| **VerneMath** | Matemática | Compilador seguro de expresiones (2x, sin(x), etc.) |
| **Vector2D** | Matemática | Clase vector 2D con operaciones básicas |
| **MathUtils** | Matemática | Utilidades matemáticas generales |
| **PhysicsEngine** | Física | Motor de física para simulaciones |
| **OdeSolverRK4** | Física | Solver ODE Runge-Kutta orden 4 |
| **KinematicsEngine** | Física | Motor cinemático para movimientos |
| **SimulationLifecycle** | Simulación | Gestor del ciclo de vida de simulaciones |
| **Canvas2DRenderer** | Renderización | Renderizador 2D con canvas |
| **GraphRenderer** | Renderización | Renderizador modular de gráficos XY |
| **Graph2DEngine** | Renderización | Motor completo para gráficos 2D |
| **ChartRenderer** | Renderización | Renderizador de gráficos/charts |
| **VectorRenderer** | Renderización | Renderizador de vectores |
| **GraphDisplay** | UI | Estilos base para elementos gráficos |
| **GraphNavigator** | UI | Control de pan y zoom para gráficos |
| **SliderControl** | UI | Control deslizante reutilizable |
| **MathematicalModelPanel** | UI | Panel para mostrar modelos matemáticos |

### Labs Completamente Refactorizados (4/4)

| Lab | Estado | Componentes |
|---|---|---|
| **Derivadas** | ✅ 100% | 4 componentes, todos en /components/ |
| **Funciones-Inecuaciones** | ✅ 100% | 4 componentes, todos en /components/ |
| **Cinemática 2D** | ✅ 100% | 6 componentes, todos en /components/ |
| **Plano Inclinado** | ✅ 100% | 8 componentes, todos en /components/ |

## Componentes Clave

### GraphRenderer — Renderizador 100% Modular

**Propósito:** Encapsular TODA la lógica de dibujo de grid y ejes. Garantizar consistencia visual 100% en todos los gráficos.

**Ubicación:** `/shared/components/GraphRenderer/`

**Uso:** Cualquier lab que dibuje gráficos XY debe usar GraphRenderer en lugar de código inline.

```javascript
const graphRenderer = new GraphRenderer(canvasOrSvgElement, {
  xMin: -10, xMax: 10,
  yMin: -10, yMax: 10,
  width: 520,
  height: 520,
  margin: 0  // Opcional: margen para etiquetas
});

graphRenderer.drawGridAndAxes();
```

**Propiedades:**
- Agnóstico de canvas/SVG
- Lee variables CSS globales (--grid-color, --grid-line-width, etc.)
- Soporta margin dinámico para labs con etiquetas de ejes
- Proporciona conversión de coordenadas: `xToPixel()`, `yToPixel()`, `pixelToX()`, `pixelToY()`

**Labs que lo usan:**
- ✅ funciones-inecuaciones (SVG)
- ✅ derivadas (Canvas con margin=52)

### VerneMath — Compilador de Expresiones

**Propósito:** Compilar y evaluar expresiones matemáticas de forma segura.

**Ubicación:** `/shared/components/VerneMath/`

**Características:**
- Soporta funciones: sin, cos, tan, sqrt, abs, log (base 10), ln (logaritmo natural), exp, ^, (), etc.
- Multiplicación implícita: `2x`, `3(x+1)`
- Validación de seguridad: bloquea identificadores peligrosos (window, document, fetch, eval, etc.)

**Bug Conocido (RESUELTO):** Conflicto entre ln() y log() debido a sustituciones regex en cascada. Solución: técnica de placeholder (`__NATURAL_LOG__`).

### GraphNavigator — Pan y Zoom

**Propósito:** Permitir navegación interactiva (arrastrar, zoom con rueda, pinch en móvil).

**Ubicación:** `/shared/components/GraphNavigator/`

## Estándares de Componentes

Cada componente debe cumplir:

1. **Auto-contenido:** JS + CSS + README en la carpeta del componente
2. **Reutilizable:** No depende de HTML específico del lab
3. **Documentado:** README explica uso y API
4. **Consistente:** Sigue el patrón de GraphRenderer como ejemplo

Ejemplo de componente bien diseñado:
```
/shared/components/MyComponent/
├── MyComponent.js        ← Lógica pura, sin HTML hardcoded
├── my-component.css      ← Estilos auto-contenidos
└── README.md             ← Guía de uso
```

## Migrando Labs Antiguos a GraphRenderer

### Checklist para refactorizar un lab:

- [ ] Agregar `<script src="../../shared/components/GraphRenderer/GraphRenderer.js"></script>`
- [ ] Crear instancia: `new GraphRenderer(element, options)`
- [ ] Llamar a `graphRenderer.drawGridAndAxes()` en la función render
- [ ] Eliminar código inline de `drawGrid()` o similar
- [ ] Verificar que el gráfico se ve idéntico
- [ ] Probar interactividad (pan, zoom, cambios de viewport)

### Labs Por Refactorizar

- [x] cinematica-2d ✅ COMPLETADO
- [x] plano-inclinado ✅ COMPLETADO
- [ ] ecologia-poblaciones
- [ ] [otros...]

## Contrato API de Componentes

### Especificación Obligatoria para Cada Componente

Cada componente debe documentar en su `README.md`:

```markdown
## Constructor
constructor(element, options)

## Parámetros
- element (HTMLElement): Contenedor donde se renderiza
- options (Object): Configuración
  - Listar cada opción, tipo, valor por defecto

## API Pública
- método(param): Descripción y retorno
- [listar todos los métodos públicos]

## Eventos Emitidos
- 'event-name': Descripción del evento y payload

## Eventos Escuchados
- Qué eventos externos consume el componente

## Dependencias
- Lista de componentes o librerías requeridas
- Orden obligatorio de carga

## HTML Requerido
```html
[Estructura HTML mínima necesaria]
```

## Ciclo de Vida
- init(): Inicialización
- reset(): Reinicio determinista
- resize(width, height): Redimensionado
- destroy(): Limpieza y destrucción
```

**ESTADO ACTUAL:** No todos los componentes cumplen esta especificación. Debe completarse progresivamente.

---

## Tipos de Laboratorio

### Taxonomía Cerrada (v1)

Cada laboratorio pertenece a UNO de estos tipos:

| Tipo | Descripción | Ejemplo | Componentes Típicos |
|---|---|---|---|
| **Gráficos Matemáticos** | Visualización de funciones, derivadas, integrales | Derivadas, Funciones-Inecuaciones | VerneMath, GraphRenderer, GraphNavigator |
| **Simulaciones Temporales** | Movimiento, caída, trayectorias a lo largo del tiempo | Cinemática 2D | SimulationLifecycle, Canvas2DRenderer, PhysicsEngine |
| **Física con Partículas** | Sistemas de múltiples objetos, colisiones, fuerzas | Plano Inclinado | PhysicsEngine, OdeSolverRK4, KinematicsEngine |
| **Sistemas Dinámicos** | Ecuaciones diferenciales, estabilidad, caos | [Pendiente] | OdeSolverRK4, Graph2DEngine |
| **Modelos Causales** | Diagrama de bucles, retroalimentación, stocks/flujos | [Pendiente] | GraphRenderer, [Nuevo: DiagramComponent] |
| **Geometría Interactiva** | Construcciones geométricas, transformaciones | [Pendiente] | [Nuevo: GeometryEngine] |

### Patrón de Arquitectura por Tipo

Cada tipo tiene un patrón MVP recomendado:

- **Gráficos Matemáticos:** Parser → Evaluador → Renderer → Navigator
- **Simulaciones Temporales:** Model → Lifecycle → Renderer → Presenter
- **Física:** PhysicsEngine → OdeSolver → Renderer → Presenter

---

## Contrato Común de Laboratorio

### Especificación Obligatoria `lab.manifest.json`

Todo laboratorio debe proporcionar:

```json
{
  "id": "cinematica-2d",
  "version": "1.0.0",
  "verne_version_min": "1.0.0",
  "type": "Simulaciones Temporales",
  
  "metadata": {
    "title": "Cinemática 2D: Tiro Parabólico",
    "description": "Simula trayectorias parabólicas ajustando ángulo y velocidad",
    "educational_level": ["Bachillerato", "Universidad"],
    "subject": ["Física", "Matemáticas"],
    "keywords": ["movimiento", "parábola", "vectores"]
  },
  
  "components_used": [
    "SimulationLifecycle",
    "Canvas2DRenderer",
    "VectorRenderer"
  ],
  
  "html_containers": {
    "scene": "canvas#scene",
    "controls": "div.controls",
    "metrics": "div.metrics"
  },
  
  "interface": {
    "init": "presenter.init()",
    "start": "presenter.start()",
    "pause": "presenter.pause()",
    "resume": "presenter.resume()",
    "reset": "presenter.reset()",
    "resize": "presenter.resize(width, height)",
    "state": "presenter.getState()"
  },
  
  "validation_checklist": [
    "✅ Exactitud matemática/científica verificada",
    "✅ Sin errores en consola del navegador",
    "✅ Reinicio determinista (reset() reproduce estado inicial)",
    "✅ Funciona en file:// y en servidor HTTP",
    "✅ Responsive a 375px, 768px, 1280px",
    "✅ Funciona con ratón y táctil",
    "✅ Accesibilidad WCAG AA básica",
    "✅ Rendimiento: FPS stable en navegadores soportados"
  ],
  
  "external_resources": "NONE",
  "browsersCompatible": ["Chrome 90+", "Firefox 88+", "Safari 14+"]
}
```

---

## Equivalencia Monolítico vs Modular

### Problema: Divergencia entre Versiones

Cuando un laboratorio existe en dos formas:
- **Monolítico:** Único archivo HTML autocontenido (para chat/pruebas)
- **Modular:** Carpeta integrada en VerneLabs (para producción)

**Riesgo:** Las dos versiones pueden divergir en comportamiento, bugs, mejoras.

### Solución: Fuente de Verdad Única

**Regla:** La versión MODULAR es la autoridad. La versión monolítica se **genera** a partir de ella.

```
Desarrollo
    ↓
Versión Modular (en /simulaciones/) ← FUENTE DE VERDAD
    ↓
[Script de bundling/inlining]
    ↓
Versión Monolítica (standalone.html)
```

### Reglas de Incrustación

Cuando se incrustan componentes en la versión monolítica:

1. El código JavaScript del componente debe ser **idéntico** (no inline diferente)
2. El CSS debe estar en `<style>` tags sin cambios
3. Las dependencias deben estar en el mismo orden
4. La API pública NO debe cambiar
5. Los test deben pasar en ambas versiones

---

## Versionado y Política de Compatibilidad

### Versión del Blueprint

**Blueprint v1.0 (2026-07-25)**

Establece:
- Estructura modular en `/shared/components/`
- 16 componentes core consolidados
- 4 laboratorios de referencia completamente refactorizados

### Versionado de Componentes

Cada componente tiene `version` en su `package.json`:

```json
{
  "name": "GraphRenderer",
  "version": "1.2.0",
  "verne_min": "1.0.0",
  "api_version": "1.2"
}
```

**Reglas:**
- MAYOR: Cambio de API incompatible
- MENOR: Nuevas funcionalidades, compatible hacia atrás
- PATCH: Bugfixes

### Cambios a Componentes Compartidos

**PROHIBIDO:**
- Modificar componentes en `/shared/components/` desde un laboratorio específico
- Cambiar la API pública sin incrementar MAJOR version

**OBLIGATORIO:**
- Si un lab necesita un cambio, proponer en `/shared/components/` con nueva versión
- Otros labs pueden optar por actualizar o mantenerse en versión antigua
- Mantener al menos 2 versiones previas de cada componente disponibles

### Propuesta de Nuevo Componente

1. Crear PR con carpeta en `/shared/components/ComponentName/`
2. Incluir `README.md` con especificación completa
3. Incluir tests que validen el contrato API
4. Revisar que no sea redundante con componentes existentes
5. Documentar dependencias y compatibilidad
6. Aprobación requerida antes de merge

---

## Especificación del Formulario del Dashboard

### Estructura del Prompt de Entrada

El formulario inicial debe generar una **ficha estructurada**, no texto libre:

```json
{
  "lab_concept": {
    "objective": "Comprender cómo varían los parámetros de un lanzamiento parabólico",
    "phenomenon": "Movimiento parabólico con ángulo y velocidad inicial ajustables",
    "educational_level": "Bachillerato",
    "subject": ["Física", "Matemáticas"],
    "duration_minutes": 20
  },
  
  "variables": {
    "manipulable": [
      { "name": "angle", "min": 0, "max": 90, "unit": "grados", "default": 45 },
      { "name": "velocity", "min": 1, "max": 60, "unit": "m/s", "default": 25 }
    ],
    "observed": [
      { "name": "max_height", "unit": "m", "precision": 2 },
      { "name": "range", "unit": "m", "precision": 2 },
      { "name": "flight_time", "unit": "s", "precision": 2 }
    ]
  },
  
  "representation": {
    "type": "Simulación Temporal",
    "visual": ["Trayectoria vectorial", "Gráficas x(t) e y(t)"],
    "interaction": ["Sliders", "Play/Pause", "Reset"]
  },
  
  "mathematical_model": {
    "equations": ["x(t) = v₀·cos(θ)·t", "y(t) = y₀ + v₀·sin(θ)·t - 0.5·g·t²"],
    "assumptions": ["Gravedad constante (9.81 m/s²)", "Sin resistencia del aire"],
    "limits": ["θ entre 0° y 90°", "v₀ positiva"]
  },
  
  "acceptance_criteria": {
    "mathematical_accuracy": "Máximo 1% de desviación de valores teóricos",
    "visual_fidelity": "Gráficas claras, colores consistentes",
    "responsive": "Funciona en 375px a 1920px",
    "performance": "60 FPS en simulación"
  },
  
  "delivery": {
    "mode": "modular",
    "format": "carpeta integrada en /simulaciones/",
    "educational_materials": true
  }
}
```

---

## Criterios Obligatorios de Validación

### Checklist de Aceptación (Obligatorio)

Antes de publicar un laboratorio, TODOS estos puntos deben estar checked:

- [ ] **Exactitud:** Valores calculados verificados contra soluciones analíticas o referencias confiables
- [ ] **Consola limpia:** Sin errores, warnings ni mensajes de depuración en modo producción
- [ ] **Reinicio determinista:** `reset()` devuelve el lab al estado inicial idéntico
- [ ] **Modo standalone:** Funciona abriendo `file:///path/to/index.html` en navegador
- [ ] **Modo integrado:** Funciona en el portal dentro de `simulaciones/`
- [ ] **Responsive 375px:** Diseño adaptado en móvil
- [ ] **Responsive 768px:** Funciona en tablet
- [ ] **Responsive 1280px:** Interfaz completa en desktop
- [ ] **Ratón:** Todos los controles funcionan con click/drag
- [ ] **Táctil:** Sliders, buttons y gestos funcionan en touchscreen
- [ ] **Accesibilidad:** Labels en inputs, colores accesibles, jerarquía semántica
- [ ] **Rendimiento:** 60 FPS durante simulación activa, sin lag perceptible
- [ ] **Navegadores:** Probado en Chrome, Firefox, Safari versiones mínimas especificadas
- [ ] **Dependencias:** SOLO archivos locales en `/shared/` o script inline. CERO CDN, CERO librerías externas sin autorización
- [ ] **Documentación:** README con instrucciones de uso y API

---

## Especificación del Paquete de Publicación

### Estructura de Entrega al Portal

Cuando un laboratorio está listo para publicación, debe incluir:

```
/simulaciones/nuevo-lab/
├── index.html                          ← Laboratorio funcional
├── lab.manifest.json                   ← Ficha técnica
├── nuevo-lab.css                       ← Estilos específicos
├── js/
│   ├── Model.js
│   ├── Presenter.js
│   └── [otros módulos específicos]
├── INSTRUCCIONES-PROFESOR.md           ← Guía para docentes
├── ACTIVIDADES-ALUMNADO.md             ← Ejercicios y experimentos
├── SOLUCIONES.md                       ← Respuestas y valores esperados
├── preview.png                         ← Captura 1280x720 para el portal
├── README.md                           ← Documentación técnica
└── [archivos adicionales si aplica]
```

### Contenido de Cada Documento

#### `lab.manifest.json`
- ID, versión, tipo
- Metadatos educativos
- Componentes usados
- Checklist de validación completado

#### `INSTRUCCIONES-PROFESOR.md`
- Objetivo del laboratorio
- Tiempo estimado
- Requisitos previos
- Materiales y recursos
- Procedimiento paso a paso
- Resultados esperados
- Preguntas de reflexión
- Extensiones y variantes

#### `ACTIVIDADES-ALUMNADO.md`
- 3-5 actividades guiadas de menor a mayor complejidad
- Predicciones antes de ejecutar
- Observaciones durante la simulación
- Conclusiones y análisis matemático
- Retos opcionales

#### `SOLUCIONES.md`
- Respuestas esperadas para cada actividad
- Valores numéricos aproximados (con tolerancia)
- Explicaciones de fenómenos observados
- Errores comunes y cómo evitarlos

### Taxonomía Educativa (Junta de Andalucía)

Obligatorio completar en `lab.manifest.json`:

```json
"educational": {
  "level": "1º Bachillerato",
  "subject": "Física",
  "competence": "STEM",
  "learning_objectives": [
    "Analizar el movimiento en dos dimensiones",
    "Relacionar variables en movimiento parabólico"
  ],
  "situation": "Situación de Aprendizaje: El Lanzamiento Olímpico",
  "cross_curricular": ["Matemáticas", "Tecnología"]
}
```

---

## Limitaciones Actuales

### Carencias que Requieren Trabajo Futuro

1. **Código fuente autocontenido:** El blueprint describe los componentes pero no los incluye íntegros. Una IA sin acceso al repositorio no puede copiar/pegar componentes completos. Solución propuesta: Generar un `COMPONENTS_BUNDLE.md` con código fuente de referencia.

2. **Bundler para versiones monolíticas:** No existe aún un script que genere automáticamente versiones standalone. Solución propuesta: Crear herramienta de bundling que mantenga sincronía entre modular y monolítico.

3. **Tests unitarios:** No hay suite de tests para validar que los componentes cumplen su contrato. Solución propuesta: Agregar test suite en cada componente.

---

## Variables CSS Globales

Definidas en `/shared/assets/css/verne-theme.css`:

```css
--grid-line-width: 0.5;     /* Ancho de línea del grid */
--grid-color: #e2e8f0;      /* Color del grid */
--axis-line-width: 1;       /* Ancho de línea de ejes */
--axis-color: #94a3b8;      /* Color de ejes */
```

**Nota:** Cambiar estas variables afecta TODOS los gráficos automáticamente.

## Notas Técnicas

### Flujo de Render en un Lab

1. `render()` se ejecuta (por interacción o cambio de viewport)
2. `graphRenderer.setViewport(...)` actualiza coordenadas
3. `graphRenderer.drawGridAndAxes()` limpia y dibuja grid
4. Funciones del lab dibujan su contenido (curvas, puntos, etc.)
5. Anotaciones se añaden si es necesario

### Margin en Canvas Labs

Algunos labs (ej: derivadas) necesitan margen para etiquetas de ejes. GraphRenderer soporta esto:

```javascript
const graphRenderer = new GraphRenderer(canvas, {
  // ... coordenadas ...
  margin: 52  // píxeles en cada lado
});
```

El margen se respeta en:
- Grid (se dibuja dentro del margen)
- Conversión de coordenadas (xToPixel, yToPixel)
- Viewport rendering

## Principios de Diseño

✅ **Modularidad extrema:** Un cambio en GraphRenderer afecta 100% de los gráficos.  
✅ **DRY (Don't Repeat Yourself):** Sin duplicación de código de grid.  
✅ **Consistencia visual:** Todos los gráficos se ven idénticos.  
✅ **Flexibility:** Labs pueden personalizar layout, no grid.  
✅ **Agnóstico:** Funciona con canvas y SVG sin cambios de lógica.  

## Roadmap

- [x] Crear GraphRenderer como componente modular
- [x] Refactorizar funciones-inecuaciones (SVG)
- [x] Refactorizar derivadas (Canvas + margin)
- [x] Refactorizar labs restantes (Cinemática 2D, Plano Inclinado)
- [x] Consolidar todos los componentes en /shared/components/
- [x] Eliminar /shared/js/ (legacy)
- [ ] Documentación de componentes (en progreso)
- [ ] Tests unitarios para GraphRenderer
- [ ] Temas de color (light/dark mode)
