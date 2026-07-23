/*
 * VerneMath — compilador de expresiones f(x) escritas por el usuario.
 *
 * Combina lo mejor de los dos parseadores que existían por separado en
 * Verne Labs (derivadas y Plano XY):
 *   - Multiplicación implícita (2x, 3(x+1), x(x-1)) y distinción entre
 *     log (base 10) y ln (natural), de Plano XY.
 *   - Lista blanca de caracteres tras la sustitución y prueba de la
 *     función con varios valores antes de aceptarla, de derivadas.
 *   - Un bloqueo explícito de identificadores globales peligrosos
 *     (alert, document, fetch...) que ninguno de los dos tenía.
 *
 * Uso:
 *   const fn = VerneMath.compile('2x(x-1) + sin(x)');
 *   const y = VerneMath.safeEvaluate(fn, 3.5);
 */
(function (global) {
  'use strict';

  var DEFAULT_TEST_VALUES = [-3, -2, -1, -0.5, 0.5, 1, 2, 3];

  var ALLOWED_CHARS = /[^0-9xX+\-*/().,\sMPIEabcdefghilnopqrstu]/;
  var DANGEROUS_IDENTIFIERS = /\b(window|document|alert|confirm|prompt|fetch|eval|Function|import|require|top|parent|self|globalThis|location|cookie|XMLHttpRequest|WebSocket|localStorage|sessionStorage|constructor|__proto__|process)\b/i;

  function insertImplicitMultiplication(expr) {
    var s = expr;
    s = s.replace(/(\d)([a-zA-Z(])/g, '$1*$2');
    s = s.replace(/([xX)])\(/g, '$1*(');
    s = s.replace(/\)([a-zA-Z])/g, ')*$1');
    s = s.replace(/([xX)])(\d)/g, '$1*$2');
    return s;
  }

  function substituteFunctions(expr) {
    return expr
      .replace(/\bln\s*\(/gi, '__NATURAL_LOG__')
      .replace(/\blog\s*\(/gi, 'Math.log10(')
      .replace(/__NATURAL_LOG__/g, 'Math.log(')
      .replace(/\bsin\s*\(/gi, 'Math.sin(')
      .replace(/\bcos\s*\(/gi, 'Math.cos(')
      .replace(/\btan\s*\(/gi, 'Math.tan(')
      .replace(/\bsqrt\s*\(/gi, 'Math.sqrt(')
      .replace(/\babs\s*\(/gi, 'Math.abs(')
      .replace(/\bexp\s*\(/gi, 'Math.exp(')
      .replace(/\bfloor\s*\(/gi, 'Math.floor(')
      .replace(/\bceil\s*\(/gi, 'Math.ceil(')
      .replace(/\bround\s*\(/gi, 'Math.round(')
      .replace(/\bpi\b/gi, 'Math.PI')
      .replace(/\be\b/g, 'Math.E');
  }

  function normalize(raw, options) {
    var expr = String(raw).trim().replace(/π/g, 'pi');
    if (options.decimalComma !== false) {
      expr = expr.replace(/(\d),(\d)/g, '$1.$2');
    }
    return expr;
  }

  function sanitize(raw, options) {
    var expr = normalize(raw, options);
    expr = insertImplicitMultiplication(expr);
    expr = substituteFunctions(expr);
    expr = expr.replace(/\^/g, '**');
    return expr;
  }

  function compile(raw, options) {
    options = options || {};
    var variable = options.variable || 'x';
    var expr = sanitize(raw, options);

    if (DANGEROUS_IDENTIFIERS.test(raw)) {
      throw new Error('La expresión usa un nombre no permitido.');
    }

    if (ALLOWED_CHARS.test(expr)) {
      throw new Error('La expresión contiene caracteres no admitidos.');
    }

    var fn;
    try {
      fn = new Function(
        variable,
        'var y = ' + expr + ';\n' +
        'if (!Number.isFinite(y)) return NaN;\n' +
        'return y;'
      );
    } catch (error) {
      throw new Error('No se ha podido interpretar la expresión.');
    }

    var testValues = options.testValues || DEFAULT_TEST_VALUES;
    for (var i = 0; i < testValues.length; i += 1) {
      try {
        fn(testValues[i]);
      } catch (error) {
        throw new Error('La expresión falla al evaluarla (revisa nombres de variables y funciones).');
      }
    }

    return fn;
  }

  function safeEvaluate(fn, x) {
    try {
      var y = fn(x);
      return Number.isFinite(y) ? y : NaN;
    } catch (error) {
      return NaN;
    }
  }

  /**
   * Parsear una línea de expresión con metadata opcional (color)
   * Formato: "expresión ; color" o solo "expresión"
   * Ejemplo: "x^2 ; red" → {expr: "x^2", color: "red", fn: compiledFunction}
   *          "sin(x)" → {expr: "sin(x)", color: null, fn: compiledFunction}
   */
  function parseExpression(line, options) {
    options = options || {};
    var parts = String(line).split(';');
    var expr = parts[0].trim();
    var color = (parts[1] && parts[1].trim()) || null;

    try {
      var fn = compile(expr, options);
      return {
        expr: expr,
        color: color,
        fn: fn
      };
    } catch (error) {
      return {
        expr: expr,
        color: color,
        fn: null,
        error: error.message
      };
    }
  }

  global.VerneMath = {
    compile: compile,
    safeEvaluate: safeEvaluate,
    parseExpression: parseExpression,
    insertImplicitMultiplication: insertImplicitMultiplication,
  };
})(window);
