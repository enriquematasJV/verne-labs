# SimulationLifecycle — Gestor del ciclo de vida

Componente que gestiona el ciclo de vida de simulaciones: inicialización, pausa, reanudación, reinicio y limpieza.

## Uso

```javascript
<script src="../../shared/components/SimulationLifecycle/SimulationLifecycle.js"></script>

const lifecycle = new SimulationLifecycle(
  (dt) => model.step(dt / 1000),  // onStep: avanza modelo
  () => model.reset(),             // onReset: reinicia modelo
  () => !model.isFinished()        // canStart: puede iniciar?
);

// Control desde UI
document.getElementById('startBtn').onclick = () => lifecycle.start();
document.getElementById('pauseBtn').onclick = () => lifecycle.pause();
document.getElementById('resetBtn').onclick = () => lifecycle.reset();

// Loop de animación
function animate() {
  if (lifecycle.isRunning()) {
    lifecycle.step(16.67);  // ~60 FPS
  }
  requestAnimationFrame(animate);
}
animate();

// Listeners para UI
lifecycle.on('onStart', () => console.log('Inició'));
lifecycle.on('onPause', () => console.log('Pausó'));
lifecycle.on('onFinish', () => console.log('Terminó'));
```

## Métodos principales

**Control:**
- `start()` — Iniciar simulación
- `pause()` — Pausar simulación
- `resume()` — Reanudar desde pausa
- `reset()` — Reiniciar a estado inicial
- `step(deltaTime)` — Avanzar un paso (en ms)
- `markFinished()` — Marcar como terminada

**Consultas:**
- `isRunning()` — ¿Está ejecutándose?
- `isPaused()` — ¿Está pausada?
- `isFinished()` — ¿Terminó?
- `canStart()` — ¿Puede iniciar?
- `getElapsedTime()` — Tiempo total transcurrido (ms)

**Listeners:**
- `on(event, callback)` — Registrar listener
- `off(event)` — Remover listener

**Eventos:**
- `onStart`, `onPause`, `onResume`, `onReset`, `onFinish`, `onStep`
