# Checklist de Refactorización — Laboratorio XYZ

**Lab:** [Nombre del lab]  
**Tipo:** [A - Estático | B - Agentes]  
**Responsable:** [Nombre]  
**Fecha inicio:** [Fecha]  
**Fecha fin:** [Fecha]  

---

## Fase 1: Preparación

- [ ] **1.1 — Backup**
  - [ ] Copiar `index.html` a `index.html.backup`
  - [ ] Verificar que los archivos están en git (si aplica)

- [ ] **1.2 — Auditar estructura actual**
  - [ ] Abrir `index.html` en navegador y verificar que funciona
  - [ ] Contar líneas CSS en `<style>` bloque
  - [ ] Identificar lifecycle logic (start, pause, reset, running state)
  - [ ] Identificar callbacks que necesita (onStep, onReset)
  - [ ] Anotar variables CSS específicas del lab

- [ ] **1.3 — Documentar estado actual**
  - [ ] Listar variables CSS personalizadas: `--` ...
  - [ ] Listar métodos del modelo: `model.step()`, `model.reset()`, etc.
  - [ ] Listar listeners de UI necesarios (qué debe ocurrir en onStart, onPause, etc.)

---

## Fase 2: CSS Centralización

- [ ] **2.1 — Agregar referencia a tema centralizado**
  ```html
  <!-- En <head>, antes de <style> -->
  <link rel="stylesheet" href="../../shared/assets/css/verne-theme.css">
  ```

- [ ] **2.2 — Extraer variables CSS específicas del lab**
  - [ ] Copiar bloque `<style>` completo a archivo temporal
  - [ ] Identificar variables que NO están en verne-theme.css
  - [ ] Crear lista:
    ```css
    :root {
      --color1: #...;  /* Específico: [descripción] */
      --color2: #...;
    }
    ```

- [ ] **2.3 — Eliminar CSS duplicado**
  - [ ] Borrar todo el `<style>` actual
  - [ ] Mantener SOLO el bloque `:root` con variables específicas
  - [ ] Testear en navegador: ¿Cómo se ve? ¿Elementos están donde deben?

- [ ] **2.4 — Verificar estilos específicos**
  - [ ] Algunos labs tienen estilos únicos (ej: `.custom-element { ... }`)
  - [ ] Si existen, mantenerlos en `<style>` junto a variables
  - [ ] Si no existen, `<style>` puede estar vacío o solo tener `:root`

**Checklist de CSS:**
- [ ] `page-header` se ve correcto
- [ ] Botones (primario, secundario, luz) tienen estilos correctos
- [ ] `panel` tiene sombra y border-radius
- [ ] `controls` tienen espaciado correcto
- [ ] `canvas` tiene border y fondo
- [ ] `metrics` (si existen) muestran en grid 4 columnas
- [ ] Responsive funciona en móvil (F12 → device toggle)

---

## Fase 3: Integración SimulationLifecycle.js

- [ ] **3.1 — Agregar script**
  ```html
  <!-- En <body>, antes de scripts del lab -->
  <script src="../../shared/js/simulations/SimulationLifecycle.js"></script>
  ```

- [ ] **3.2 — Identificar lifecycle logic actual**
  Buscar en `model.js` o `simulation.js`:
  - [ ] Variable `running` (o similar) → documentar nombre
  - [ ] Variable `finished` (o similar) → documentar nombre
  - [ ] Método que actualiza simulación → documentar nombre (ej: `step()`)
  - [ ] Método que reinicia → documentar nombre (ej: `reset()`)
  - [ ] Condición para poder iniciar → documentar (ej: `!finished`)

- [ ] **3.3 — Crear instancia de SimulationLifecycle**
  En `simulation.js` o donde sea apropiado:
  ```javascript
  const lifecycle = new SimulationLifecycle(
    (dt) => model.step(dt),           // onStep: actualizar modelo
    () => model.reset(),              // onReset: reiniciar modelo
    () => !model.finished              // canStartFn: validación
  );
  ```

- [ ] **3.4 — Reemplazar lógica de botones**
  Buscar `startBtn`, `pauseBtn`, `resetBtn`:
  
  **ANTES:**
  ```javascript
  startBtn.onclick = () => {
    running = true;
    // ... más código ...
  };
  ```

  **DESPUÉS:**
  ```javascript
  startBtn.onclick = () => {
    lifecycle.start();
    updateUI();
  };
  ```

- [ ] **3.5 — Implementar listeners de UI**
  ```javascript
  lifecycle.on('onStart', () => {
    startBtn.disabled = true;
    pauseBtn.disabled = false;
  });

  lifecycle.on('onPause', () => {
    startBtn.disabled = false;
    pauseBtn.disabled = true;
  });

  lifecycle.on('onReset', () => {
    startBtn.disabled = false;
    pauseBtn.disabled = true;
  });

  lifecycle.on('onFinish', () => {
    startBtn.disabled = true;
    pauseBtn.disabled = true;
    // mostrar mensaje de término
  });
  ```

- [ ] **3.6 — Reemplazar animation loop**
  **ANTES:**
  ```javascript
  function animate() {
    if (running) {
      model.step(16.67);
    }
    requestAnimationFrame(animate);
  }
  animate();
  ```

  **DESPUÉS:**
  ```javascript
  let lastTime = Date.now();
  function animate() {
    const now = Date.now();
    const dt = now - lastTime;
    lastTime = now;
    
    lifecycle.step(dt);
    render();
    
    requestAnimationFrame(animate);
  }
  animate();
  ```

- [ ] **3.7 — Testear en navegador**
  - [ ] Iniciar → ¿Se activa?
  - [ ] Pausar → ¿Se pausa?
  - [ ] Reanudar → ¿Continúa?
  - [ ] Reiniciar → ¿Vuelve a estado inicial?
  - [ ] Console → ¿Sin errores?

**Checklist SimulationLifecycle:**
- [ ] Botones funcionan correctamente
- [ ] Estado visual de botones actualiza (enabled/disabled)
- [ ] Simulación se pausa y reanuda sin saltos
- [ ] Reset limpia todo correctamente
- [ ] No hay código duplicado de lifecycle

---

## Fase 4: Validación Graph2DEngine (si aplica)

*Solo si el lab usa gráficas (Tipo A, series temporales, trayectorias)*

- [ ] **4.1 — Verificar si ya usa gráficas**
  - [ ] ¿Hay canvas para gráficas?
  - [ ] ¿Se dibuja manualmente o usa librería?

- [ ] **4.2 — Si usa Graph2DEngine**
  - [ ] ¿Ya está integrado?
  - [ ] ¿Funciona correctamente?
  - [ ] Si no, ver guía: VERNET_LABS_BASE.md → Módulos → Graph2DEngine

---

## Fase 5: Tests y Verificación

- [ ] **5.1 — Desktop (Chrome, Firefox)**
  - [ ] Página carga sin errores (F12 → Console)
  - [ ] Todos los controles visibles
  - [ ] Simulación funciona
  - [ ] Responsive layout 1280px

- [ ] **5.2 — Tablet (F12 → Device toggle)**
  - [ ] Diseño se adapta a 768px
  - [ ] Controles accesibles
  - [ ] Canvas legible

- [ ] **5.3 — Móvil (F12 → Device toggle)**
  - [ ] Diseño se adapta a 375px
  - [ ] Toque funciona (si hay input touch)
  - [ ] Buttons grandes y fáciles de tocar
  - [ ] Scroll no se rompe

- [ ] **5.4 — Console**
  - [ ] Sin errores JavaScript (F12 → Console tab)
  - [ ] Sin advertencias de CORS
  - [ ] Sin undefined variables

- [ ] **5.5 — Performance**
  - [ ] F12 → Performance → grabar 5 segundos
  - [ ] FPS consistente (60 fps ideal, mínimo 30)
  - [ ] Sin memory leaks

---

## Fase 6: Documentación

- [ ] **6.1 — Actualizar comentarios**
  ```javascript
  // ANTES:
  const running = false;  // Estado de ejecución
  
  // DESPUÉS:
  // SimulationLifecycle maneja estado de ejecución (ver shared/js/simulations/)
  ```

- [ ] **6.2 — Documentar callbacks**
  ```javascript
  // onStep: Se llama cada frame (16.67 ms)
  // Actualiza modelo físico y dibuja
  const lifecycle = new SimulationLifecycle(
    (dt) => {
      model.step(dt);
      render();
    },
    ...
  );
  ```

- [ ] **6.3 — Listar cambios en README o comentario superior**

---

## Fase 7: Comparación Antes/Después

- [ ] **7.1 — Medir impacto**
  - [ ] Líneas CSS antes: ___ → después: ___
  - [ ] Líneas de lifecycle antes: ___ → después: ___
  - [ ] Líneas JavaScript eliminadas: ___
  - [ ] Archivos nuevos: SimulationLifecycle.js, verne-theme.css
  - [ ] Archivos eliminados: ___ (si aplica)

- [ ] **7.2 — Verificar que funciona igual**
  - [ ] Comparar visual: antes vs después en navegador
  - [ ] Comportamiento simulación: idéntico
  - [ ] Responsivo: igual o mejor

---

## Fase 8: Commit y Finalización

- [ ] **8.1 — Git commit**
  ```
  git add simulaciones/[lab-name]/
  git commit -m "refactor: centralizar CSS y SimulationLifecycle en [lab-name]
  
  - Importar verne-theme.css
  - Usar SimulationLifecycle.js genérico
  - Eliminar ~XX líneas de CSS duplicado
  - Eliminar ~XX líneas de lifecycle inline
  
  Funcionalidad idéntica, código más limpio y reutilizable."
  ```

- [ ] **8.2 — Verificar en GitHub Pages**
  - [ ] `git push`
  - [ ] Lab sigue funcionando en GitHub Pages
  - [ ] Responsive funciona en móvil real (si posible)

- [ ] **8.3 — Documentar completado**
  - [ ] Actualizar: VERNET_LABS_JOURNAL.md
  - [ ] Actualizar: VERNET_LABS_DASHBOARD.html
  - [ ] Marcar como completado: ✅ en checklist

---

## Notas y Observaciones

*Usar este espacio para anotar cualquier cosa que haya salido diferente, bugs encontrados, o mejoras identificadas:*

```
- Encontrado bug en [...]
- Mejora posible: [...]
- Nota para próxima sesión: [...]
```

---

## Firma de Completado

**Lab:** ________________  
**Fecha completado:** ________  
**Responsable:** ________________  
**Verificador:** ________________  
**Estado:** ✅ Completado | ⏳ En progreso | ❌ Bloqueado

