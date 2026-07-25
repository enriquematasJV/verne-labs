# REPORTE: Versiones Duplicadas de Componentes

**Fecha**: 2026-07-25  
**Hallazgo crítico**: Existen DOS versiones diferentes de los mismos componentes en DOS ubicaciones, y los labs usan AMBAS indistintamente.

---

## Resumen Ejecutivo

| Componente | Ubicación 1 | Ubicación 2 | Versión Usada | Estado |
|-----------|-----------|-----------|---|---|
| Canvas2DRenderer | `/components/` (132L) | `/js/graphics/` (132L) | ✅ `/js/` | CONFLICTO |
| Vector2D | `/components/` (101L) | `/js/math/` (101L) | ✅ `/js/` | CONFLICTO |
| SimulationLifecycle | `/components/` (290L) | `/js/simulations/` (290L) | ✅ `/js/` | CONFLICTO |
| PhysicsEngine | `/components/` (34L) | `/js/physics/` (34L) | ✅ `/js/` | CONFLICTO |
| OdeSolverRK4 | `/components/` (53L) | `/js/physics/` (53L) | ❌ Ninguno | CONFLICTO |
| KinematicsEngine | `/components/` (92L) | `/js/physics/` (22L) | ✅ `/js/` | ⚠️ VERSIONES MUY DIFERENTES |
| SliderControl | `/components/` (58L) | `/js/ui/` (58L) | ✅ `/js/` | CONFLICTO |
| Graph2DEngine | `/components/` (851L) | `/js/graphics/` (778L) | ✅ `/js/` | ⚠️ VERSIONES DIFERENTES |

**Conclusión**: Los labs usan `/shared/js/` (versiones viejas), no `/shared/components/` (versiones nuevas).

---

## Análisis Detallado: Quién usa QUÉ

### Canvas2DRenderer

**Versión usada en labs**:
```
✅ Cinemática 2D     → ../../shared/js/graphics/Canvas2DRenderer.js
✅ Plano Inclinado   → ../../shared/js/graphics/Canvas2DRenderer.js
```

**Versión NO usada**:
```
❌ Derivadas             → No usa Canvas2DRenderer
❌ Funciones-Inecuaciones → No usa Canvas2DRenderer
```

**Estado**: Hay dos archivos con 132 líneas cada uno pero CONTENIDO DIFERENTE en:
- `/shared/components/Canvas2DRenderer/Canvas2DRenderer.js`
- `/shared/js/graphics/Canvas2DRenderer.js`

**Pregunta**: ¿Cuál es más nuevo? ¿Cuál es la versión de desarrollo actual?

---

### Vector2D

**Versión usada en labs**:
```
✅ Cinemática 2D     → ../../shared/js/math/Vector2D.js
✅ Plano Inclinado   → ../../shared/js/math/Vector2D.js
```

**Versión NO usada**:
```
❌ Derivadas             → No usa Vector2D
❌ Funciones-Inecuaciones → No usa Vector2D
```

**Estado**: Dos archivos con 101 líneas cada uno pero CONTENIDO DIFERENTE en:
- `/shared/components/Vector2D/Vector2D.js`
- `/shared/js/math/Vector2D.js`

---

### SimulationLifecycle

**Versión usada en labs**:
```
✅ Cinemática 2D   → ../../shared/js/simulations/SimulationLifecycle.js
✅ Plano Inclinado → ../../shared/js/simulations/SimulationLifecycle.js
```

**Versión NO usada**:
```
❌ Derivadas             → No usa SimulationLifecycle
❌ Funciones-Inecuaciones → No usa SimulationLifecycle
```

**Estado**: Dos archivos con 290 líneas cada uno pero CONTENIDO DIFERENTE.

---

### PhysicsEngine

**Versión usada en labs**:
```
✅ Plano Inclinado → ../../shared/js/physics/PhysicsEngine.js
```

**Versión NO usada**:
```
❌ Cinemática 2D           → No usa PhysicsEngine
❌ Derivadas               → No usa PhysicsEngine
❌ Funciones-Inecuaciones  → No usa PhysicsEngine
```

**Estado**: Dos archivos pero CONTENIDO DIFERENTE.

---

### KinematicsEngine (⚠️ MAS CRÍTICO)

**Versión usada en labs**:
```
✅ Plano Inclinado → ../../shared/js/physics/KinematicsEngine.js (22 líneas)
```

**Versión NO usada**:
```
❌ /shared/components/KinematicsEngine/KinematicsEngine.js (92 líneas) ← MÁS GRANDE
```

**Estado**: ⚠️ VERSIONES MUY DIFERENTES
- `/js/physics/KinematicsEngine.js`: 22 líneas (versión CORTA, probablemente incompleta)
- `/components/KinematicsEngine/KinematicsEngine.js`: 92 líneas (versión COMPLETA)

**PROBLEMA GRAVE**: Plano Inclinado está usando una versión INCOMPLETA de KinematicsEngine.

---

### Graph2DEngine (⚠️ TAMBIÉN CRÍTICO)

**Versión usada en labs**:
```
✅ Funciones-Inecuaciones → ../../shared/components/Graph2DEngine/Graph2DEngine.js
```

**Versión NO usada**:
```
❌ /shared/js/graphics/Graph2DEngine.js (778 líneas, versión más CORTA)
```

**Estado**: ⚠️ VERSIONES DIFERENTES
- `/js/graphics/Graph2DEngine.js`: 778 líneas
- `/components/Graph2DEngine/Graph2DEngine.js`: 851 líneas (versión más COMPLETA)

**Aquí sí se usa la versión más nueva** (/components/), que es lo correcto.

---

### OdeSolverRK4

**Ubicación 1**: `/shared/components/OdeSolverRK4/OdeSolverRK4.js` (53 líneas)  
**Ubicación 2**: `/shared/js/physics/OdeSolverRK4.js` (53 líneas)  
**Usado en labs**: ✅ Plano Inclinado via `/shared/js/physics/OdeSolverRK4.js`

---

## Tabla Resumen: Labs vs Versiones de Componentes

| Componente | Derivadas | Cinemática 2D | Plano Inclinado | Funciones-Inec |
|-----------|---|---|---|---|
| Canvas2DRenderer | ❌ | `/js/` ✅ | `/js/` ✅ | ❌ |
| Vector2D | ❌ | `/js/` ✅ | `/js/` ✅ | ❌ |
| SimulationLifecycle | ❌ | `/js/` ✅ | `/js/` ✅ | ❌ |
| PhysicsEngine | ❌ | ❌ | `/js/` ✅ | ❌ |
| OdeSolverRK4 | ❌ | ❌ | `/js/` ✅ | ❌ |
| KinematicsEngine | ❌ | ❌ | `/js/` ✅ | ❌ |
| SliderControl | ❌ | ❌ | `/js/` ✅ | ❌ |
| VerneMath | ✅ `/components/` | ❌ | ❌ | ✅ `/components/` |
| GraphRenderer | ✅ `/components/` | ✅ `/components/` | ❌ | ✅ `/components/` |
| Graph2DEngine | ❌ | ❌ | ❌ | ✅ `/components/` |
| GraphNavigator | ✅ `/components/` | ❌ | ❌ | ✅ `/components/` |
| VectorRenderer | ❌ | ✅ `/components/` | ❌ | ❌ |
| MathematicalModelPanel | ✅ `/components/` | ✅ `/components/` | ✅ `/components/` | ❌ |

---

## Problemas Detectados

### 🔴 CRÍTICO: Dos autoridades

Los labs están divididos en dos grupos que usan DIFERENTES versiones:

**Grupo 1 (Labs nuevos - LIMPIOS)**:
- Derivadas
- Funciones-Inecuaciones
- Usan: `/shared/components/` únicamente
- Componentes: VerneMath, GraphRenderer, GraphNavigator, MathematicalModelPanel, Graph2DEngine

**Grupo 2 (Labs antiguos - MIXTOS)**:
- Cinemática 2D
- Plano Inclinado
- Usan: `/shared/js/` (versiones viejas)
- Componentes: Canvas2DRenderer, Vector2D, SimulationLifecycle, PhysicsEngine, OdeSolverRK4, KinematicsEngine, SliderControl

### 🟠 MUY GRAVE: KinematicsEngine

Plano Inclinado usa una versión **INCOMPLETA** (22 líneas) en `/js/`, cuando existe una versión **COMPLETA** (92 líneas) en `/components/`.

**¿Está funcionando correctamente?** Probablemente sí, pero usando código incompleto.

### 🟠 MUY GRAVE: Graph2DEngine

Existe una versión antigua (778L) en `/js/` y una versión nueva (851L) en `/components/`.  
Solo Funciones-Inecuaciones la usa, y **SÍ usa la versión nueva** (/components/).

---

## Recomendación de Acción

### OPCIÓN A: Consolidar en `/shared/components/` (RECOMENDADO)

1. Decidir cuál es la "autoridad" de cada componente (/components/ o /js/)
2. Mantener la versión más completa/actualizada
3. Eliminar la versión antigua
4. Actualizar imports en labs antiguos para usar `/components/`
5. Eliminar `/shared/js/` completamente

**Cambios necesarios**:
```javascript
// Cinemática 2D: cambiar
../../shared/js/simulations/SimulationLifecycle.js
../../shared/js/graphics/Canvas2DRenderer.js
../../shared/js/math/Vector2D.js

// A:
../../shared/components/SimulationLifecycle/SimulationLifecycle.js
../../shared/components/Canvas2DRenderer/Canvas2DRenderer.js
../../shared/components/Vector2D/Vector2D.js

// Plano Inclinado: cambiar TODOS los ../../shared/js/ a ../../shared/components/
```

### OPCIÓN B: Usar `/js/` como autoridad (NO RECOMENDADO)

1. Eliminar `/shared/components/` para estos componentes
2. Mantener `/shared/js/` como único origen
3. Hacer que Derivadas y Funciones-Inecuaciones usen `/js/`

**PROBLEMA**: Derivadas y Funciones-Inecuaciones ya están refactorizadas a `/components/`. Ir hacia atrás es retroceso.

---

## Conclusión

**El proyecto está en estado inconsistente**:
- ✅ Labs nuevos (Derivadas, Funciones-Inecuaciones): Bien organizados, usan `/components/`
- ⚠️ Labs antiguos (Cinemática 2D, Plano Inclinado): Desorganizados, usan `/js/` (viejas versiones)
- 🔴 Hay duplicados con contenido DIFERENTE, no son copias simples

**Acción recomendada**: Consolidar TODO en `/shared/components/`, actualizar labs antiguos, eliminar `/shared/js/`.

---

**Archivo generado**: 2026-07-25  
**Estado**: LISTO PARA ACCIÓN
