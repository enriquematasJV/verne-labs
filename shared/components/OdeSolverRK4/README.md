# OdeSolverRK4 — Solucionador de EDOs por Runge-Kutta 4

Solucionador numérico para ecuaciones diferenciales ordinarias (EDOs) usando el método Runge-Kutta de orden 4.

## Métodos

**`constructor(derivativeFunc, initialCondition = 0)`**
- `derivativeFunc(t, y)` — Función que retorna dy/dt
- `initialCondition` — Valor inicial y(t₀)

**`step(dt)`** — Avanza un paso RK4 de tamaño dt
- Retorna: nuevo valor de y
- Actualiza internamente t y y

**`getState()`** — Retorna estado actual como objeto
- Retorna: `{t, y}`

**`reset(initialCondition, t = 0)`** — Reinicia a nuevo valor inicial

## Ejemplo: Decaimiento exponencial

```javascript
// dy/dt = -0.5y, y(0) = 100
const solver = new OdeSolverRK4((t, y) => -0.5 * y, 100);

const results = [];
for (let i = 0; i < 50; i++) {
  const {t, y} = solver.getState();
  results.push({t, y});
  solver.step(0.1);
}

// results muestra decaimiento exponencial
// Verificar: y(t) ≈ 100 * e^(-0.5*t)
```

## Limitación

Resuelve **sistemas escalares** de primer orden. Para orden superior, transformar a sistema 1D (p.ej. dy/dt = z, dz/dt = ...)
