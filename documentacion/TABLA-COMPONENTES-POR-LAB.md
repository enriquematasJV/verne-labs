# Tabla: Componentes usados por Labs Refactorizados

## Resumen Ejecutivo

| Lab | SHARED/JS | SHARED/Components | Total |
|-----|-----------|------------------|-------|
| **Derivadas** | 0 | 4 | 4 |
| **Cinemática 2D** | 3 | 4 | 7 |
| **Plano Inclinado** | 7 | 1 | 8 |
| **Funciones-Inecuaciones** | 0 | 4 | 4 |

---

## Tabla Detallada por Laboratorio

### 1️⃣ DERIVADAS

| Componente | Ruta Actual | ✓ Estado |
|-----------|-----------|---------|
| VerneMath | `../../shared/components/VerneMath/VerneMath.js` | ✅ /components |
| GraphRenderer | `../../shared/components/GraphRenderer/GraphRenderer.js` | ✅ /components |
| GraphNavigator | `../../shared/components/GraphNavigator/GraphNavigator.js` | ✅ /components |
| MathematicalModelPanel | `../../shared/components/MathematicalModelPanel/MathematicalModelPanel.js` | ✅ /components |

**Resumen**: 4 componentes, todos en `/shared/components/` ✅ LIMPIO

---

### 2️⃣ CINEMÁTICA 2D

| Componente | Ruta Actual | ✓ Estado |
|-----------|-----------|---------|
| SimulationLifecycle | `../../shared/js/simulations/SimulationLifecycle.js` | ⚠️ /js |
| Canvas2DRenderer | `../../shared/js/graphics/Canvas2DRenderer.js` | ⚠️ /js |
| VectorRenderer | `../../shared/components/VectorRenderer/VectorRenderer.js` | ✅ /components |
| GraphRenderer | `../../shared/components/GraphRenderer/GraphRenderer.js` | ✅ /components |
| MathematicalModelPanel | `../../shared/components/MathematicalModelPanel/MathematicalModelPanel.js` | ✅ /components |
| Vector2D | `../../shared/js/math/Vector2D.js` | ⚠️ /js |

**Resumen**: 7 componentes → 3 en `/shared/js/` ⚠️ MIXTO

---

### 3️⃣ PLANO INCLINADO

| Componente | Ruta Actual | ✓ Estado |
|-----------|-----------|---------|
| Canvas2DRenderer | `../../shared/js/graphics/Canvas2DRenderer.js` | ⚠️ /js |
| SliderControl | `../../shared/js/ui/SliderControl.js` | ⚠️ /js |
| MathematicalModelPanel | `../../shared/components/MathematicalModelPanel/MathematicalModelPanel.js` | ✅ /components |
| Vector2D | `../../shared/js/math/Vector2D.js` | ⚠️ /js |
| PhysicsEngine | `../../shared/js/physics/PhysicsEngine.js` | ⚠️ /js |
| OdeSolverRK4 | `../../shared/js/physics/OdeSolverRK4.js` | ⚠️ /js |
| KinematicsEngine | `../../shared/js/physics/KinematicsEngine.js` | ⚠️ /js |
| SimulationLifecycle | `../../shared/js/simulations/SimulationLifecycle.js` | ⚠️ /js |

**Resumen**: 8 componentes → 7 en `/shared/js/` ⚠️ PRINCIPALMENTE /js

---

### 4️⃣ FUNCIONES-INECUACIONES

| Componente | Ruta Actual | ✓ Estado |
|-----------|-----------|---------|
| VerneMath | `../../shared/components/VerneMath/VerneMath.js` | ✅ /components |
| GraphRenderer | `../../shared/components/GraphRenderer/GraphRenderer.js` | ✅ /components |
| Graph2DEngine | `../../shared/components/Graph2DEngine/Graph2DEngine.js` | ✅ /components |
| GraphNavigator | `../../shared/components/GraphNavigator/GraphNavigator.js` | ✅ /components |

**Resumen**: 4 componentes, todos en `/shared/components/` ✅ LIMPIO

---

## Análisis Crítico

### 🔴 Problema Identificado

**Inconsistencia severa en ubicación de componentes**:

```
Derivadas:              ✅ 100% en /components/
Cinemática 2D:          ⚠️  57% en /js/, 43% en /components/
Plano Inclinado:        ⚠️  87% en /js/, 13% en /components/
Funciones-Inecuaciones: ✅ 100% en /components/
```

### 📊 Distribución Global

```
SHARED/components/:  13 imports (44%)
SHARED/js/:          17 imports (56%)
```

**Conclusión**: El proyecto está DIVIDIDO. No hay una estructura única.

---

## Componentes Duplicados Detectados

| Componente | En /components/ | En /js/ | ¿Cuál usar? |
|-----------|---|---|---|
| VerneMath | ✅ | ❌ | /components |
| GraphRenderer | ✅ | ❌ | /components |
| Graph2DEngine | ✅ | ✅ `/js/graphics/` | /components (más nuevo) |
| Canvas2DRenderer | ✅ | ✅ `/js/graphics/` | VERIFICAR cuál es actual |
| Vector2D | ✅ | ✅ `/js/math/` | VERIFICAR cuál es actual |
| VectorRenderer | ✅ | ❌ | /components |
| MathematicalModelPanel | ✅ | ❌ | /components |
| SimulationLifecycle | ✅ | ✅ `/js/simulations/` | VERIFICAR cuál es actual |
| PhysicsEngine | ✅ | ✅ `/js/physics/` | VERIFICAR cuál es actual |
| OdeSolverRK4 | ✅ | ✅ `/js/physics/` | VERIFICAR cuál es actual |
| KinematicsEngine | ✅ | ✅ `/js/physics/` | VERIFICAR cuál es actual |
| SliderControl | ✅ | ✅ `/js/ui/` | VERIFICAR cuál es actual |
| ChartRenderer | ✅ | ✅ `/js/graphics/` | VERIFICAR cuál es actual |

---

## Patrón Observado

**Labs "nuevos" (Derivadas, Funciones-Inecuaciones)**:
- ✅ Usan solo `/shared/components/`
- Código más limpio y moderno
- Menos dependencias

**Labs "antiguos" (Cinemática 2D, Plano Inclinado)**:
- ⚠️ Usan `/shared/js/`
- Más acoplamiento
- Posiblemente refactorizados parcialmente

---

## Recomendación de Acción

### Paso 1: Verificar si son realmente duplicados
```bash
diff /shared/components/Canvas2DRenderer/Canvas2DRenderer.js \
     /shared/js/graphics/Canvas2DRenderer.js
```

Si son IGUALES → ELIMINAR `/shared/js/`  
Si son DIFERENTES → Documentar por qué existen

### Paso 2: Actualizar imports en labs antiguos

**Cinemática 2D actual** (7 componentes):
```javascript
// Cambiar de:
../../shared/js/simulations/SimulationLifecycle.js
../../shared/js/graphics/Canvas2DRenderer.js
../../shared/js/math/Vector2D.js

// A:
../../shared/components/SimulationLifecycle/SimulationLifecycle.js
../../shared/components/Canvas2DRenderer/Canvas2DRenderer.js
../../shared/components/Vector2D/Vector2D.js
```

**Plano Inclinado actual** (8 componentes, 7 en `/js/`):
```javascript
// Cambiar todos los ../../shared/js/ a ../../shared/components/
```

### Paso 3: Eliminar `/shared/js/` (después de verificar)

Una vez actualizado todo a `/shared/components/`, eliminar carpeta `/shared/js/` completamente.

---

## Tabla de Migración Necesaria

| Archivo | Origen | Destino | Labs afectados |
|---------|--------|---------|---|
| Canvas2DRenderer.js | `/js/graphics/` | `/components/` | Cinemática 2D, Plano Inclinado |
| Vector2D.js | `/js/math/` | `/components/` | Cinemática 2D, Plano Inclinado |
| PhysicsEngine.js | `/js/physics/` | `/components/` | Plano Inclinado |
| OdeSolverRK4.js | `/js/physics/` | `/components/` | Plano Inclinado |
| KinematicsEngine.js | `/js/physics/` | `/components/` | Plano Inclinado |
| SimulationLifecycle.js | `/js/simulations/` | `/components/` | Cinemática 2D, Plano Inclinado |
| SliderControl.js | `/js/ui/` | `/components/` | Plano Inclinado |

---

## Estado Esperado Después de Migración

```
✅ DERIVADAS: 
   4/4 componentes en /shared/components/

✅ CINEMÁTICA 2D (después de migración):
   7/7 componentes en /shared/components/

✅ PLANO INCLINADO (después de migración):
   8/8 componentes en /shared/components/

✅ FUNCIONES-INECUACIONES:
   4/4 componentes en /shared/components/

✅ TOTAL:
   23/23 componentes en /shared/components/
   0/0 componentes en /shared/js/
```

---

**Conclusión**: La estructura está lista para migración. Los labs nuevos ya están limpios. Los antiguos necesitan actualización de rutas.
