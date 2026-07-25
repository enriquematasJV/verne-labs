# OdeSolverRK4 — Solucionador de EDOs por Runge-Kutta 4

Solucionador numérico para ecuaciones diferenciales ordinarias (EDOs) usando el método Runge-Kutta de orden 4.

## Métodos

**`constructor(derivativeFunc, initialCondition)`**
- `derivativeFunc`: Función f(t, y) que retorna dy/dt
- `initialCondition`: Valor inicial y(0)

**`step(dt)`** — Avanza un paso de tiempo Runge-Kutta 4

**`getState()`** — Retorna valor actual de y

**`reset(newInitialCondition)`** — Reinicia a nuevo valor inicial

**`getTime()`** — Retorna tiempo actual

## Ejemplo: Decaimiento exponencial

```javascript
// dy/dt = -0.5y, y(0) = 100
const solver = new OdeSolverRK4((t, y) => -0.5 * y, 100);

const dt = 0.1;
const results = [];

for (let i = 0; i < 50; i++) {
  results.push({
    time: solver.getTime(),
    value: solver.getState()
  });
  solver.step(dt);
}

// results muestra decaimiento exponencial
```

## Ejemplo: Oscilador amortiguado

```javascript
// Segunda orden: x'' + 2·x' + 5·x = 0
// Reducir a sistema 1D: y = x, z = x'
// Luego: dy/dt = z, dz/dt = -5y - 2z

// Aquí simplificado para una variable:
const solver = new OdeSolverRK4((t, y) => {
  // Ecuación específica
  return -y - 0.5;  // Ejemplo simple
}, 1);

for (let t = 0; t < 10; t += 0.01) {
  solver.step(0.01);
}
```
