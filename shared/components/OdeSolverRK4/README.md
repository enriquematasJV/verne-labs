# OdeSolverRK4 — Solucionador de EDOs por Runge-Kutta 4

Solucionador numérico para ecuaciones diferenciales ordinarias (EDOs) usando el método Runge-Kutta de orden 4.

## Uso

```javascript
<script src="../../shared/components/OdeSolverRK4/OdeSolverRK4.js"></script>

// dy/dt = -y, y(0) = 1
const solver = new OdeSolverRK4((t, y) => -y, 1);
solver.step(0.01);  // Avanza dt = 0.01
const state = solver.getState();  // Obtiene estado actual
solver.reset(2);  // Reinicia con condición inicial = 2
```

## Documentación

⚠️ Documentación pendiente (v2.0)
