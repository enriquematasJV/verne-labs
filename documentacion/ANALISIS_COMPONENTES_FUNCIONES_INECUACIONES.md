# Análisis de Componentes: Funciones-Inecuaciones

## Resumen Ejecutivo

**Lab**: `simulaciones/funciones-inecuaciones/`  
**Estado**: ✅ Bien arquitecturado  
**Proporción SHARED**: 4/8 = **50%**  
**Refactorizable a SHARED**: ~1-2 componentes con potencial

---

## 🎯 COMPONENTES SHARED (4)

### 1. **VerneMath** → `../../shared/components/VerneMath/VerneMath.js`
- **Responsabilidad**: Parsing y evaluación segura de expresiones matemáticas
- **Uso en lab**: Parsear inecuaciones y funciones de texto a expresiones evaluables
- **Crítico para**: `FuncionesInecuacionesModel._parseInequalities()` y `._parseFunctions()`
- **Reutilizable**: ✅ Sí (usado en todos los labs)

### 2. **GraphRenderer** → `../../shared/components/GraphRenderer/GraphRenderer.js`
- **Responsabilidad**: Renderizar ejes, grid, y decoraciones cartesianas
- **Uso en lab**: Base de la representación gráfica (ejes, escalas, grid)
- **Integración**: Usado por `Graph2DEngine`
- **Reutilizable**: ✅ Sí (componente universal)

### 3. **Graph2DEngine** → `../../shared/components/Graph2DEngine/Graph2DEngine.js`
- **Responsabilidad**: Motor gráfico que combina rendering de gráficos 2D y transformaciones
- **Uso en lab**: Dibuja funciones como líneas continuas; maneja viewport/zoom
- **API crítica**:
  - `drawCurve(fn, bounds, color, label)` → dibuja función como línea
  - `getTransform()` → obtiene matriz de transformación para convertir coords matemáticas → canvas
- **Reutilizable**: ✅ Sí (utilizado en Derivadas y Funciones-Inecuaciones)

### 4. **GraphNavigator** → `../../shared/components/GraphNavigator/GraphNavigator.js`
- **Responsabilidad**: Interactividad de pan/zoom en canvas
- **Uso en lab**: Permite arrastrar gráfico y zoom con rueda de ratón
- **Integración**: Se adjunta al canvas en el Presenter (línea 67)
- **Reutilizable**: ✅ Sí (utilizado en todos los labs con gráficos 2D)

---

## 📋 COMPONENTES ESPECÍFICOS (4)

### 1. **FuncionesInecuacionesModel** → `./js/FuncionesInecuacionesModel.js`
- **Responsabilidad**: Estado y lógica del dominio
  - Mantener modo (inecuaciones vs funciones)
  - Parsear texto de entrada (lazy evaluation)
  - Gestionar viewport (viewRange, center)
- **Métodos clave**:
  - `getInequalities()` → array de objetos `{kind, op, fn, color}`
  - `getFunctions()` → array de objetos `{fn, color}`
  - `_parseInequalities(text)` → parse inecuaciones con formato "y < log(x) ; orange"
  - `_parseFunctions(text)` → parse funciones con formato "y = x^2 ; red"
- **Específico porque**: Lógica de parsing de sintaxis específica del lab
- **Refactorable**: ❌ No (parseadores muy específicos)

### 2. **FuncionesInecuacionesView** → `./js/FuncionesInecuacionesView.js`
- **Responsabilidad**: Interacción con DOM y feedback visual
  - Mostrar/ocultar paneles según modo
  - Actualizar etiquetas de estado (✅ correcto, ❌ errores)
  - Capturar eventos de entrada
- **Métodos clave**:
  - `updateModeUI(mode)` → toggle botones y paneles
  - `updateInequalityStatus(errors, count)` → mostrar validación
  - `onModeChanged(callback)` → escuchar cambios de modo
  - `onInequalityTextChanged(callback)` → escuchar cambios en textarea
- **Específico porque**: Elementos DOM muy específicos del layout
- **Refactorable**: ❌ No (fuertemente acoplado al HTML)

### 3. **FuncionesInecuacionesPresenter** → `./js/FuncionesInecuacionesPresenter.js`
- **Responsabilidad**: Orquestación MVP + lógica gráfica
  - Crear Graph2DEngine
  - Crear InequalityRegionRenderer
  - Conectar GraphNavigator
  - Render según modo (inecuaciones → sombreado; funciones → líneas)
- **Métodos clave**:
  - `setupEventListeners()` → conectar View al Model
  - `render()` → lógica de rendering condicional:
    ```javascript
    if (mode === 'inequalities') {
      this.regionRenderer.drawRegion(inequalities)
    } else {
      this.graphEngine.drawCurve(fn, bounds, color)
    }
    ```
- **Específico porque**: Combina lógica de este lab (dos modos) con gráficos
- **Refactorable**: ⚠️ Parcialmente (la lógica de rendering condicional podría abstraerse)

### 4. **InequalityRegionRenderer** → `./components/InequalityRegionRenderer/InequalityRegionRenderer.js`
- **Responsabilidad**: Sombrear áreas que satisfacen inecuaciones
  - Evaluar si punto (x, y) satisface una inecuación
  - Dibujar rectángulos sombreados pixel-by-pixel
- **Métodos clave**:
  - `satisfies(ineq, x, y)` → boolean (¿punto cumple inecuación?)
  - `drawRegion(inequalities)` → itera canvas, suma satisfacciones, sombrea
  - `drawCurveRegion(ineq)` → sombrea área debajo/arriba de función
- **Específico porque**: Lógica muy especializada en sombreado de inecuaciones
- **Refactorable**: ✅ **SÍ** (podría ser componente SHARED para otros labs que necesiten sombreado)

---

## 📊 Matriz de Responsabilidades

| Componente | MVP Layer | Responsabilidad | Acoplamiento |
|---|---|---|---|
| FuncionesInecuacionesModel | Model | Estado + parsing | Bajo (datos puros) |
| FuncionesInecuacionesView | View | DOM + eventos | Alto (HTML específico) |
| FuncionesInecuacionesPresenter | Presenter | Orquestación | Medio (combina Model+View+gráficos) |
| InequalityRegionRenderer | Helper | Sombreado de regiones | Bajo (toma inequalities[], dibuja) |
| Graph2DEngine | Helper | Gráficos 2D | Bajo (función → línea) |
| GraphNavigator | Helper | Interactividad | Bajo (canvas plugin) |

---

## 🔄 Flujo de Datos

```
HTML Input (textarea)
      ↓
View.onTextChanged()
      ↓
Presenter.setupEventListeners() → Model.setInequalityText()
      ↓
Model._parseInequalities() [usa VerneMath]
      ↓
Presenter.render()
      ├─ Graph2DEngine.clear()
      ├─ GraphRenderer.drawGrid/Axes
      ├─ InequalityRegionRenderer.drawRegion() [si modo=inecuaciones]
      └─ Graph2DEngine.drawCurve() [si modo=funciones]
      ↓
Canvas actualizado
```

---

## 🎯 Refactorización Potencial

### 1. **REFACTORABLE: InequalityRegionRenderer → SHARED**

**Por qué**: 
- Lógica de sombreado de regiones es genérica y reutilizable
- Podría usarse en otros labs (ej: Cinemática con área bajo la curva)
- No depende de la sintaxis específica de Funciones-Inecuaciones

**Cambios requeridos**:
1. Mover a `/shared/components/InequalityRegionRenderer/`
2. Refactorizar método `satisfies()` para aceptar predicados genéricos
3. Documentar API en README.md

**Beneficio**: 
- Reduce duplicación de código de sombreado
- Reutilizable en hasta 2-3 labs más

**Esfuerzo**: 🟢 Bajo (solo mover + documentar)

---

### 2. **NO REFACTORABLE: Model/View/Presenter**

**Por qué**:
- **Model**: El parsing de "y < log(x) ; orange" es muy específico
- **View**: HTML layout es único (dos textareas, dos paneles)
- **Presenter**: Lógica de dos modos (inecuaciones/funciones) es específica

**Conclusión**: Dejar como están

---

## 🔗 Dependencias Cruzadas

Este lab **usa compartidos** pero **no es usado** por otros labs:
- Únicas dependencias compartidas: VerneMath, Graph2DEngine, GraphNavigator
- Ningún otro lab importa FuncionesInecuacionesModel, View, o Presenter

```
Funciones-Inecuaciones
    ├── usa: VerneMath (parsing)
    ├── usa: Graph2DEngine (gráficos)
    ├── usa: GraphNavigator (zoom/pan)
    └── define: InequalityRegionRenderer (potencial SHARED)

No es usado por:
    - Derivadas
    - Plano Inclinado
    - Cinemática 2D
```

---

## 📈 Índices de Reutilización

```
SHARED Components (4):
  VerneMath ..................... ████████████████ 100% (usado en todos)
  Graph2DEngine ................. ███████████████  75% (Derivadas, Funciones-Inecuaciones)
  GraphRenderer ................. ████████████████ 100% (base universal)
  GraphNavigator ................ ███████████████  75% (labs con gráficos 2D)

ESPECÍFICO Components (4):
  FuncionesInecuacionesModel .... ███ 0% (solo aquí)
  FuncionesInecuacionesView ..... ███ 0% (solo aquí)
  FuncionesInecuacionesPresenter ███ 0% (solo aquí)
  InequalityRegionRenderer ...... ██ 25% (potencial en otros labs)
```

---

## ✅ Conclusión

**Estado actual**: **BUENO** ✅
- Componentes SHARED bien utilizados
- Componentes específicos bien separados
- Bajo acoplamiento

**Mejora sugerida**: **Mover InequalityRegionRenderer a SHARED**
- Esfuerzo: Bajo
- Beneficio: Reutilización en otros labs
- Prioridad: Baja (es opcional)

**Recomendación**: Dejar como está por ahora. La refactorización de InequalityRegionRenderer es opcional y se puede hacer cuando otro lab lo necesite.
