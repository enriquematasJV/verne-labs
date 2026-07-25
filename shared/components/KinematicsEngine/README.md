# KinematicsEngine — Motor de cinemática

Motor que calcula posiciones, velocidades y aceleraciones en movimientos 1D y 2D (tiro parabólico, movimiento circular).

## Métodos

**Movimiento rectilíneo:**
- `position1D(x0, v0, a, t)` — Posición en 1D: x = x₀ + v₀t + ½at²
- `velocity1D(v0, a, t)` — Velocidad en 1D: v = v₀ + at

**Tiro parabólico:**
- `projectileMotion(x0, y0, vx0, vy0, g, t)` — Posición (x, y) en tiro parabólico
- `maxHeight(vy0, g)` — Altura máxima alcanzada
- `range(vx0, vy0, g, y0)` — Alcance horizontal

**Movimiento circular:**
- `circularMotion(r, omega, t, phase)` — Posición en círculo de radio r

**Encuentros y encuentros de móviles:**
- `meetingData1D(x1_0, v1, x2_0, v2)` — Calcula si se encuentran y en qué tiempo

## Ejemplo: Tiro parabólico

```javascript
const engine = new KinematicsEngine();

const x0 = 0, y0 = 0;
const vx0 = 20, vy0 = 15;  // 45° aprox
const g = 9.8;

// Calcular trayectoria
for (let t = 0; t <= 3; t += 0.1) {
  const pos = engine.projectileMotion(x0, y0, vx0, vy0, g, t);
  console.log(t, pos.x, pos.y);
}

const h_max = engine.maxHeight(vy0, g);
const range = engine.range(vx0, vy0, g, y0);
console.log(`Altura máxima: ${h_max.toFixed(2)}m`);
console.log(`Alcance: ${range.toFixed(2)}m`);
```
