# Refactorización MVP - Plano Inclinado

## Resumen

Se ha refactorizado completamente la aplicación de simulación de plano inclinado hacia una arquitectura **MVP (Model-View-Presenter)**.

## Cambios Realizados

### 1. index.html
- **Mantiene**: HTML y CSS exactamente igual (sin cambios)
- **Reemplaza**: ~320 líneas de JavaScript monolítico
- **Nuevo contenido**: Solo 85 líneas de inicialización y orquestación MVP
  - Carga módulos externos (PhysicsEngine, Canvas2DRenderer, SliderControl)
  - Carga nuevos módulos: PlanoInclinadoModel.js, PlanoInclinadoPresenter.js
  - Define constantes de la aplicación
  - Crea instancias de componentes
  - Recopila referencias al DOM
  - Instancia Model y Presenter
  - Inicializa UI

### 2. PlanoInclinadoModel.js (NUEVO)
Clase que encapsula toda la lógica de modelo y estado:

**Estado:**
- Parámetros: angleDeg, mu, mass, rampLength
- Simulación: distance, velocity, time, running, finished
- Control: lastTimestamp, animationId

**Métodos principales:**
- `setParameters()`: Actualiza parámetros de control
- `getDynamics()`: Calcula fuerzas y aceleración actuales
- `getTheoretical()`: Calcula valores teóricos al final
- `reset()`: Reinicia simulación
- `start()`: Inicia la simulación
- `pause()`: Pausa la simulación
- `update(deltaTime)`: Actualiza estado (cinemática)
- `canSlide()`: Verifica si el bloque puede deslizar
- `getState()`: Retorna estado actual como objeto

**Características:**
- Independiente de DOM (puro modelo)
- No acoplado a rendering
- Reutilizable en otros contextos

### 3. PlanoInclinadoPresenter.js (NUEVO)
Clase que coordina Model, View y eventos del usuario:

**Responsabilidades:**
- Configura event listeners (sliders y botones)
- Maneja eventos del usuario
- Ejecuta animation loop con requestAnimationFrame
- Actualiza UI basado en estado del Model
- Renderiza la escena

**Métodos principales:**
- `setupEventListeners()`: Configura todos los listeners
- `handleParameterChange()`: Procesa cambios de parámetros
- `handleStart()`: Inicia simulación
- `handlePause()`: Pausa simulación
- `handleReset()`: Reinicia simulación
- `animate(timestamp)`: Loop de animación
- `updateUI()`: Actualiza todos los elementos del DOM
- `render()`: Dibuja la escena en canvas

**Características:**
- Contiene toda la lógica de presentación
- Coordina Model y Renderer
- Gestiona todo el ciclo de vida de la UI
- Encapsula toda la lógica de drawing (~200 líneas)

## Arquitectura MVP

```
┌─────────────────────────────────────────────────────┐
│           index.html (Orquestación)                 │
│  - Carga módulos                                    │
│  - Define constantes                                │
│  - Crea instancias                                  │
│  - Inicializa (85 líneas)                           │
└────────────────────┬────────────────────────────────┘
                     │
        ┌────────────┴────────────┬────────────┐
        │                         │            │
        v                         v            v
   ┌─────────────┐          ┌──────────┐  ┌──────────┐
   │   Model     │          │ Renderer │  │  Sliders │
   │ (Simulación)│          │(Canvas2D)│  │(UI Input)│
   │             │          │          │  │          │
   │ - Estado    │          │ - draw() │  │- getValue│
   │ - Dinámica  │          │- clear() │  │- setValue│
   │ - Física    │          │- arrows()│  │- display │
   └─────────────┘          └──────────┘  └──────────┘
        ^                           ^            ^
        │                           │            │
        └───────────┬───────────────┴────────────┘
                    │
        ┌───────────v──────────────┐
        │     Presenter            │
        │  (Coordinación/Lógica)   │
        │                          │
        │ - Event Listeners        │
        │ - Animation Loop         │
        │ - UI Updates             │
        │ - Rendering              │
        └──────────────────────────┘
                    │
        ┌───────────v──────────────┐
        │      DOM & Canvas        │
        │      (Vista Visual)      │
        └──────────────────────────┘
```

## Ventajas de MVP

### 1. Separación de Responsabilidades
- **Model**: Lógica de negocio (física, simulación)
- **View**: Presentación (Canvas2DRenderer)
- **Presenter**: Coordinación y lógica de UI

### 2. Testabilidad
- Model puede testearse sin DOM
- Presenter puede verificarse sin Browser
- Vista es solo rendering (mínima lógica)

### 3. Mantenibilidad
- Cambios en UI no afectan Model
- Cambios en Model no afectan UI
- Fácil agregar nuevas features

### 4. Reutilización
- Model puede usarse en otros contextos
- Presenter puede adaptarse para otras vistas
- Componentes no acoplados

### 5. Código Limpio
- Responsabilidades únicas y claras
- index.html limpio y legible
- Módulos pequeños y enfocados

## Estructura de Archivos

```
plano-inclinado/
├── index.html                 (HTML + CSS + Orquestación MVP)
├── PlanoInclinadoModel.js     (Model - Lógica de simulación)
├── PlanoInclinadoPresenter.js (Presenter - Coordinación y UI)
└── REFACTORING_SUMMARY.md     (Este archivo)

Archivos compartidos (sin cambios):
├── ../../shared/js/math/PhysicsEngine.js
├── ../../shared/js/graphics/Canvas2DRenderer.js
└── ../../shared/js/ui/SliderControl.js
```

## Flujo de Inicialización

1. **Cargar módulos**: index.html carga todos los scripts necesarios
2. **Crear instancias base**: PhysicsEngine, Canvas2DRenderer
3. **Crear SliderControls**: 4 controles sin callbacks iniciales
4. **Crear referencias DOM**: Agrupar todas las referencias necesarias
5. **Crear Model**: PlanoInclinadoModel con PhysicsEngine
6. **Crear Presenter**: 
   - Recibe Model, Renderer, Sliders, DOM, Constants
   - En constructor llama setupEventListeners()
   - Los callbacks ahora apuntan a métodos del Presenter
7. **Inicializar**: Presenter.updateUI() y Presenter.render()

## Flujo de Ejecución

### Evento: Usuario mueve slider
1. SliderControl dispara onChange callback
2. Presenter.handleParameterChange() es llamado
3. Model.setParameters() actualiza parámetros
4. Model.reset() reinicia simulación
5. Presenter.updateUI() actualiza display
6. Presenter.render() redibuja canvas

### Evento: Usuario hace clic en "Iniciar"
1. Presenter.handleStart() es llamado
2. Model.start() valida y marca como running
3. Presenter.updateUI() actualiza botones
4. Presenter.animate() inicia requestAnimationFrame loop

### En Animation Loop
1. Presenter.animate(timestamp) es llamado
2. Model.update(deltaTime) actualiza simulación
3. Presenter.updateUI() actualiza métricas
4. Presenter.render() redibuja canvas
5. Si aún corre, se programa siguiente frame

## Validación

La refactorización mantiene la funcionalidad 100% idéntica:
- HTML y CSS sin cambios
- Comportamiento visual igual
- Física y cálculos iguales
- Interactividad igual

La única diferencia es la arquitectura interna y la organización del código.
