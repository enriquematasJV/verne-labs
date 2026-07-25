# PhysicsEngine — Motor de física para simulaciones

Motor de física que calcula movimiento de objetos bajo fuerzas, gravedad y colisiones.

## ⚠️ Estado: EXPERIMENTAL

PhysicsEngine es actualmente un **esqueleto/stub**. Proporciona estructura básica pero sin implementación.

**Métodos vacíos:**
- `step(dt)` — No implementado
- `reset()` — No implementado

## Uso (estructura)

```javascript
<script src="../../shared/components/PhysicsEngine/PhysicsEngine.js"></script>

const engine = new PhysicsEngine(9.8);  // gravedad = 9.8 m/s²

// Agregar objeto (estructura)
engine.addObject({
  x: 0, y: 0,
  vx: 10, vy: 0,
  mass: 1
});

// Agregar fuerza (estructura)
engine.addForce({
  type: 'gravity',
  magnitude: 9.8
});

// Paso de simulación (vacío)
engine.step(0.016);
```

## Roadmap

Para usar PhysicsEngine en un laboratorio:
1. Definir alcance: ¿qué fuerzas soportar?
2. Elegir integrador: Euler, RK2, RK4, Verlet
3. Implementar colisiones: si/no, círculos/rectángulos/general
4. Completar métodos `step()` y `reset()`

Alternativamente, usa **KinematicsEngine** para movimientos sin fuerzas dinámicas, u **OdeSolverRK4** para sistemas de ecuaciones diferenciales.

## Ejemplo (pseudocódigo)

```javascript
// Cuando esté implementado:
const engine = new PhysicsEngine(9.8);
engine.addObject(particle);
engine.addForce({type: 'gravity'});

// Paso temporal
for (let t = 0; t < 10; t += 0.01) {
  engine.step(0.01);
  render(engine.objects);  // Visualizar estado actual
}
```
