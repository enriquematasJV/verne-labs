# Plan de Integración: Derivadas (SIN MVP)

**Estado:** 🔧 Planificación  
**Objetivo:** Integrar módulos sin cambiar funcionalidad  
**Metodología:** Pequeños cambios incrementales + verificación navegador  

---

## 📊 Diagnóstico Actual

| Aspecto | Estado |
|---------|--------|
| HTML | 658 líneas (monolítico) |
| Código inline | 528 líneas |
| Módulos .js | ✅ 3 creados (Model, Presenter, Constants) |
| Módulos integrados | ❌ 0 (no importados en HTML) |
| Funcionalidad | ✅ Completa y funcional |
| /shared utilizado | ⚠️ Solo antiguo (math-parser, graph-navigator) |

---

## 🎯 Objetivo de Esta Rama

✅ **Integrar módulos en HTML**  
✅ **Usar /shared modernizado**  
✅ **Mantener funcionalidad idéntica**  
❌ **NO introducir MVP** (solo integración)  
✅ **Documentar estado**  

---

## 📋 Módulos Existentes

### DerivadaModel.js ✅
```javascript
class DerivadaModel {
  constructor(constants) { ... }
  
  // Setters
  setFunctionExpr(expr)
  setXPoint(x)
  setH(h)
  setViewRange(zoomVal)
  setOrigin(originVal)
  setViewport(xMin, xMax, yMin, yMax)
  setManualView(bool)
  setCanvasSize(width, height)
  
  // Getters
  getFunctionExpr()
  getCompiled()
  getDerivativeValue()
  getMetrics()
  getViewport()
  // ... más métodos
}
```

**Responsabilidad:** Estado + lógica pura (sin DOM)

---

### DerivadaPresenter.js ✅
```javascript
class DerivadaPresenter {
  constructor(model, canvas, dom, graphRenderer, constants) { ... }
  
  setupEventListeners()
  render()
  pauseAnimation()
  startAnimation()
  resetAnimation()
  // ... más métodos
}
```

**Responsabilidad:** Eventos + renderizado + DOM

---

### DerivadaConstants.js ✅
```javascript
const CONSTANTS = {
  VIEWPORT_INITIAL: { ... },
  FUNCTION_DEFAULTS: { ... },
  COLORS: { ... },
  TEXT: { ... },
  // ... más configuración
}
```

**Responsabilidad:** Configuración centralizada

---

## 🔧 Módulos /shared Necesarios

| Módulo | Uso | Ruta Actual | Actualización |
|--------|-----|-------------|---------------|
| VerneMath | Parsing de expresiones | Antiguo (math-parser) | ✅ Cambiar a nuevo |
| GraphRenderer | Renderizado de gráficos | Antiguo (graph-navigator) | ✅ Cambiar a nuevo |
| GraphNavigator | Pan/zoom interactivo | ❌ graph-navigator deprecated | ✅ Reemplazar |

---

## 📝 Plan de Integración Step-by-Step

### PASO 1: Actualizar Imports en HTML (5 min)

**Archivo:** `index.html`

**Cambiar:**
```html
<!-- ❌ VIEJO -->
<script src="../../shared/js/math/math-parser.js"></script>
<script src="../../shared/js/ui/graph-navigator.js"></script>
```

**Por:**
```html
<!-- ✅ NUEVO -->
<script src="../../shared/components/VerneMath/VerneMath.js"></script>
<script src="../../shared/js/graphics/GraphRenderer.js"></script>
<script src="../../shared/js/ui/GraphNavigator.js"></script>
```

**Verificación:** Abre navegador, no debe haber errores en consola

---

### PASO 2: Importar Módulos de Derivadas (5 min)

**Añadir después de imports /shared:**
```html
<!-- Módulos específicos de Derivadas -->
<script src="./js/DerivadaConstants.js"></script>
<script src="./js/DerivadaModel.js"></script>
<script src="./js/DerivadaPresenter.js"></script>
```

**Verificación:** console.log(DerivadaModel) debe existir

---

### PASO 3: Reemplazar Código Inline (10-15 min)

**Ubicación:** Final de `index.html` (línea ~127)

**Estado actual:** ~528 líneas de código inline

**Estrategia:** 
1. Identificar qué hace el código
2. Crear referencias DOM necesarias
3. Instanciar Model, Presenter, Constants
4. Eliminar todo lo demás

**Estructura resultante:**
```javascript
<script>
  // 1. Obtener elementos DOM
  const canvas = document.getElementById('graph');
  const dom = {
    functionInput: document.getElementById('functionInput'),
    xPoint: document.getElementById('xPoint'),
    hSlider: document.getElementById('hSlider'),
    zoomSlider: document.getElementById('zoomSlider'),
    // ... rest de referencias
  };
  
  // 2. Crear GraphRenderer
  const graphRenderer = new GraphRenderer(canvas);
  
  // 3. Instanciar Model
  const model = new DerivadaModel(DerivadaConstants);
  
  // 4. Instanciar Presenter
  const presenter = new DerivadaPresenter(
    model, 
    canvas, 
    dom, 
    graphRenderer, 
    DerivadaConstants
  );
  
  // Fin - Todo delegado a Presenter
</script>
```

**Verificación:** 
- ✓ Abre navegador
- ✓ Gráfico se muestra
- ✓ Sliders funcionan
- ✓ Función se puede cambiar
- ✓ Animation funciona

---

### PASO 4: Documentar Estado (5 min)

**Crear:** `LABORATORIO.md`
- Funcionalidades
- Modularización
- Estado de integración
- Próximos pasos

---

## ⚠️ Puntos de Atención

1. **GraphRenderer vs Canvas2DRenderer:**
   - Derivadas usa GraphRenderer (específico para gráficas)
   - Plano-inclinado usa Canvas2DRenderer (general)
   - NO cambiar, están optimizados para cada caso

2. **Deprecated modules:**
   - `graph-navigator.js` → `GraphNavigator.js` (módulo /shared)
   - `math-parser.js` → `VerneMath.js` (componente /shared)

3. **DOM references:**
   - El Presenter espera objeto `dom` con todas las referencias
   - Verificar que todas las IDs existan en HTML

4. **Error handling:**
   - Si algo falla, verificar console.log
   - VerneMath puede lanzar excepciones en parsing

---

## 🧪 Testing Checklist

Antes de hacer commit:

- [ ] Navegador carga sin errores
- [ ] Canvas se renderiza
- [ ] Input de función se puede cambiar
- [ ] Función x² se visualiza
- [ ] Slider de x funciona
- [ ] Slider de h funciona
- [ ] Slider de zoom funciona
- [ ] Botón "Animar h → 0" funciona
- [ ] Botón "Pausar" funciona
- [ ] Botón "Reiniciar" funciona
- [ ] Métricas se actualizan correctamente
- [ ] Error box muestra errores de syntax

---

## 📊 Resultados Esperados

**Después de integración:**
- HTML: 658 → ~250 líneas (sin código inline)
- Módulos importados: 2 → 5 (/shared + específicos)
- Funcionalidad: 100% idéntica
- Código limpio y mantenible

---

## 🚀 Siguiente Fase (DESPUÉS de verificación)

Una vez integrado y funcional:
1. Crear documentación LABORATORIO.md
2. Aplicar MVP (si lo decide el usuario)
3. Pasar a siguiente laboratorio

---

**Fecha creación:** 2026-07-24  
**Rama:** `feature/derivadas-modularizado`  
**Estado:** Ready para implementación
