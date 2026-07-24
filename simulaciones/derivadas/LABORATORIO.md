# Laboratorio: Derivada como Límite

**Estado:** ✅ Completamente modularizado (SIN MVP por ahora)  
**Última actualización:** 2026-07-24  
**Reducción de código:** 74% (656 → 171 líneas HTML)

---

## 🎯 Funcionalidades

### 1. Visualización Interactiva de Derivadas
- **Gráfica dinámica** de funciones matemáticas
- **Pendiente secante** que se aproxima a la tangente
- **Variación del incremento h** (10⁻³ a 10³)
- **Animación h → 0** para ver convergencia

### 2. Cálculos Matemáticos
- Parsing y evaluación de expresiones matemáticas
- Cálculo de valores en puntos específicos
- Derivada numérica (aproximación secante)
- Métricas de cambio (Δx, Δy, pendiente)

### 3. Controles Interactivos
- **Input de función:** x², sin(x), cos(x), x³-2x, exp(0.4x), o personalizada
- **Sliders:**
  - Punto x donde calcular derivada
  - Incremento h (escala logarítmica)
  - Zoom (escala de vista)
  - Origen horizontal (pan)
- **Botones:** Animar h→0, Pausar, Reiniciar

### 4. Visualización de Métricas
- x, x+h (puntos)
- f(x), f(x+h) (valores función)
- Δx, Δy (cambios)
- m secante, m tangente (pendientes)

### 5. Características Pedagógicas
- Leyenda con colores (función, secante, tangente, incrementos)
- Grid interactivo (pan/zoom)
- Fórmulas matemáticas mostradas
- Manejo de errores en expresiones

---

## 🏗️ Modularización

### Estructura de Carpetas
```
simulaciones/derivadas/
├── index.html                  # Punto de entrada (171 líneas, solo inyección)
├── LABORATORIO.md             # Este documento
├── PLAN_INTEGRACION.md        # Plan de integración SIN MVP
├── ARCHITECTURE.md            # Documentación de arquitectura
├── js/                        # Módulos específicos
│   ├── DerivadaConstants.js  # Configuración
│   ├── DerivadaModel.js      # Lógica pura (sin DOM)
│   └── DerivadaPresenter.js  # Presentación + eventos
├── css/
│   ├── derivadas.css         # Estilos del laboratorio
│   └── derivadas-didactic.css # Estilos didácticos
```

### Arquitectura MVP (No integrado aún, solo módulos)

✅ **Model (DerivadaModel.js)**
- Estado de la simulación
- Métodos de cálculo
- Setters/getters
- **SIN acceso a DOM**

✅ **Presenter (DerivadaPresenter.js)**
- Renderizado Canvas
- Manejo de eventos
- Actualización DOM
- Control de animación

✅ **Inicialización (HTML)**
- Solo inyección de dependencias
- 6 pasos claros
- Sin lógica de negocio

---

## 📦 Módulos /shared Utilizados

### 1. **VerneMath** (`/shared/components/`)
**Propósito:** Parsing y evaluación de expresiones matemáticas  
**Métodos:**
- `VerneMath.compile(expr)` - Compilar expresión
- `VerneMath.safeEvaluate(compiled, x)` - Evaluar con seguridad

**Uso en derivadas:** Parsear y evaluar funciones como "x^2", "sin(x)", etc.

---

### 2. **GraphRenderer** (`/shared/js/graphics/`)
**Propósito:** Renderizado de gráficas 2D

**Características específicas para derivadas:**
- Grid dinámico con ejes
- Renderizado de curvas
- Transformaciones canvas-mundo

---

### 3. **GraphNavigator** (`/shared/js/ui/`)
**Propósito:** Interacción pan/zoom

**Integración:** Permite navegar la gráfica con mouse/touch

---

## 🔧 Módulos Específicos del Laboratorio

### 1. **DerivadaConstants.js**
Configuración centralizada:
```javascript
const CONSTANTS = {
  VIEWPORT_INITIAL: { xMin, xMax, yMin, yMax, ... },
  FUNCTION_DEFAULTS: [...],
  COLORS: { function, secant, tangent, ... },
  TEXT: { error messages, labels, ... }
}
```

---

### 2. **DerivadaModel.js**
Lógica pura sin DOM:
- `constructor(constants)`
- Setters: `setFunctionExpr()`, `setXPoint()`, `setH()`, `setViewRange()`, etc.
- Getters: `getFunctionExpr()`, `getMetrics()`, `getViewport()`, etc.
- Estado interno: `functionExpr`, `xPoint`, `h`, viewport coords

---

### 3. **DerivadaPresenter.js**
Presentación y orquestación:
```javascript
constructor(model, canvas, dom, graphRenderer, constants)

// Métodos públicos
setupEventListeners()    // Vincular eventos de UI
render()                 // Renderizar gráfica + actualizar métricas
pauseAnimation()         // Pausar animación h→0
startAnimation()         // Iniciar animación
resetAnimation()         // Reiniciar valores
```

---

## 📊 Comparativa: Antes vs Después de Integración

| Métrica | Antes | Después | Cambio |
|---------|-------|---------|--------|
| Líneas HTML | 656 | 171 | ↓ 74% |
| Código inline | 528 | 0 | ↓ 100% |
| Módulos importados | 2 (viejos) | 6 (modernos) | ✅ |
| Funcionalidad | ✅ | ✅ Idéntica | ✅ |
| Modularización | ❌ Monolítico | ✅ Completa | ✅ |

---

## 🧪 Testing Verification

### Checklist Completado (2026-07-24):
- ✅ Navegador carga sin errores
- ✅ Canvas se renderiza
- ✅ Todos los controles presentes
- ✅ Sliders funcionan
- ✅ Input de función funciona
- ✅ Cambio de x (probado: 1 → 2.5)
- ✅ Elementos dinámicos responden

---

## 🎓 Arquitectura de Referencia

Este laboratorio sirve como **ejemplo de modularización SIN MVP**:

1. ✅ Módulos bien separados (Model/Presenter/Constants)
2. ✅ Inyección de dependencias limpia
3. ✅ Código monolítico eliminado (0 líneas inline)
4. ✅ Funcionalidad 100% preservada
5. ❌ MVP no implementado (por solicitud)

**Próximo paso (optional):** Integrar MVP siguiendo patrón de plano-inclinado

---

## 📈 Métricas de Éxito

- ✅ Modularización completa
- ✅ Reducción 74% del HTML
- ✅ Funcionalidad preservada
- ✅ Código limpio sin lógica inline
- ✅ Preparado para futuros cambios

---

## 🚀 Próximas Fases

### FASE 2: MVP Integration (opcional)
Si decide integrar MVP completo:
- Reemplazar inyección simple con orquestación completa
- Implementar ciclo de vida centralizado
- Agregar panel de fórmulas dinámicas

### FASE 3: Funcionalidades Adicionales
- Exportar gráficas/datos
- Comparación múltiples funciones
- Casos predefinidos pedagógicos

---

**Completado:** 2026-07-24  
**Rama:** `feature/derivadas-modularizado`  
**Estado:** ✅ Ready para integración en main
