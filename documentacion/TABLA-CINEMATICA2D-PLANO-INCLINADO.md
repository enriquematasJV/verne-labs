# TABLA DETALLADA: Cinemática 2D vs Plano Inclinado

## 🔄 CINEMÁTICA 2D

### Componentes SHARED Usados

| # | Componente | Ruta en HTML | Ubicación Actual | Versión | Estado |
|---|-----------|---|---|---|---|
| 1 | SimulationLifecycle | `../../shared/js/simulations/SimulationLifecycle.js` | `/shared/js/simulations/` | VIEJA | ⚠️ |
| 2 | Canvas2DRenderer | `../../shared/js/graphics/Canvas2DRenderer.js` | `/shared/js/graphics/` | VIEJA | ⚠️ |
| 3 | VectorRenderer | `../../shared/components/VectorRenderer/VectorRenderer.js` | `/shared/components/` | NUEVA | ✅ |
| 4 | GraphRenderer | `../../shared/components/GraphRenderer/GraphRenderer.js` | `/shared/components/` | NUEVA | ✅ |
| 5 | MathematicalModelPanel | `../../shared/components/MathematicalModelPanel/MathematicalModelPanel.js` | `/shared/components/` | NUEVA | ✅ |
| 6 | Vector2D | `../../shared/js/math/Vector2D.js` | `/shared/js/math/` | VIEJA | ⚠️ |

### Componentes ESPECÍFICOS del Lab

| # | Componente | Ubicación |
|---|-----------|---|
| 1 | CinematicaConstants.js | `./js/CinematicaConstants.js` |
| 2 | CinematicaPhysics.js | `./js/CinematicaPhysics.js` |
| 3 | CinematicaModel.js | `./js/CinematicaModel.js` |
| 4 | SceneRenderer.js | `./js/SceneRenderer.js` |
| 5 | FormulasPanel.js | `./js/FormulasPanel.js` |
| 6 | CinematicaPresenter.js | `./js/CinematicaPresenter.js` |

### Resumen Cinemática 2D
```
Total componentes SHARED: 6
  ✅ Desde /components/: 3 (VectorRenderer, GraphRenderer, MathematicalModelPanel)
  ⚠️  Desde /js/: 3 (SimulationLifecycle, Canvas2DRenderer, Vector2D)

Total componentes ESPECÍFICOS: 6

ESTADO: MIXTO (50% nuevo, 50% viejo)
```

---

## 🏔️ PLANO INCLINADO

### Componentes SHARED Usados

| # | Componente | Ruta en HTML | Ubicación Actual | Versión | Estado | Nota |
|---|-----------|---|---|---|---|---|
| 1 | Canvas2DRenderer | `../../shared/js/graphics/Canvas2DRenderer.js` | `/shared/js/graphics/` | VIEJA | ⚠️ | |
| 2 | SliderControl | `../../shared/js/ui/SliderControl.js` | `/shared/js/ui/` | VIEJA | ⚠️ | |
| 3 | MathematicalModelPanel | `../../shared/components/MathematicalModelPanel/MathematicalModelPanel.js` | `/shared/components/` | NUEVA | ✅ | |
| 4 | Vector2D | `../../shared/js/math/Vector2D.js` | `/shared/js/math/` | VIEJA | ⚠️ | |
| 5 | PhysicsEngine | `../../shared/js/physics/PhysicsEngine.js` | `/shared/js/physics/` | VIEJA | ⚠️ | |
| 6 | OdeSolverRK4 | `../../shared/js/physics/OdeSolverRK4.js` | `/shared/js/physics/` | VIEJA | ⚠️ | |
| 7 | KinematicsEngine | `../../shared/js/physics/KinematicsEngine.js` | `/shared/js/physics/` | VIEJA 🔴 | ⚠️ | INCOMPLETA (22L) |
| 8 | SimulationLifecycle | `../../shared/js/simulations/SimulationLifecycle.js` | `/shared/js/simulations/` | VIEJA | ⚠️ | |

### Componentes ESPECÍFICOS del Lab

| # | Componente | Ubicación |
|---|-----------|---|
| 1 | PlanoInclinadoModel.js | `./js/PlanoInclinadoModel.js` |
| 2 | PlanoInclinadoPresenter.js | `./js/PlanoInclinadoPresenter.js` |

### Resumen Plano Inclinado
```
Total componentes SHARED: 8
  ✅ Desde /components/: 1 (MathematicalModelPanel)
  ⚠️  Desde /js/: 7 (Canvas2DRenderer, SliderControl, Vector2D, PhysicsEngine, OdeSolverRK4, KinematicsEngine, SimulationLifecycle)

Total componentes ESPECÍFICOS: 2

ESTADO: PREDOMINANTEMENTE VIEJO (87.5% viejo, 12.5% nuevo)
🔴 CRÍTICO: KinematicsEngine es INCOMPLETA (22 líneas en /js/ vs 92 líneas en /components/)
```

---

## 📊 COMPARATIVA: Cinemática 2D vs Plano Inclinado

| Aspecto | Cinemática 2D | Plano Inclinado |
|---------|---|---|
| **Total SHARED** | 6 | 8 |
| **De /components/** | 3 (50%) | 1 (12.5%) |
| **De /js/** | 3 (50%) | 7 (87.5%) |
| **Específicos** | 6 | 2 |
| **Estado general** | MIXTO ⚠️ | PRINCIPALMENTE VIEJO 🔴 |
| **Componentes críticos** | Vector2D, Canvas2DRenderer | KinematicsEngine (INCOMPLETA) 🔴 |

---

## 🔴 Problemas Identificados

### Cinemática 2D

| Problema | Severidad | Detalles |
|----------|-----------|----------|
| Usa SimulationLifecycle viejo | 🔴 | Existe versión más nueva en `/components/` |
| Usa Canvas2DRenderer viejo | 🔴 | Existe versión diferente en `/components/` |
| Usa Vector2D viejo | 🔴 | Existe versión diferente en `/components/` |
| Mezcla `/js/` y `/components/` | 🟠 | Sin patrón claro de cuál usar |

### Plano Inclinado

| Problema | Severidad | Detalles |
|----------|-----------|----------|
| Usa KinematicsEngine INCOMPLETA | 🔴🔴 | 22L en `/js/` vs 92L en `/components/` - ¿Funciona correctamente? |
| Mayormente en `/js/` (viejas) | 🔴 | 7/8 componentes SHARED en `/js/` |
| Solo 1 componente en `/components/` | 🔴 | MathematicalModelPanel - resto es viejo |
| OdeSolverRK4 viejo | 🔴 | Existe versión potencialmente más nueva |
| PhysicsEngine viejo | 🔴 | Existe versión potencialmente más nueva |

---

## ✅ Recomendación de Migración

### Plan para Cinemática 2D

**Cambios necesarios**:
```javascript
// Cambiar DE:
../../shared/js/simulations/SimulationLifecycle.js      → ../../shared/components/SimulationLifecycle/SimulationLifecycle.js
../../shared/js/graphics/Canvas2DRenderer.js            → ../../shared/components/Canvas2DRenderer/Canvas2DRenderer.js
../../shared/js/math/Vector2D.js                        → ../../shared/components/Vector2D/Vector2D.js
```

**Resultado después de migración**:
- 6/6 componentes SHARED en `/components/` ✅
- 0/6 en `/js/` ✅

---

### Plan para Plano Inclinado

**Cambios necesarios** (todos):
```javascript
// Cambiar DE /js/ a /components/:
../../shared/js/graphics/Canvas2DRenderer.js            → ../../shared/components/Canvas2DRenderer/Canvas2DRenderer.js
../../shared/js/ui/SliderControl.js                     → ../../shared/components/SliderControl/SliderControl.js
../../shared/js/math/Vector2D.js                        → ../../shared/components/Vector2D/Vector2D.js
../../shared/js/physics/PhysicsEngine.js                → ../../shared/components/PhysicsEngine/PhysicsEngine.js
../../shared/js/physics/OdeSolverRK4.js                 → ../../shared/components/OdeSolverRK4/OdeSolverRK4.js
../../shared/js/physics/KinematicsEngine.js             → ../../shared/components/KinematicsEngine/KinematicsEngine.js (COMPLETO!)
../../shared/js/simulations/SimulationLifecycle.js      → ../../shared/components/SimulationLifecycle/SimulationLifecycle.js
```

**⚠️ ATENCIÓN**: 
- KinematicsEngine cambiaría de 22L (incompleto) a 92L (completo)
- Verificar que Plano Inclinado funciona igual o mejor con la versión completa

**Resultado después de migración**:
- 8/8 componentes SHARED en `/components/` ✅
- 0/8 en `/js/` ✅

---

## 📋 Checklist de Migración

### Cinemática 2D
- [ ] Cambiar 3 imports de `/js/` a `/components/`
- [ ] Verificar que funciona en navegador
- [ ] Commit: "refactor: Migrate Cinemática 2D to use shared/components"

### Plano Inclinado
- [ ] Cambiar 7 imports de `/js/` a `/components/`
- [ ] ⚠️ VERIFICAR ESPECIALMENTE KinematicsEngine (ahora versión completa)
- [ ] Verificar que funciona en navegador
- [ ] Commit: "refactor: Migrate Plano Inclinado to use shared/components"

### Limpieza Final
- [ ] Verificar que `/js/` no se usa en ningún lab
- [ ] Eliminar `/shared/js/` completamente
- [ ] Commit: "refactor: Remove legacy shared/js directory"

---

**Documento generado**: 2026-07-25  
**Estado**: LISTO PARA MIGRACIÓN
