# VerneMath — Compilador de expresiones matemáticas

Compilador seguro para expresiones f(x) escritas por el usuario, con soporte para:
- Multiplicación implícita: `2x`, `3(x+1)`, `x(x-1)`
- Funciones: `sin()`, `cos()`, `tan()`, `sqrt()`, `abs()`, `log()` (base 10), `ln()` (natural), `exp()`
- Constantes: `pi`, `e`
- Potencias: `x^2` (convertidas a `x**2`)
- Comillas invertidas en decimales: `3,5` → `3.5`

## Uso

```javascript
// Importar
<script src="../../shared/components/VerneMath/VerneMath.js"></script>

// Compilar una expresión
const fn = VerneMath.compile('2x(x-1) + sin(x)');

// Evaluar de forma segura
const y = VerneMath.safeEvaluate(fn, 3.5);
```

## Seguridad

- Validación de caracteres permitidos (lista blanca)
- Bloqueo de identificadores peligrosos: `window`, `document`, `alert`, `fetch`, `eval`, etc.
- Prueba automática con 8 valores por defecto antes de aceptar la función
- Manejo seguro de valores infinitos y NaN

## Opciones de compilación

```javascript
const fn = VerneMath.compile(expression, {
  variable: 'x',              // Variable independiente (default: 'x')
  testValues: [-2, -1, 0, 1], // Valores para validación (default: [-3, -2, -1, -0.5, 0.5, 1, 2, 3])
  decimalComma: true          // Convertir comas a puntos (default: true)
});
```

## Errores

Lanza excepciones con mensajes descriptivos:
- "La expresión usa un nombre no permitido" → Intenta acceder a objetos globales peligrosos
- "La expresión contiene caracteres no admitidos" → Uso de caracteres inválidos
- "No se ha podido interpretar la expresión" → Sintaxis JavaScript inválida
- "La expresión falla al evaluarla..." → Error durante evaluación con valores de prueba
