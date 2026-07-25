# MAPEO EXHAUSTIVO: CSS y Componentes

**Fecha**: 2026-07-25  
**Propósito**: Documentar TODOS los archivos CSS y componentes, sus rutas reales y código fuente

---

## PARTE 1: ESTRUCTURA CSS (de genérico a específico)

### Nivel 0: CSS Globales (Raíz del proyecto)

#### 1.1 `/shared/assets/css/verne-theme.css` — Variables CSS compartidas
**Ruta**: `/shared/assets/css/verne-theme.css`  
**Propósito**: Define variables CSS globales (colores, tipografía, espaciados)  
**Usado por**: Importada por `/css/labs-common.css`, usada por todos los labs

```css
Variables definidas:
- Tipografía: --font-family
- Colores base: --bg, --panel, --text, --muted, --soft, --border
- Acentos: --accent, --accent-blue, --danger, --info, --ok, --warning
- Espacios: --radius, --radius-sm
- Gráficos: --grid-line-width, --grid-color, --axis-line-width, --axis-color
```

#### 1.2 `/css/labs-common.css` — Estilos base para labs
**Ruta**: `/c/Users/Enrique/Desktop/DESARROLLO-IA/verne-labs/css/labs-common.css`  
**Propósito**: Estilos comunes a TODOS los labs (header, botones, controles, canvas)  
**Usado por**: Todo lab importa este archivo

#### 1.3 `/css/didactic-common.css` — Estilos pedagógicos comunes
**Ruta**: `/c/Users/Enrique/Desktop/DESARROLLO-IA/verne-labs/css/didactic-common.css`  
**Propósito**: Estilos para paneles pedagógicos (fórmulas, métricas, explicaciones)  
**Usado por**: Labs con contenido didáctico

#### 1.4 `/css/styles.css` — Estilos globales (legado)
**Ruta**: `/c/Users/Enrique/Desktop/DESARROLLO-IA/verne-labs/css/styles.css`  
**Propósito**: Estilos generales del sitio (puede ser redundante)  
**Estado**: ⚠️ Verificar si se sigue usando o si es legado

---

### Nivel 1: CSS de Componentes SHARED

#### Ubicación estándar: `/shared/components/[NombreComponente]/[nombre].css`

| Componente | Ruta | Propósito |
|-----------|------|----------|
| VerneMath | `/shared/components/VerneMath/verne-math.css` | Estilos para parsing (si UI tiene) |
| GraphRenderer | `/shared/components/GraphRenderer/graph-renderer.css` | Estilos para gráfico cartesiano |
| Graph2DEngine | `/shared/components/Graph2DEngine/graph-2d-engine.css` | Estilos para motor 2D |
| GraphNavigator | `/shared/components/GraphNavigator/graph-navigator.css` | Estilos para navegación pan/zoom |
| GraphDisplay | `/shared/components/GraphDisplay/graph-display.css` | Estilos para visualización |
| VectorRenderer | `/shared/components/VectorRenderer/` | ⚠️ Verificar si tiene CSS |
| MathematicalModelPanel | `/shared/components/MathematicalModelPanel/mathematical-model-panel.css` | Estilos para panel de fórmulas |
| Canvas2DRenderer | `/shared/components/Canvas2DRenderer/canvas-2d-renderer.css` | Estilos para canvas 2D |
| ChartRenderer | `/shared/components/ChartRenderer/chart-renderer.css` | Estilos para gráficos de barras/líneas |
| SimulationLifecycle | `/shared/components/SimulationLifecycle/simulation-lifecycle.css` | Estilos para control de simulación |
| SliderControl | `/shared/components/SliderControl/slider-control.css` | Estilos para sliders |
| KinematicsEngine | `/shared/components/KinematicsEngine/kinematics-engine.css` | Estilos para cinemática (si UI) |
| OdeSolverRK4 | `/shared/components/OdeSolverRK4/ode-solver-rk4.css` | Estilos para visualización EDO |
| PhysicsEngine | `/shared/components/PhysicsEngine/physics-engine.css` | Estilos para física (si UI) |
| Vector2D | `/shared/components/Vector2D/vector-2d.css` | Estilos para vectores (si UI) |
| MathUtils | `/shared/components/MathUtils/math-utils.css` | Estilos para utilidades (si UI) |

#### Assets globales: `/shared/assets/css/`
| Archivo | Propósito |
|---------|----------|
| `verne-theme.css` | Tema global del proyecto |

---

### Nivel 2: CSS Específicos de Laboratorios

#### ⚠️ INCONSISTENCIAS DETECTADAS:

**Algunos labs tienen CSS en DOS ubicaciones** (posible duplicación):

```
cinematica-2d:
  ├─ /simulaciones/cinematica-2d/cinematica-2d.css (raíz)
  ├─ /simulaciones/cinematica-2d/css/cinematica-2d.css (subdirectorio)
  └─ /simulaciones/cinematica-2d/cinematica-2d-didactic.css (variante pedagógica)

derivadas:
  ├─ /simulaciones/derivadas/derivadas.css
  └─ /simulaciones/derivadas/derivadas-didactic.css

plano-inclinado:
  └─ /simulaciones/plano-inclinado/css/plano-inclinado.css (única ubicación ✓)

funciones-inecuaciones:
  └─ /simulaciones/funciones-inecuaciones/funciones-inecuaciones.css (raíz)
```

**¿Cuál estructura es correcta?**
- ✅ `plano-inclinado/css/plano-inclinado.css` — Subdirectorio organizado
- ⚠️ `derivadas/derivadas.css` — En raíz (menos organizado)
- ⚠️ Duplicados en cinematica-2d — ¿Cuál se usa realmente?

#### Tabla de Labs y su CSS

| Lab | CSS Específico | Ubicación | Didactic | Estado |
|-----|---|---|---|---|
| derivadas | derivadas.css | Raíz | derivadas-didactic.css | ⚠️ Revisar |
| cinematica-2d | cinematica-2d.css | Raíz + `css/` | cinematica-2d-didactic.css | ⚠️ DUPLICADO |
| plano-inclinado | plano-inclinado.css | `css/` | (no) | ✅ Organizado |
| funciones-inecuaciones | funciones-inecuaciones.css | Raíz | (no) | ⚠️ Revisar |
| ecologia-poblaciones | ecologia-poblaciones.css | Raíz | ecologia-poblaciones-didactic.css | ⚠️ Revisar |
| cinematica-encuentros-alcances | cinematica-encuentros-alcances.css | Raíz | cinematica-encuentros-alcances-didactic.css | ⚠️ Revisar |
| numeros-complejos-fasores-y-ondas | numeros-complejos-fasores-y-ondas.css | Raíz | (no) | ⚠️ Revisar |
| representación-de-mapas-geológicos | representación-de-mapas-geológicos.css | Raíz | (no) | ⚠️ Revisar |

---

## PARTE 2: ESTRUCTURA DE COMPONENTES SHARED

### ¿Dónde están los componentes?

**Ubicación oficial**: `/shared/components/[NombreComponente]/`

**Ubicación legada** (todavía en uso): `/shared/js/[categoría]/`

### Mapa de Componentes

#### A) COMPONENTES NUEVOS (en `/shared/components/`)

```
/shared/components/
├── VerneMath/
│   ├── VerneMath.js              [Compilador de expresiones f(x)]
│   └── verne-math.css
│
├── GraphRenderer/
│   ├── GraphRenderer.js           [Renderizador de ejes + grid cartesiano]
│   └── graph-renderer.css
│
├── Graph2DEngine/
│   ├── Graph2DEngine.js           [Motor gráfico universal XY]
│   └── graph-2d-engine.css
│
├── GraphNavigator/
│   ├── GraphNavigator.js          [Plugin pan/zoom interactivo]
│   └── graph-navigator.css
│
├── GraphDisplay/
│   ├── GraphDisplay.js            [Visualización genérica]
│   └── graph-display.css
│
├── VectorRenderer/
│   ├── VectorRenderer.js          [Flechas, descomposiciones, campos]
│   └── (sin CSS específico)
│
├── MathematicalModelPanel/
│   ├── MathematicalModelPanel.js  [Panel dinámico de fórmulas]
│   └── mathematical-model-panel.css
│
├── Canvas2DRenderer/
│   ├── Canvas2DRenderer.js        [Wrapper de primitivas Canvas 2D]
│   └── canvas-2d-renderer.css
│
├── ChartRenderer/
│   ├── ChartRenderer.js           [Gráficos de barras, líneas, áreas]
│   └── chart-renderer.css
│
├── SliderControl/
│   ├── SliderControl.js           [Sliders interactivos]
│   └── slider-control.css
│
├── SimulationLifecycle/
│   ├── SimulationLifecycle.js     [Máquina de estados simulación]
│   └── simulation-lifecycle.css
│
├── OdeSolverRK4/
│   ├── OdeSolverRK4.js            [Solucionador de EDOs RK4]
│   └── ode-solver-rk4.css
│
├── PhysicsEngine/
│   ├── PhysicsEngine.js           [Motor de física]
│   └── physics-engine.css
│
├── KinematicsEngine/
│   ├── KinematicsEngine.js        [Cinemática 1D]
│   └── kinematics-engine.css
│
├── Vector2D/
│   ├── Vector2D.js                [Operaciones vectoriales]
│   └── vector-2d.css
│
├── MathUtils/
│   ├── MathUtils.js               [Funciones matemáticas auxiliares]
│   └── math-utils.css
│
└── (más componentes...)
```

#### B) COMPONENTES LEGADOS (en `/shared/js/`)

**Nota**: Todavía se usan pero deberían migrarse a `/shared/components/`

```
/shared/js/
├── graphics/
│   ├── Canvas2DRenderer.js        [DUPLICADO en /components/]
│   ├── ChartRenderer.js           [DUPLICADO en /components/]
│   └── Graph2DEngine.js           [DUPLICADO en /components/]
│
├── math/
│   ├── Vector2D.js                [DUPLICADO en /components/]
│   ├── MathUtils.js               [DUPLICADO en /components/]
│   └── math-parser.js             [¿Legado?]
│
├── physics/
│   ├── PhysicsEngine.js           [DUPLICADO en /components/]
│   ├── OdeSolverRK4.js            [DUPLICADO en /components/]
│   └── KinematicsEngine.js        [DUPLICADO en /components/]
│
├── simulations/
│   └── SimulationLifecycle.js     [DUPLICADO en /components/]
│
└── ui/
    └── SliderControl.js           [DUPLICADO en /components/]
```

---

## PARTE 3: IMPORTS EN HTML (Rutas reales usadas)

### Labs y cómo importan CSS

```html
<!-- ✅ RUTA CORRECTA: Siempre ../../ para subir 2 niveles -->

<!-- CSS Genéricos -->
<link rel="stylesheet" href="../../css/labs-common.css" />
<link rel="stylesheet" href="../../css/theme.css" />
<link rel="stylesheet" href="../../css/didactic-common.css" />

<!-- CSS Específico del lab -->
<link rel="stylesheet" href="./derivadas.css" />
<link rel="stylesheet" href="./css/cinematica-2d.css" />

<!-- CSS de componentes SHARED (raro, algunos labs lo hacen) -->
<link rel="stylesheet" href="../../shared/components/MathematicalModelPanel/mathematical-model-panel.css" />
```

### Labs y cómo importan JS

```html
<!-- ✅ COMPONENTES NUEVOS (preferir) -->
<script src="../../shared/components/VerneMath/VerneMath.js"></script>
<script src="../../shared/components/GraphRenderer/GraphRenderer.js"></script>

<!-- ⚠️ COMPONENTES LEGADOS (migrar) -->
<script src="../../shared/js/graphics/Canvas2DRenderer.js"></script>
<script src="../../shared/js/math/Vector2D.js"></script>
<script src="../../shared/js/physics/PhysicsEngine.js"></script>

<!-- ✅ CÓDIGO ESPECÍFICO DEL LAB -->
<script src="./js/DerivadaModel.js"></script>
<script src="./js/DerivadaPresenter.js"></script>
```

---

## PROBLEMAS IDENTIFICADOS

### 🔴 Críticos

1. **Componentes en dos ubicaciones (DUPLICACIÓN)**
   ```
   Canvas2DRenderer en:
     ├─ /shared/components/Canvas2DRenderer/Canvas2DRenderer.js
     └─ /shared/js/graphics/Canvas2DRenderer.js  ← ¿Cuál es la autoridad?
   
   Vector2D en:
     ├─ /shared/components/Vector2D/Vector2D.js
     └─ /shared/js/math/Vector2D.js  ← ¿Cuál es la autoridad?
   ```

2. **CSS en dos ubicaciones para el mismo lab**
   ```
   cinematica-2d:
     ├─ /simulaciones/cinematica-2d/cinematica-2d.css
     └─ /simulaciones/cinematica-2d/css/cinematica-2d.css
     
   ¿Cuál se carga? ¿Son idénticos o diferentes?
   ```

### 🟡 Moderados

3. **Inconsistencia en estructura de carpetas**
   ```
   Algunos labs: /lab/derivadas.css (raíz)
   Otros labs:   /lab/css/plano-inclinado.css (subdirectorio)
   
   → Debería ser UNO solo (recomendación: subdirectorio)
   ```

4. **CSS "didactic" sin claridad**
   ```
   ¿Qué son los -didactic.css?
   ¿Se cargan siempre o solo en ciertos modos?
   ¿Están duplicados con el CSS normal?
   ```

5. **Componentes con CSS que podrían estar vacíos**
   ```
   ¿Tienen contenido real o están vacíos?
   - physics-engine.css
   - ode-solver-rk4.css
   - kinematics-engine.css
   ```

---

## RECOMENDACIONES INMEDIATAS

### Paso 1: Verificar Duplicados
```bash
diff /shared/components/Canvas2DRenderer/Canvas2DRenderer.js \
     /shared/js/graphics/Canvas2DRenderer.js
     
diff /shared/components/Vector2D/Vector2D.js \
     /shared/js/math/Vector2D.js
```

Si son idénticos → **Eliminar uno y actualizar imports**

### Paso 2: Normalizar estructura de labs CSS
```
Estructura RECOMENDADA (seguir ejemplo de plano-inclinado):

lab/
├── index.html
├── js/
│   ├── [lab]Constants.js
│   ├── [lab]Model.js
│   └── [lab]Presenter.js
├── css/                      ← Subdirectorio
│   └── [lab].css            ← Único lugar para CSS específico
└── [si es necesario] components/
    └── [componente]/
```

### Paso 3: Aclarar CSS "didactic"
- Documentar qué es
- Unificar con CSS normal o separar clara­mente
- Actualizar imports en HTML

### Paso 4: Crear matriz definitiva
```markdown
| Componente | Ubicación ÚNICA | Uso |
|-----------|---|---|
| Canvas2DRenderer | /shared/components/ | Primitivas 2D |
| Vector2D | /shared/components/ | Matemática vectorial |
| ...
```

---

**Próximo paso**: Lee código fuente de cada archivo (CSS + JS) para completar este mapeo.

¿Empiezo a leer los archivos CSS para mostrar código fuente?
