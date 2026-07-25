# Análisis: Herramientas Existentes vs. Ideas Futuras

**Fecha:** 2026-07-25  
**Objetivo:** Mapear qué existe y qué se puede desarrollar para 3 ideas principales

---

## 🎯 LAS TRES IDEAS

### 1️⃣ Mantenimiento de Labs (BETA ↔ Simulaciones)
### 2️⃣ Validación y Refactorización MVP de Labs
### 3️⃣ Asistente Creador de Labs (Fuera de Claude Code)

---

## 📊 ESTADO ACTUAL: ¿QUÉ EXISTE?

### ✅ YA EXISTE: Lab Manager (Idea #1)

**Ubicación:** `documentacion/doc-verne-labs/herramientas/`

**Archivos:**
- `lab-manager.html` — Dashboard visual interactivo
- `lab-manager.ps1` — Script PowerShell automático (395+ líneas)
- `README-LAB-MANAGER.md` — Documentación completa

**Capacidades Implementadas:**
- ✅ Sincronizar con GitHub (push normal o force)
- ✅ Remover lab (delete o move-to-beta)
- ✅ Agregar lab desde BETA a simulaciones
- ✅ Mover lab entre carpetas
- ✅ Modificar lab (registra cambios)
- ✅ Registro automático en diario de sesiones
- ✅ Detección automática de labs (tanto en simulaciones como en BETA)

**Arquitectura:**
```
lab-manager.html (GUI)
    ↓
lab-manager.ps1 (CLI automatizado)
    ↓
Operaciones filesystem: move, delete, git push
    ↓
Diario automático (SESION_X_YYYY-MM-DD.md)
```

**Estado de madurez:** 🟡 Beta 1.0 (funcional pero con TODOs)

**TODOs listados en README:**
- [ ] Crear lab desde plantilla
- [ ] Validar HTML/JavaScript
- [ ] Ejecutar tests automáticos
- [ ] Generar reportes de cambios
- [ ] Backup automático

---

### ✅ PARCIALMENTE EXISTE: Validación/Refactorización (Idea #2)

**Ubicación:** `documentacion/doc-verne-labs/planificacion/` + `tecnica/`

**Documentación Existente:**
1. **PLAN-REFACTORIZACION-MVP.md**
   - Visión completa de transformar a MVP
   - Fases claramente definidas (Análisis β Refactorización Incremental)
   - Priorización por impacto

2. **ARQUITECTURA_SIMULATIONS.md**
   - Clarifica qué es "componente reutilizable vs específico"
   - Ejemplo: EcologySimulationEngine (❌ específico) vs SimulationLifecycle (✅ genérico)
   - Reglas de decisión

3. **CLASIFICACION_LAB_ABC.md**
   - ABC: A (refactorizar primero), B (después), C (último)
   - Análisis de dependencias

4. **DOCUMENTO_ARQUITECTURA_FINAL.md**
   - Especificación de MVP Pattern
   - Diagrama de capas

**Lo que FALTA:**
- ❌ Herramienta automatizada que VERIFIQUE el patrón MVP
- ❌ Linter/checker que identifique violations
- ❌ Dashboard para visualizar estado de refactorización de cada lab
- ❌ Script automático que cree estructura MVP base
- ❌ Pruebas de integración MVP

---

### ✅ PARCIALMENTE EXISTE: Asistente Creador (Idea #3)

**Ubicación:** `documentacion/doc-verne-labs/herramientas/`

**Herramientas Existentes:**
1. **lab-generator-v3.html** (Dashboard moderno)
   - Selector de modo: Modular vs Monolítico
   - Formulario: nombre, asignatura, descripción, tipo de escenario
   - Selector de componentes SHARED (checkboxes)
   - Generador de prompt automático
   - Referencia a labs ejemplo por tipo
   - Variables entrada/salida

2. **lab-generator-v2.html** (Versión anterior, más simple)

3. **components.json** (Recién actualizado)
   - 16 componentes SHARED
   - Organizados en 7 categorías
   - Cargado dinámicamente en el dashboard

4. **BLUEPRINT-VERNE-LABS-COMPLETO.md**
   - Especificación completa para crear labs
   - Estructura MVP
   - Ejemplos

5. **prompt-plantilla.md**
   - Template base para generar prompts
   - Instrucciones para la IA

**Lo que FALTA:**
- ❌ Versión standalone (no necesita Python/servidor)
- ❌ Generador de estructura de carpetas automático
- ❌ Validador de componentes seleccionados (¿tiene dependencias correctas?)
- ❌ Descargador de estructura ZIP
- ❌ Integración con Git (crear rama, commits iniciales)
- ❌ Preview en tiempo real del laboratorio generado

---

## 📈 MATRIZ: Ideas vs Existencia

| Idea | Existe | %Completado | Madurez | TODOs Pendientes |
|------|--------|-------------|---------|-----------------|
| 1️⃣ Mantenimiento BETA↔Sim | ✅ Sí | 90% | Beta 1.0 | Tests, templates, reportes |
| 2️⃣ Validación MVP | 📚 Docs | 30% | Especificación | Herramienta de verificación automatizada |
| 3️⃣ Asistente Creador | ✅ Dashboard | 70% | MVP | Standalone, ZIP download, integración Git |

---

## 🔧 DETALLES POR IDEA

### IDEA #1: Mantenimiento BETA ↔ Simulaciones

**✅ QUÉ EXISTE:**
```
Operación          Dashboard   Script   Registro   Automatización
─────────────────────────────────────────────────────────────────
Sync GitHub        ✅          ✅       ✅         Automática
Remove Lab         ✅          ✅       ✅         Automática
Add from BETA      ✅          ✅       ✅         Automática
Move Between       ✅          ✅       ✅         Automática
Modify Lab         ✅          ✅       ✅         Git + Registry
```

**❌ QUÉ FALTA:**

1. **Template Creation**
   - No hay opción "crear lab desde plantilla"
   - Podría usar `BLUEPRINT-VERNE-LABS-COMPLETO.md` como base

2. **Validation Step**
   - Antes de mover a simulaciones, validar:
     - ✅ index.html existe y es válido
     - ✅ Sintaxis JavaScript correcta
     - ✅ Estructura MVP presente (Model, View, Presenter)
     - ✅ Componentes SHARED importados correctamente

3. **Test Execution**
   - Opción para ejecutar tests antes de publicar

4. **Backup & Rollback**
   - Backup automático antes de cambios
   - Opción de rollback si algo falla

**Impacto si se completa:** 🟢 ALTO
- Reduce riesgo de publicar labs rotos
- Automatiza QA antes de merge a main
- Historial completo de cambios

---

### IDEA #2: Validación y Refactorización MVP

**✅ QUÉ EXISTE:**

1. **Plan conceptual completo**
   ```
   Antes (Estado actual):
   - Código duplicado
   - HTML monolítico
   - Difícil de testear
   
   Después (Objetivo):
   - MVP pattern
   - Componentes SHARED
   - Fácil de testear
   ```

2. **Matriz de decisión**
   - CLASIFICACION_LAB_ABC.md: Prioridad de refactorización
   - ARQUITECTURA_SIMULATIONS.md: Qué es reutilizable vs específico

3. **Especificación**
   - DOCUMENTO_ARQUITECTURA_FINAL.md: Patrón MVP detallado

**❌ QUÉ FALTA:**

1. **Herramienta de verificación MVP**
   ```
   Debería verificar automáticamente:
   
   [Model]
   - ✅ Existe archivo *Model.js
   - ✅ Contiene getters/setters (datos)
   - ✅ NO contiene DOM operations
   - ✅ NO contiene canvas rendering
   
   [View]
   - ✅ Existe archivo *View.js
   - ✅ Contiene referencias DOM
   - ✅ NO contiene lógica de negocio
   - ✅ Emite eventos (onChanged, etc)
   
   [Presenter]
   - ✅ Existe archivo *Presenter.js
   - ✅ Orquesta Model + View
   - ✅ Usa componentes SHARED
   - ✅ Rendering logic centralizado
   ```

2. **Dashboard de refactorización**
   ```
   Estado por lab:
   - Lab A: ██████████ 100% MVP (refactorizado)
   - Lab B: ██████░░░░  60% MVP (en progreso)
   - Lab C: ███░░░░░░░  30% MVP (pendiente)
   ```

3. **Script de refactorización semi-automática**
   - Crear estructura MVP base
   - Mover código a archivos correctos
   - Generar imports automáticos

4. **Linter MVP**
   ```
   npm run validate:mvc
   
   Errores detectados:
   ❌ simulaciones/derivadas/js/DerivadaModel.js
      - Línea 45: this.dom.update() encontrado (DOM en Model)
   
   ❌ simulaciones/plano-inclinado/js/PlanoInclinadoView.js
      - Línea 120: Lógica de física detectada (debe estar en Model)
   ```

**Impacto si se completa:** 🟢 ALTO
- Labs más mantenibles
- Código predecible
- Fácil onboarding para nuevos developers
- Reutilización de código

---

### IDEA #3: Asistente Creador de Labs (Fuera de Claude Code)

**✅ QUÉ EXISTE:**

1. **Dashboard lab-generator-v3.html**
   - Modo selección: Modular vs Monolítico
   - Información básica: nombre, asignatura, descripción
   - Tipo de escenario: static, dynamic-det, dynamic-sto
   - Selector de componentes: checkboxes por categoría
   - Variables entrada/salida
   - Prompt automático generado
   - Copia al portapapeles

2. **components.json actualizado**
   - 16 componentes con descripciones
   - 7 categorías
   - Cargado dinámicamente

3. **Lab examples de referencia**
   - Derivadas (static)
   - Cinemática 2D (dynamic-det)
   - Ecología (dynamic-sto)

4. **BLUEPRINT completo**
   - Especificación de estructura
   - Ejemplos de Model/View/Presenter
   - Instrucciones

**❌ QUÉ FALTA:**

1. **Versión Standalone (sin servidor)**
   - Actualmente requiere HTTP server
   - Podría ser un Electron app
   - O HTML5 App con localStorage

2. **Validación de dependencias**
   ```
   Si selecciono:
   - VectorRenderer ✅
   - Pero no selecciono Canvas2DRenderer ❌
   
   Advertencia: "VectorRenderer necesita Canvas2DRenderer"
   ```

3. **Generador de estructura de carpetas**
   - Click → descarga ZIP con estructura:
     ```
     mi-lab/
     ├── index.html
     ├── css/
     │   └── mi-lab.css
     ├── js/
     │   ├── MiLabModel.js
     │   ├── MiLabView.js
     │   └── MiLabPresenter.js
     └── README.md
     ```

4. **Integración con Git**
   - Crear rama automáticamente
   - Commits iniciales
   - Push a GitHub

5. **Preview dinámico**
   - Mientras rellena el formulario
   - Muestra cómo se vería el lab generado

6. **Validación de sintaxis**
   - Verificar que nombre es válido (sin espacios, caracteres especiales)
   - Proporcionar nombre de carpeta automático

**Impacto si se completa:** 🟢 ALTO
- Crear lab nuevo trivial (5 min)
- Menos errores iniciales
- Patrón consistente en todos los labs
- Onboarding más rápido

---

## 🚀 RECOMENDACIONES DE PRIORIZACIÓN

### CORTO PLAZO (Next 2 weeks)

**PRIORIDAD ALTA:**
1. **Completar Lab Manager (#1)**
   - Agregar validación HTML/JS antes de publicar
   - Implementar backup automático
   - Esfuerzo: 3-4 horas

2. **Completar Generador de Labs (#3)**
   - Agregar validación de dependencias
   - Generador de estructura ZIP
   - Esfuerzo: 4-5 horas

### MEDIANO PLAZO (Next month)

**PRIORIDAD MEDIA:**
3. **Crear Validator MVP (#2)**
   - Script que verifique patrón MVP
   - Esfuerzo: 5-6 horas

4. **Dashboard de refactorización (#2)**
   - Visualizar estado MVP de cada lab
   - Esfuerzo: 3-4 horas

### LARGO PLAZO (Next quarter)

5. **Linter MVP**
   - Herramienta que detecte violations
   - Esfuerzo: 8-10 horas

6. **Integración Git automática (#3)**
   - Crear ramas, commits, pushes
   - Esfuerzo: 4-5 horas

---

## 📋 CHECKLIST: QUÉS COMPLETAR CADA IDEA

### Idea #1: Mantenimiento BETA ↔ Simulaciones
- [x] Dashboard interactivo
- [x] Script automático
- [x] Registro en diario
- [ ] Validación pre-publish
- [ ] Template creation
- [ ] Backup & Rollback
- [ ] Test execution

### Idea #2: Validación MVP
- [x] Plan conceptual
- [x] Reglas de decisión
- [ ] Herramienta de verificación
- [ ] Dashboard estado
- [ ] Script semi-automático
- [ ] Linter MVP

### Idea #3: Asistente Creador
- [x] Dashboard básico
- [x] Components.json
- [x] Generador prompt
- [ ] Versión standalone
- [ ] Validación dependencias
- [ ] Generador ZIP
- [ ] Integración Git
- [ ] Preview dinámico

---

## 🔗 CONEXIONES ENTRE IDEAS

```
Lab Generator (#3)
    ↓ (crea estructura)
Nuevo Lab
    ↓ (entra a BETA)
Lab Manager (#1)
    ↓ (valida antes de publicar)
MVP Validator (#2)
    ↓ (verifica patrón)
Publica a simulaciones/
```

---

## 💡 INSIGHTS

1. **Las herramientas existen pero incompletas**
   - 70% de la funcionalidad está hecha
   - El 30% final agrega robustez y automatización

2. **Lab Manager ya funciona en producción**
   - Se puede usar YA para mover labs
   - Solo le faltan "nice-to-have" features

3. **MVP Validator es conceptual, no implementado**
   - Documentación excelente
   - Necesita herramienta que la ejecute

4. **Generador de Labs es funcional pero sin salida**
   - Genera el prompt perfecto
   - Pero el usuario aún debe crear estructura manualmente

5. **Oportunidad: Unificar las tres ideas**
   - Generador → crea estructura en BETA
   - Manager → mueve a simulaciones con validación
   - Validator → verifica MVP antes de publicar

---

## 📁 RESUMEN: ARCHIVOS CLAVE POR IDEA

### Idea #1: Mantenimiento
- ✅ `lab-manager.html` (funcional)
- ✅ `lab-manager.ps1` (funcional)
- ✅ `README-LAB-MANAGER.md` (excelente docs)

### Idea #2: Validación MVP
- ✅ `PLAN-REFACTORIZACION-MVP.md` (plan)
- ✅ `ARQUITECTURA_SIMULATIONS.md` (reglas)
- ✅ `CLASIFICACION_LAB_ABC.md` (priorización)
- ❌ `MVP-Validator.js` (NO EXISTE)

### Idea #3: Creador
- ✅ `lab-generator-v3.html` (funcional)
- ✅ `components.json` (datos)
- ✅ `BLUEPRINT-VERNE-LABS-COMPLETO.md` (especificación)
- ❌ `lab-generator-standalone.exe` (NO EXISTE)

---

**Próximo paso:** Priorizar cuál completar primero según impacto y esfuerzo.
