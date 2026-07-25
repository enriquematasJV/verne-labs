# CHECKLIST: Normalización de VerneLabs

**Propósito**: Tareas para hacer que VerneLabs sea completamente normalizado, documentado y fácil para que una IA genere nuevos labs con garantías.

**Estado**: Propuesta de trabajo

---

## 1. CONSOLIDACIÓN DE RUTAS (PRIORIDAD ALTA)

### Problema actual
```
Componentes duplicados en dos ubicaciones:
✗ /shared/js/graphics/Canvas2DRenderer.js  (viejo)
✓ /shared/components/Canvas2DRenderer/Canvas2DRenderer.js (nuevo)

✗ /shared/js/simulations/SimulationLifecycle.js  (viejo)
✓ /shared/components/SimulationLifecycle/SimulationLifecycle.js (nuevo)
```

### Solución
- [ ] Identificar cuál es la versión "autoridad" de cada componente
- [ ] Eliminar duplicados viejos
- [ ] Actualizar imports en todos los labs
- [ ] Documentar ruta canónica en README

### Checklist de migración
```
Componente           | Ubicación actual    | Nueva (propuesta) | Labs a actualizar
------------------- | ------------------- | --------------- | ----------------
Canvas2DRenderer    | shared/js/graphics/ | shared/components/ | derivadas, cinematica-2d, plano-inclinado
Vector2D            | shared/js/math/     | shared/components/ | cinematica-2d, plano-inclinado
PhysicsEngine       | shared/js/physics/  | shared/components/ | plano-inclinado
OdeSolverRK4        | shared/js/physics/  | shared/components/ | [verificar]
KinematicsEngine    | shared/js/physics/  | shared/components/ | plano-inclinado
SimulationLifecycle | shared/js/simulations/ | shared/components/ | cinematica-2d, [otros]
SliderControl       | shared/js/ui/       | shared/components/ | plano-inclinado
```

---

## 2. ESPECIFICACIÓN DE APIs (PRIORIDAD ALTA)

### Para cada componente SHARED

Crear un `README.md` con:

#### Template
```markdown
# [NombreComponente]

## Descripción
[1 párrafo]

## Uso
\`\`\`javascript
const component = new [Nombre](options);
component.method(param1, param2);
\`\`\`

## Constructor
**Parámetros**:
- `options` (Object):
  - `property1` (type): Descripción
  - `property2` (type): Descripción

**Lanza**: Error si validación falla

## Métodos

### method1(param1, param2): returnType
Descripción breve.

**Parámetros**:
- `param1` (type): Descripción
- `param2` (type): Descripción

**Retorna**: Descripción del retorno

**Efecto secundario**: Si modifica estado

**Ejemplo**:
\`\`\`javascript
// Código de ejemplo que funciona
\`\`\`

---

### method2(param): returnType
...

## Propiedades Públicas
- `prop1` (type): Descripción

## Casos de Uso

### Caso 1: [Descripción]
\`\`\`javascript
// Código completo que se copia del lab funcionando
\`\`\`

## Limitaciones Conocidas
- [Lista]

## Versión
1.0 | Fecha | Autor
```

### Componentes a documentar
- [ ] VerneMath
- [ ] GraphRenderer
- [ ] GraphNavigator
- [ ] Graph2DEngine
- [ ] Canvas2DRenderer
- [ ] Vector2D
- [ ] VectorRenderer
- [ ] MathematicalModelPanel
- [ ] SimulationLifecycle
- [ ] PhysicsEngine
- [ ] OdeSolverRK4
- [ ] KinematicsEngine
- [ ] SliderControl

---

## 3. VALIDACIÓN NUMÉRICA (PRIORIDAD MEDIA)

### Para cada laboratorio

Crear archivo `tests/[lab-name].test.js`:

```javascript
// tests/derivadas.test.js

const DerivadaModel = require('.../DerivadaModel.js');
const DerivadaConstants = require('.../DerivadaConstants.js');

describe('DerivadaModel', () => {
  let model;
  
  beforeEach(() => {
    model = new DerivadaModel(DerivadaConstants);
  });

  describe('Caso: f(x) = x²', () => {
    beforeEach(() => {
      model.setFunctionExpr('x^2');
    });

    test('safeEval(3) debería retornar 9', () => {
      expect(model.safeEval(3)).toBeCloseTo(9, 5);
    });

    test('derivativeApprox(2) debería ser ~4 (f\'(x)=2x)', () => {
      expect(model.derivativeApprox(2)).toBeCloseTo(4, 1);
    });

    test('calculateSecantSlope(1, 0.1) debería ser ~2.1', () => {
      expect(model.calculateSecantSlope(1, 0.1)).toBeCloseTo(2.1, 1);
    });
  });

  describe('Caso: f(x) = sin(x)', () => {
    beforeEach(() => {
      model.setFunctionExpr('sin(x)');
    });

    test('safeEval(0) debería retornar 0', () => {
      expect(model.safeEval(0)).toBeCloseTo(0, 5);
    });

    test('safeEval(π/2) debería retornar 1', () => {
      expect(model.safeEval(Math.PI / 2)).toBeCloseTo(1, 4);
    });
  });

  describe('Valores extremos', () => {
    test('Función sin compilar → safeEval retorna NaN', () => {
      model.compiled = null;
      expect(Number.isNaN(model.safeEval(1))).toBe(true);
    });

    test('h muy cercano a 0 → stepAnimateTowardsZero detiene', () => {
      model.h = 0.0005;
      const continues = model.stepAnimateTowardsZero();
      expect(continues).toBe(false);
    });
  });
});
```

### Labs a testear
- [ ] Derivadas
- [ ] Cinemática 2D
- [ ] Plano Inclinado
- [ ] Funciones-Inecuaciones
- [ ] [Nuevos labs]

---

## 4. ACCESIBILIDAD (PRIORIDAD MEDIA)

### Para cada lab, verificar:

- [ ] **Teclado**:
  - [ ] Tab navega entre todos los controles
  - [ ] Shift+Tab retrocede
  - [ ] Enter activa botones
  - [ ] Flechas cambian sliders (±1 unidad por flecha)

- [ ] **Canvas**:
  - [ ] aria-label describe el gráfico
  - [ ] Botón "Describir imagen" proporciona texto alternativo
  - [ ] No es la ÚNICA forma de acceder a información

- [ ] **Contraste**:
  - [ ] Texto sobre fondo: ratio ≥ 4.5:1 (AA)
  - [ ] Elementos interactivos: borde visible en focus

- [ ] **Responsive**:
  - [ ] 375px (mobile): ¿se ve legible? ¿funciona?
  - [ ] 768px (tablet): ¿layout es razonable?
  - [ ] 1920px (desktop): ¿no hay scroll horizontal?

---

## 5. DOCUMENTACIÓN (PRIORIDAD MEDIA)

### En cada carpeta de lab

- [ ] `README.md` con:
  - Descripción pedagógica (para profesor)
  - Modo de uso (para estudiante)
  - Parámetros y qué significan
  - Límites conocidos

### En `/shared/`
- [ ] `README.md` maestro listando todos los componentes
- [ ] `/shared/ARCHITECTURE.md` explicando la filosofía

### En raíz `/verne-labs/`
- [ ] `CONTRIBUTING.md`: Cómo contribuir un nuevo lab
- [ ] `TESTING.md`: Cómo validar un lab

---

## 6. RENDIMIENTO (PRIORIDAD BAJA)

### Para cada lab, medir:

- [ ] **FPS en dispositivo real**:
  - Objetivo: > 50 FPS en navegador moderno
  - Medir con DevTools → Performance

- [ ] **Memoria**:
  - No debe crecer indefinidamente
  - Verificar Heap en DevTools

- [ ] **Bundle size**:
  - Cada lab + shared components < 500KB sin comprimir

- [ ] **Tiempo de inicio**:
  - Primer frame < 2 segundos

---

## 7. CONFIGURACIÓN DE CI/CD (PRIORIDAD BAJA)

- [ ] GitHub Actions: Ejecutar tests en cada commit
- [ ] Validar que HTML se abre sin errores
- [ ] Verificar que canvas renderiza
- [ ] Generar reporte de cobertura

---

## Cronograma Sugerido

**Semana 1**: Consolidar rutas (1) + Documentar APIs (2)  
**Semana 2**: Validación numérica (3) + Accesibilidad (4)  
**Semana 3-4**: Documentación general (5) + Polish

---

## Beneficios

Una vez completado, una IA podrá:
- ✓ Generar labs sin acceso al repositorio (usando especificación completa)
- ✓ Validar que los labs sean correctos (tests numéricos)
- ✓ Garantizar integración (rutas normalizadas)
- ✓ Asegurar accesibilidad (checklist)
- ✓ Optimizar rendimiento (guías)

---

**Autor**: Claude (análisis de ChatGPT)  
**Fecha**: 2026-07-25  
**Estado**: Propuesta lista para revisión
