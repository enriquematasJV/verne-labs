# KinematicsEngine — Motor de cinemática

Motor que calcula posiciones y velocidades en movimientos 1D y 2D (tiro parabólico, movimiento circular).

## Métodos

**Movimiento rectilíneo 1D:**
- `position1D(x0, v0, a, t)` — Posición en 1D: x = x₀ + v₀t + ½at²
- `velocity1D(v0, a, t)` — Velocidad en 1D: v = v₀ + at

**Encuentro de móviles:**
- `meetingData1D(x1_0, v1_0, a1, x2_0, v2_0, a2)` — Calcula si/cuándo se encuentran dos móviles con aceleración

**Tiro parabólico:**
- `projectileMotion(v0, angleRad, t)` — Posición (x, y) y velocidad (vx, vy) en tiro parabólico
  - Retorna: `{x, y, vx, vy}`
  - Nota: Gravedad fija (G = 9.81 m/s²)

**Movimiento circular:**
- `circularMotion(r, omega, t)` — Posición y velocidad en círculo
  - Retorna: `{x, y, theta, vt (velocidad tangencial), at (aceleración tangencial)}`

**Gravitación:**
- `gravity(m1, m2, r)` — Fuerza gravitatoria entre dos masas (Newtons)
- `gravityAccel(M, r)` — Aceleración gravitatoria en órbita

## Ejemplo: Tiro parabólico

```javascript
const engine = new KinematicsEngine();

const v0 = 20;              // Velocidad inicial
const angle = Math.PI / 4;  // 45°
const dt = 0.1;

for (let t = 0; t <= 3; t += dt) {
  const pos = engine.projectileMotion(v0, angle, t);
  console.log(`t=${t}: x=${pos.x.toFixed(2)}, y=${pos.y.toFixed(2)}`);
}
```

## Ejemplo: Encuentro de móviles

```javascript
const engine = new KinematicsEngine();

// Móvil 1: x1(0)=0, v1=10 m/s, a1=0
// Móvil 2: x2(0)=50, v2=0 m/s, a2=2 m/s²
const result = engine.meetingData1D(0, 10, 0, 50, 0, 2);

if (result.meets) {
  console.log(`Se encuentran en t=${result.time.toFixed(2)}s`);
  console.log(`Posición: x=${result.position.toFixed(2)}m`);
}
```
